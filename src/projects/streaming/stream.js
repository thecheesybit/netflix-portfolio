import React, { useRef, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "./stream.css";
import "videojs-hotkeys";
import videoSources from "../../videoSources";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc, setDoc, Timestamp } from "firebase/firestore";

// Simple XOR encryption with a key
const encryptVideoUrl = (url, key = "xai-stream-key") => {
  let encrypted = '';
  for (let i = 0; i < url.length; i++) {
    encrypted += String.fromCharCode(url.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return btoa(encrypted);
};

const decryptVideoUrl = (encrypted, key = "xai-stream-key") => {
  const decoded = atob(encrypted);
  let decrypted = '';
  for (let i = 0; i < decoded.length; i++) {
    decrypted += String.fromCharCode(decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return decrypted;
};

const Stream = () => {
  const { videoName } = useParams();
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [currentSource, setCurrentSource] = useState(null);
  const [isQualitySelected, setIsQualitySelected] = useState(false);
  const [validVideo, setValidVideo] = useState(true);
  const [credits, setCredits] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastWatchedTime, setLastWatchedTime] = useState(null);
  const [showPopup, setShowPopup] = useState(null);
  const [showRefresh, setShowRefresh] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();

  const COST = 4;

  useEffect(() => {
    const lockOrientation = async () => {
      if ('screen' in window && 'orientation' in window.screen && 'lock' in window.screen.orientation) {
        try {
          await window.screen.orientation.lock('landscape');
        } catch (err) {
          console.log('Orientation lock failed:', err);
        }
      }
    };

    const unlockOrientation = async () => {
      if ('screen' in window && 'orientation' in window.screen && 'unlock' in window.screen.orientation) {
        try {
          await window.screen.orientation.unlock();
        } catch (err) {
          console.log('Orientation unlock failed:', err);
        }
      }
    };

    if (isQualitySelected) {
      lockOrientation();
    }

    return () => {
      unlockOrientation();
    };
  }, [isQualitySelected]);

  useEffect(() => {
    if (!videoSources[videoName]) {
      setValidVideo(false);
      return;
    }
    setValidVideo(true);
  }, [videoName]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/");
      } else {
        const userDocRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userDocRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          const lastUpdatedTimestamp = data.lastUpdated?.toDate();
          const lastWatchedTimestamp = data.lastWatched?.[videoName]?.toDate();
          const now = new Date();
          const timeDiff = lastUpdatedTimestamp ? (now - lastUpdatedTimestamp) / 1000 : 0;
          const timeSinceLastWatched = lastWatchedTimestamp ? (now - lastWatchedTimestamp) / 1000 : null;
          
          setCredits(data.credits);
          setLastUpdated(lastUpdatedTimestamp);
          setLastWatchedTime(lastWatchedTimestamp);
          setTimeLeft(timeSinceLastWatched ? 86400 - timeSinceLastWatched : timeDiff < 86400 ? 86400 - timeDiff : 0);
        } else {
          await setDoc(userDocRef, {
            credits: 10,
            lastUpdated: Timestamp.now(),
            lastWatched: {},
          });
          setCredits(10);
          setLastUpdated(new Date());
          setTimeLeft(0);
        }
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [auth, db, navigate, videoName]);

  const handleQualitySelection = (quality) => {
    const user = auth.currentUser;
    if (user) {
      if (lastWatchedTime && timeLeft > 0) {
        setCurrentSource(quality);
        setIsQualitySelected(true);
        return;
      }

      if (credits < COST) {
        setShowPopup("credits");
        return;
      }

      setShowPopup("purchase");
      setCurrentSource(quality);
    }
  };

  const handlePurchase = async () => {
    const user = auth.currentUser;
    if (user && currentSource) {
      const userDocRef = doc(db, "users", user.uid);
      setLoading(true);
      await updateDoc(userDocRef, {
        credits: credits - COST,
        lastUpdated: Timestamp.now(),
        [`lastWatched.${videoName}`]: Timestamp.now(),
      });

      setCredits(credits - COST);
      setLastWatchedTime(new Date());
      setTimeLeft(86400);
      setLoading(false);
      setShowPopup(null);
      setIsQualitySelected(true);
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  useEffect(() => {
    let errorTimer;
    if (validVideo && currentSource && isQualitySelected) {
      if (!playerRef.current) {
        playerRef.current = videojs(videoRef.current, {
          controls: true,
          autoplay: true,
          preload: "auto",
          fluid: true,
          responsive: true,
          inactivityTimeout: 5000,
          controlBar: {
            volumePanel: { inline: false, vertical: true },
            pictureInPictureToggle: false,
            children: [
              'playToggle',
              'volumePanel',
              'currentTimeDisplay',
              'progressControl',
              'remainingTimeDisplay',
              'fullscreenToggle'
            ]
          },
          plugins: {
            hotkeys: {
              volumeStep: 0.1,
              seekStep: 5,
              enableModifiersForNumbers: false,
            },
          },
        });

        const player = playerRef.current;

        // Add video title above progress bar
        const titleElement = document.createElement('div');
        titleElement.className = 'vjs-video-title';
        titleElement.innerText = videoName;
        player.el().insertBefore(titleElement, player.controlBar.el());

        // Add back button in top-left corner
        const backButton = document.createElement('button');
        backButton.className = 'vjs-back-button';
        backButton.innerHTML = '<span>← Back</span>';
        backButton.onclick = () => navigate(-1);
        player.el().appendChild(backButton);

        // Add rewind button manually
        const rewindButton = player.controlBar.addChild('Button', {
          className: 'vjs-rewind-button',
          controlText: 'Rewind 10s'
        });
        rewindButton.el().innerHTML = '<span>-10</span>';
        const handleRewind = () => {
          const currentTime = player.currentTime();
          player.currentTime(Math.max(0, currentTime - 10));
        };
        rewindButton.on('click', handleRewind);
        // Add touch event for mobile
        rewindButton.el().addEventListener('touchstart', (e) => {
          e.preventDefault();
          handleRewind();
        });
        player.controlBar.el().insertBefore(rewindButton.el(), player.controlBar.getChild('volumePanel').el());

        // Add forward button manually
        const forwardButton = player.controlBar.addChild('Button', {
          className: 'vjs-forward-button',
          controlText: 'Forward 10s'
        });
        forwardButton.el().innerHTML = '<span>+10</span>';
        const handleForward = () => {
          const currentTime = player.currentTime();
          const duration = player.duration();
          player.currentTime(Math.min(duration, currentTime + 10));
        };
        forwardButton.on('click', handleForward);
        // Add touch event for mobile
        forwardButton.el().addEventListener('touchstart', (e) => {
          e.preventDefault();
          handleForward();
        });
        player.controlBar.el().insertBefore(forwardButton.el(), player.controlBar.getChild('fullscreenToggle').el());

        // Prevent right-click
        player.el().addEventListener('contextmenu', (e) => {
          e.preventDefault();
        });

        // Touch controls (only for play/pause toggle)
        const videoEl = player.el().querySelector('.vjs-tech');
        let tapTimer;
        videoEl.addEventListener('touchend', (e) => {
          e.preventDefault();
          clearTimeout(tapTimer);
          tapTimer = setTimeout(() => {
            if (player.paused()) {
              player.play();
            } else {
              player.pause();
            }
          }, 200);
        });

        player.on('error', () => {
          errorTimer = setTimeout(() => setShowRefresh(true), 10000);
        });

        player.on('loadedmetadata', () => {
          clearTimeout(errorTimer);
          setShowRefresh(false);
        });
      }
      
      const encryptedUrl = encryptVideoUrl(videoSources[videoName][currentSource]);
      playerRef.current.src([{ src: decryptVideoUrl(encryptedUrl), type: "video/mp4" }]);
      playerRef.current.play().catch(() => {
        errorTimer = setTimeout(() => setShowRefresh(true), 10000);
      });
    }
    
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
      clearTimeout(errorTimer);
    };
  }, [validVideo, currentSource, isQualitySelected, videoName, navigate]);

  useEffect(() => {
    document.addEventListener('contextmenu', (e) => e.preventDefault());
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && (e.key === 'u' || e.key === 's' || e.key === 'i')) {
        e.preventDefault();
      }
    });
  }, []);

  if (loading) return <div className="loader">Loading...</div>;
  if (!validVideo) return <div>Video not found!</div>;

  return (
    <div className="netflix-stream-container">
      {!isQualitySelected ? (
        <div className="intro-screen">
          <h2>{videoName}</h2>
          {lastWatchedTime && timeLeft > 0 ? (
            <p>Continue watching without Re-purchase for next {Math.floor(timeLeft / 3600)} hours.</p>
          ) : (
            <p>This movie costs {COST} credits to watch.</p>
          )}
          <p>Your current credits: {credits}</p>
          
          <div className="quality-buttons">
            <button onClick={() => handleQualitySelection("1080p")}>1080p</button>
            <button onClick={() => handleQualitySelection("720p")}>720p</button>
            <button onClick={() => handleQualitySelection("480p")}>480p</button>
          </div>
        </div>
      ) : (
        <div className="video-container">
          <div className="video-wrapper">
            <video ref={videoRef} className="video-js vjs-theme-netflix" />
          </div>
          {showRefresh && (
            <button className="refresh-button" onClick={handleRefresh}>
              Refresh Video
            </button>
          )}
        </div>
      )}

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-container">
            {showPopup === "purchase" && (
              <>
                <h3>Confirm Purchase</h3>
                <p>Are you sure you want to purchase this movie for {COST} credits?</p>
                <div className="popup-buttons">
                  <button onClick={handlePurchase}>Yes</button>
                  <button onClick={() => setShowPopup(null)}>No</button>
                </div>
              </>
            )}
            {showPopup === "credits" && (
              <>
                <h3>Insufficient Credits</h3>
                <p>You need {COST} credits to watch this video. Please wait for auto renewal.</p>
                <div className="popup-buttons">
                  <button onClick={() => setShowPopup(null)}>OK</button>
                </div>
              </>
            )}
            <span className="close-popup" onClick={() => setShowPopup(null)}>×</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stream;