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
  const { videoName, season: seasonParam, episode: episodeParam } = useParams(); // Add season and episode params
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [currentSource, setCurrentSource] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(seasonParam || null);
  const [selectedEpisode, setSelectedEpisode] = useState(episodeParam || null);
  const [isQualitySelected, setIsQualitySelected] = useState(false);
  const [validVideo, setValidVideo] = useState(true);
  const [credits, setCredits] = useState(0);
  const [, setLastUpdated] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastWatchedTime, setLastWatchedTime] = useState(null);
  const [showPopup, setShowPopup] = useState(null);
  const [showRefresh, setShowRefresh] = useState(false);
  const [userName, setUserName] = useState(null); // Added to store the user's display name
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();

  const COST = 3;

  const isSeries = videoSources[videoName]?.type === "series";
  const seasons = isSeries ? Object.keys(videoSources[videoName].seasons) : [];
  const episodes = isSeries && selectedSeason ? Object.keys(videoSources[videoName].seasons[selectedSeason].episodes) : [];

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
        const videoKey = isSeries ? `${videoName}-${selectedSeason}` : videoName;

        if (docSnap.exists()) {
          const data = docSnap.data();
          const lastUpdatedTimestamp = data.lastUpdated?.toDate();
          const lastWatchedTimestamp = data.lastWatched?.[videoKey]?.toDate();
          const now = new Date();
          const timeDiff = lastUpdatedTimestamp ? (now - lastUpdatedTimestamp) / 1000 : 0;
          const timeSinceLastWatched = lastWatchedTimestamp ? (now - lastWatchedTimestamp) / 1000 : null;

          setCredits(data.credits);
          setLastUpdated(lastUpdatedTimestamp);
          setLastWatchedTime(lastWatchedTimestamp);
          setTimeLeft(timeSinceLastWatched ? 86400 - timeSinceLastWatched : timeDiff < 86400 ? 86400 - timeDiff : 0);
          setUserName(user.displayName || "user"); // Set userName from Firebase displayName, default to "user"
        } else {
          await setDoc(userDocRef, {
            credits: 20,    // Sets credits to 20 
            lastUpdated: Timestamp.now(),
            lastWatched: {},
          });
          setCredits(20);
          setLastUpdated(new Date());
          setTimeLeft(0);
          setUserName(user.displayName || "user"); // Set userName from Firebase displayName, default to "user"
        }
        setLoading(false);
      }
    });
    return () => unsubscribe();
    // eslint-disable-next-line
  }, [auth, db, navigate, videoName, selectedSeason]);

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
      const videoKey = isSeries ? `${videoName}-${selectedSeason}` : videoName;
      setLoading(true);
      await updateDoc(userDocRef, {
        credits: credits - COST,
        lastUpdated: Timestamp.now(),
        [`lastWatched.${videoKey}`]: Timestamp.now(),
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

        // Add video/series title
        const titleElement = document.createElement('div');
        titleElement.className = 'vjs-video-title';
        titleElement.innerText = isSeries ? `${videoName} - ${selectedSeason} ${selectedEpisode}` : videoName;
        player.el().insertBefore(titleElement, player.controlBar.el());

        // Add back button - Updated to navigate to "/profile/[userName]"
        const backButton = document.createElement('button');
        backButton.className = 'vjs-back-button';
        backButton.innerHTML = '<span>← Back</span>';
        backButton.onclick = () => navigate(`/profile/${userName || "user"}`); // Navigate to /profile/[userName]
        player.el().appendChild(backButton);

        // Add rewind and forward buttons
        const rewindButton = player.controlBar.addChild('Button', {
          className: 'vjs-rewind-button',
          controlText: 'Rewind 10s'
        });
        rewindButton.el().innerHTML = '<span>-10</span>';
        const handleRewind = () => player.currentTime(Math.max(0, player.currentTime() - 10));
        rewindButton.on('click', handleRewind);
        rewindButton.el().addEventListener('touchstart', (e) => {
          e.preventDefault();
          handleRewind();
        });
        player.controlBar.el().insertBefore(rewindButton.el(), player.controlBar.getChild('volumePanel').el());

        const forwardButton = player.controlBar.addChild('Button', {
          className: 'vjs-forward-button',
          controlText: 'Forward 10s'
        });
        forwardButton.el().innerHTML = '<span>+10</span>';
        const handleForward = () => player.currentTime(Math.min(player.duration(), player.currentTime() + 10));
        forwardButton.on('click', handleForward);
        forwardButton.el().addEventListener('touchstart', (e) => {
          e.preventDefault();
          handleForward();
        });
        player.controlBar.el().insertBefore(forwardButton.el(), player.controlBar.getChild('fullscreenToggle').el());

        player.el().addEventListener('contextmenu', (e) => e.preventDefault());

        const videoEl = player.el().querySelector('.vjs-tech');
        let tapTimer;
        videoEl.addEventListener('touchend', (e) => {
          e.preventDefault();
          clearTimeout(tapTimer);
          tapTimer = setTimeout(() => {
            if (player.paused()) player.play();
            else player.pause();
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

      const videoUrl = isSeries
        ? videoSources[videoName].seasons[selectedSeason].episodes[selectedEpisode][currentSource]
        : videoSources[videoName][currentSource];
      const encryptedUrl = encryptVideoUrl(videoUrl);
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
    // eslint-disable-next-line
  }, [validVideo, currentSource, isQualitySelected, videoName, selectedSeason, selectedEpisode, navigate, userName]); // Added userName to dependencies

  useEffect(() => {
    document.addEventListener('contextmenu', (e) => e.preventDefault());
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && (e.key === 'u' || e.key === 's' || e.key === 'i')) e.preventDefault();
    });
  }, []);

  if (loading) return <div className="loader"></div>;
  if (!validVideo) return <div>Video not found!</div>;

  return (
    <div className="netflix-stream-container">
      {!isQualitySelected ? (
        <div className="intro-screen">
          <h2>{videoName}</h2>
          {isSeries ? (
            <>
              <div className="season-selector">
                <label>Select Season:</label>
                <select
                  value={selectedSeason || ""}
                  onChange={(e) => {
                    setSelectedSeason(e.target.value);
                    setSelectedEpisode(null); // Reset episode when season changes
                    navigate(`/stream/${videoName}/${e.target.value}`);
                  }}
                >
                  <option value="" disabled>Select a season</option>
                  {seasons.map((season) => (
                    <option key={season} value={season}>{season}</option>
                  ))}
                </select>
              </div>
              {selectedSeason && (
                <div className="episode-selector">
                  <label>Select Episode:</label>
                  <select
                    value={selectedEpisode || ""}
                    onChange={(e) => {
                      setSelectedEpisode(e.target.value);
                      navigate(`/stream/${videoName}/${selectedSeason}/${e.target.value}`);
                    }}
                  >
                    <option value="" disabled>Select an episode</option>
                    {episodes.map((episode) => (
                      <option key={episode} value={episode}>{episode}</option>
                    ))}
                  </select>
                </div>
              )}
              {selectedSeason && selectedEpisode && (
                <>
                  {lastWatchedTime && timeLeft > 0 ? (
                    <p>Continue watching this season without Re-purchase for next {Math.floor(timeLeft / 3600)} hours.</p>
                  ) : (
                    <p>This season costs {COST} credits to watch.</p>
                  )}
                  <p>Your current credits: {credits}</p>
                  <div className="quality-buttons">
                    <button onClick={() => handleQualitySelection("1080p")}>1080p</button>
                    <button onClick={() => handleQualitySelection("720p")}>720p</button>
                    <button onClick={() => handleQualitySelection("480p")}>480p</button>
                  </div>
                </>
              )}
            </>
          ) : (
            <>
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
            </>
          )}
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
                <p>Are you sure you want to purchase this {isSeries ? "season" : "movie"} for {COST} credits?</p>
                <div className="popup-buttons">
                  <button onClick={handlePurchase}>Yes</button>
                  <button onClick={() => setShowPopup(null)}>No</button>
                </div>
              </>
            )}
            {showPopup === "credits" && (
              <>
                <h3>Insufficient Credits</h3>
                <p>You need {COST} credits to watch this {isSeries ? "season" : "movie"}. Please wait for auto renewal.</p>
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