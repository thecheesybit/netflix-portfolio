import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import ProfileCard from "../components/ProfileCard";
import blueImage from "../images/2.webp";
import greyImage from "../images/1.webp";
import redImage from "../images/3.webp";
import addProfile from "../images/addProfile.webp";
import yellowImage from "../images/4.webp";
import Ayush from "../images/ak-logo-2.webp";
import "./browse.css";

interface Profile {
  name: string;
  image: string;
  backgroundGif?: string;
  isAddProfile?: boolean;
}


const Browse: React.FC = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  const [user, setUser] = useState<{ firstName: string; displayName?: string } | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const firstName = currentUser.displayName?.split(" ")[0] || "User";
        setUser({
          firstName,
          displayName: currentUser.displayName ?? undefined, // Convert null to undefined
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const handleProfileClick = async (profile: Profile) => {
    if (profile.isAddProfile) {
      try {
        const result = await signInWithPopup(auth, provider);
        const firstName = result.user.displayName?.split(" ")[0] || "User";
        setUser({
          firstName,
          displayName: result.user.displayName ?? undefined,
        });

        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 2000);
      } catch (error) {
        console.error("Google login failed", error);
      }
    } else {
      // Store full profile object in localStorage
      localStorage.setItem("selectedProfile", JSON.stringify(profile));

      navigate(`/profile/${profile.name}`, {
        state: {
          profileImage: profile.image,
          backgroundGif: profile.backgroundGif,
        },
      });
    }
  };

  const handleManageProfiles = () => {
    if (user) {
      navigate("/manage-profile");
    }
  };

  const predefinedProfiles: Profile[] = [
    {
      name: "recruiter",
      image: blueImage,
      backgroundGif: "https://i.giphy.com/media/16u7Ifl2T4zYfQ932F/giphy.gif",
    },
    {
      name: "developer",
      image: greyImage,
      backgroundGif: "https://media.giphy.com/media/tIE1Po4CoWac/giphy.gif",
    },
    {
      name: "stalker",
      image: redImage,
      backgroundGif: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOWkxY3d5Yzlva2g2ZHByNTUzaW1janQwa3dpdHc1cGN1eG83bDR1NCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/eSsFuHHBpIBRW2Ivel/giphy.gif",
    },
  ];

  const userProfile: Profile = user
    ? {
        name: user.firstName || "User",
        image: yellowImage,
      }
    : {
        name: "Add Profile",
        image: addProfile,
        isAddProfile: true,
      };

  return (
    <div className="browse-container">
      {/* Header */}
      <header className="custom-header">
        <div className="logo-container" onClick={() => navigate("/")}>
          <img src={Ayush} alt="Ayush Kumar Logo" className="ayush-logo" />
        </div>
      </header>

      {/* Profile Selection */}
      <div className="profile-content">
        <h1 className="who-is-watching">Who's watching?</h1>
        <div className="profiles">
          {[...predefinedProfiles, userProfile].map((profile, index) => (
            <ProfileCard
              key={index}
              name={profile.name}
              image={profile.image}
              backgroundGif={profile.backgroundGif}
              onClick={() => handleProfileClick(profile)}
              isAddProfile={profile.isAddProfile}
            />
          ))}
        </div>

        {/* Manage Profiles Button */}
        <button
          className={`manage-profiles-btn ${!user ? "disabled" : ""}`}
          onClick={handleManageProfiles}
          disabled={!user}
        >
          Manage Profiles
        </button>
      </div>

      {/* Footer */}
      <footer className="custom-footer">
        <div className="footer-content">
          <div className="portfolio-notice">
            <p className="disclaimer">
              "This project is solely for portfolio demonstration purposes, showcasing technical skills and expertise.
              All trademarks, brand names, and content remain the property of their respective owners. No commercial use
              or affiliation is intended. This work is inspired by publicly available knowledge and open-source
              references, adhering to fair use principles."
            </p>
          </div>
        </div>
      </footer>

      {/* Login Popup */}
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>✔ Login Successful!</h2>
            <p>Welcome, {user?.firstName || "User"}!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Browse;
