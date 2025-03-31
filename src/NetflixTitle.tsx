import React, { useEffect, useState } from "react";
import "./NetflixTitle.css";
import netflixSound from "./netflix-sound.mp3";
import { useNavigate } from "react-router-dom";
import logoImage from "../src/images/ak-logo.png"; // Your logo path

const NetflixTitle = () => {
  const [isClicked, setIsClicked] = useState(false);
  const navigate = useNavigate();
  const [audioPlayed, setAudioPlayed] = useState(false);

  const handlePlaySound = () => {
    if (!audioPlayed) {
      const audio = new Audio(netflixSound);
      audio.play().catch((error) => console.error("Audio play error:", error));
      setAudioPlayed(true);
      setIsClicked(true);
    }
  };

  useEffect(() => {
    if (isClicked) {
      const timer = setTimeout(() => {
        navigate("/browse");
      }, 4000); // Transition after animation completes
      return () => clearTimeout(timer);
    }
  }, [isClicked, navigate]);

  return (
    <div className="netflix-container" onClick={handlePlaySound}>
      <div className={`netflix-lines ${isClicked ? "show-lines" : ""}`}></div>
      <img
        src={logoImage}
        alt="Custom Logo"
        className={`netflix-logo ${isClicked ? "animate" : ""}`}
      />
    </div>
  );
};

export default NetflixTitle;
