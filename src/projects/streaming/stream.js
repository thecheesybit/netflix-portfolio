import React, { useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "./stream.css"; // Netflix-style theme
import "videojs-hotkeys";
import videoSources from "../../videoSources"; // Import the video sources

const Stream = () => {
  const { videoName } = useParams(); // Get the video name from the URL
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [currentSource, setCurrentSource] = useState(null);
  const [isQualitySelected, setIsQualitySelected] = useState(false);
  const [validVideo, setValidVideo] = useState(true);

  // Check if the video name is valid
  useEffect(() => {
    if (!videoSources[videoName]) {
      setValidVideo(false);
      return;
    }
    setValidVideo(true);
  }, [videoName]);

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

  const handleQualitySelection = (quality) => {
    setCurrentSource(quality);
    setIsQualitySelected(true);
  };

  if (!validVideo) {
    return <div>Video not found!</div>;
  }

  return (
    <div className="netflix-stream-container">
      {!isQualitySelected ? (
        <div className="intro-screen">
          <h2>{videoName}</h2>
          <p>Choose Quality</p>
          <div className="quality-buttons">
            <button onClick={() => handleQualitySelection("1080p")}>1080p</button>
            <button onClick={() => handleQualitySelection("720p")}>720p</button>
            <button onClick={() => handleQualitySelection("480p")}>480p</button>
          </div>
        </div>
      ) : (
        <div className="video-wrapper">
          <video ref={videoRef} className="video-js vjs-theme-netflix" />
        </div>
      )}
    </div>
  );
};

export default Stream;
