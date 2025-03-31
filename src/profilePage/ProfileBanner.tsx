import React from "react";
import "./ProfileBanner.css";
import PlayButton from "../components/PlayButton";
import MoreInfoButton from "../components/MoreInfoButton";

const ProfileBanner: React.FC = () => {
  // Hardcoded banner data
  const bannerData = {
    headline: "Ayush Kumar", // Replace with your actual name
    profileSummary:
      "I’m Ayush Kumar, a Vellore Institute of Technology grad who turned a spark of curiosity into a firestorm of innovation through Artificial Intelligence and Machine Learning. I build bridges between ideas—full-stack web platforms, Flutter apps, and Deep Learning systems—fueled by an AWS Cloud edge. Winning The GoldenHack 3.0 and pioneering an Alzheimer’s detection tool during a research stint are just the beginning. How do I tame complexity into clarity? Dive in and find out.", // Replace with your summary
    resumeLink: {
      url: "https://drive.google.com/file/d/1dYSvpDX1zP5IKeDQA_HmPKgcAchlEUT0/view",
    },
    linkedinLink: "https://www.linkedin.com/in/cheesybit/",
  };

  const handlePlayClick = () => {
    window.open(bannerData.resumeLink.url, "_blank");
  };

  const handleLinkedinClick = () => {
    window.open(bannerData.linkedinLink, "_blank");
  };

  return (
    <div className="profile-banner">
      <div className="banner-content">
        <h1 className="banner-headline" id="headline">
          {bannerData.headline}
        </h1>
        <p className="banner-description">{bannerData.profileSummary}</p>

        <div className="banner-buttons">
          <PlayButton onClick={handlePlayClick} label="Resume" />
          <MoreInfoButton onClick={handleLinkedinClick} label="Linkedin" />
        </div>
      </div>
    </div>
  );
};

export default ProfileBanner;
