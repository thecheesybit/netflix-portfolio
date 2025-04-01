import React, { useRef, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "./stream.css"; // Netflix-style theme
import "videojs-hotkeys";
import videoSources from "../../videoSources"; // Import the video sources
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc, setDoc, Timestamp } from "firebase/firestore";

const Stream = () => {
  const { videoName } = useParams(); // Get the video name from the URL
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
  const [showPopup, setShowPopup] = useState(false); // Popup state
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();

  const COST = 4; // Cost to watch this movie

  // Check if the video name is valid
  useEffect(() => {
    if (!videoSources[videoName]) {
      setValidVideo(false);
      return;
    }
    setValidVideo(true);
  }, [videoName]);

  // Handle Google Authentication and fetch user's credits and last watched time
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // If not logged in, redirect to the homepage
        navigate("/");
      } else {
        // Fetch user credits, lastUpdated, and last watched time from Firestore
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
          setTimeLeft(timeDiff < 86400 ? 86400 - timeDiff : 0); // 86400 seconds = 24 hours
          setTimeLeft(timeSinceLastWatched ? 86400 - timeSinceLastWatched : 0); // Time left since the last watch

        } else {
          // If no user data, create a new document with default credits (10)
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

  // Handle quality selection and credit deduction
  const handleQualitySelection = async (quality) => {
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, "users", user.uid);

      if (lastWatchedTime && timeLeft > 0) {
        // User has watched this movie in the last 24 hours and doesn't need to pay again
        alert(`Continue watching this movie. Time left for Auto Renewal of credits: ${Math.floor(timeLeft / 3600)} hours.`);
        setCurrentSource(quality);
        setIsQualitySelected(true);
        return;
      }

      // Check if user has enough credits
      if (credits < COST) {
        // If credits are insufficient, show the time left to recharge
        alert(`You need ${COST} credits to watch this video. Please wait for auto renewal to happen.`);
        return;
      }

      // Trigger the popup to confirm purchase
      setShowPopup(true); // Show confirmation popup
    }

    setCurrentSource(quality);
    setIsQualitySelected(true);
  };

  // Handle the actual purchase
  const handlePurchase = async () => {
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, "users", user.uid);

      // Deduct 4 credits as the user has sufficient credits
      setLoading(true); // Show loading spinner
      await updateDoc(userDocRef, {
        credits: credits - COST,
        lastUpdated: Timestamp.now(),
        [`lastWatched.${videoName}`]: Timestamp.now(), // Save the time of last watched for this specific movie
      });

      setCredits(credits - COST); // Update state
      setLoading(false); // Hide loading spinner
      setShowPopup(false); // Close the popup
    }
  };

  // Initialize video.js player when quality is selected
  useEffect(() => {
    if (validVideo && currentSource) {
      if (!playerRef.current) {
        playerRef.current = videojs(videoRef.current, {
          controls: true,
          autoplay: true,
          preload: "auto",
          fluid: true,
          responsive: true,
          controlBar: {
            volumePanel: { inline: false },
            pictureInPictureToggle: false,
          },
          plugins: {
            hotkeys: {
              volumeStep: 0.1,
              seekStep: 5,
              enableModifiersForNumbers: false,
            },
          },
        });
      }
      playerRef.current.src([{ src: videoSources[videoName][currentSource], type: "video/mp4" }]);
      playerRef.current.play();
    }
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [validVideo, currentSource, videoName]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!validVideo) {
    return <div>Video not found!</div>;
  }

  // Render the video quality selection or video player
  return (
    <div className="netflix-stream-container">
      {!isQualitySelected ? (
        <div className="intro-screen">
          <h2>{videoName}</h2>
          {lastWatchedTime && timeLeft > 0 ? (
            <p>
              Auto Credit Renewal in next {Math.floor(timeLeft / 3600)} hours.
            </p>
          ) : (
            <p>This movie costs {COST} credits to watch.</p>
          )}
          <p>Your current credits: {credits}</p>

          {/* Hide the 'You don't have enough credits' message if already purchased */}
          {credits >= COST && !lastWatchedTime && timeLeft <= 0 ? (
            <p>Choose Quality to watch the movie.</p>
          ) : lastWatchedTime && timeLeft > 0 ? (
            <p>
              Continue watching without Re-purchase for NEXT{" "}
              {Math.floor(timeLeft / 3600)} HOURS.
            </p>
          ) : (
            <p>
              You don't have enough credits. Please wait for auto renewal (24hrs Max).
            </p>
          )}

          <div className="quality-buttons">
            <button onClick={() => handleQualitySelection("1080p")}>
              1080p
            </button>
            <button onClick={() => handleQualitySelection("720p")}>720p</button>
            <button onClick={() => handleQualitySelection("480p")}>480p</button>
          </div>

          {/* Display auto recharge time if applicable */}
          {timeLeft > 0 && !lastWatchedTime && (
            <p>Auto Credit Renewal in {Math.floor(timeLeft / 3600)} hours.</p>
          )}
        </div>
      ) : (
        <div className="video-wrapper">
          <video ref={videoRef} className="video-js vjs-theme-netflix" />
        </div>
      )}

      {/* Popup Confirmation */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-container">
            <h3>Confirm Purchase</h3>
            <p>Are you sure you want to purchase this movie for {COST} credits?</p>
            <div className="popup-buttons">
              <button onClick={handlePurchase}>Yes</button>
              <button onClick={() => setShowPopup(false)}>No</button>
            </div>
            <span className="close-popup" onClick={() => setShowPopup(false)}>×</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stream;
