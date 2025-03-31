import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import ProfileCard from "../components/ProfileCard";
import blueImage from "../images/2.webp";
import greyImage from "../images/1.webp";
import redImage from "../images/3.webp";
import addProfile from "../images/addProfile.webp";
import yellowImage from "../images/4.webp";
import Ayush from "../images/ak-logo-2.webp";
// import deafultGif from "../images/default.gif"
import "./browse.css";

// Initialize Firebase
import { auth, db } from "../firebase"; // Ensure Firebase is initialized correctly

interface Profile {
  name: string;
  image: string;
  backgroundGif?: string;
  isAddProfile?: boolean;
}

const Browse: React.FC = () => {
  const navigate = useNavigate();
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
  }, []);

  const handleProfileClick = async (profile: Profile) => {
    if (profile.isAddProfile) {
      try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const firstName = user.displayName?.split(" ")[0] || "User";
  
        setUser({
          firstName,
          displayName: user.displayName ?? undefined,
        });
  
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 2000);
  
        // Check if user already has a document
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
  
        if (!userDoc.exists()) {
          // If user does not exist, create a new document
          await setDoc(userDocRef, {
            firstName,
            credits: 10,
            lastUpdated: serverTimestamp(), // Store the timestamp
          });
        } else {
          // If user exists, check if credits need to be refreshed
          const userData = userDoc.data();
          const lastUpdated = userData.lastUpdated?.toDate();
          const today = new Date();
          if (!lastUpdated || lastUpdated.toDateString() !== today.toDateString()) {
            await updateDoc(userDocRef, {
              credits: 10, // Reset to 10 credits
              lastUpdated: serverTimestamp(),
            });
          }
        }
      } catch (error) {
        console.error("Google login failed", error);
      }
    } else {
      const backgroundGif = profile.backgroundGif || "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExOGlrMTU4MW51MXZhMnl1ajRsMjQybzd2OXVwMWg5ZTFyc2Z4N3VnbSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l4JySAWfMaY7w88sU/giphy.gif"; // Default for Google users
      localStorage.setItem("selectedProfile", JSON.stringify(profile));  // Store selected profile
      navigate(`/profile/${profile.name}`, {
        state: {
          profileImage: profile.image,
          backgroundGif: backgroundGif,
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
      backgroundGif: "https://media.giphy.com/media/Px7FQJqhWTGaA/giphy.gif?cid=ecf05e47eqienrmd5819lntubnqk0yzc3jdt2j1crekwb2fq&ep=v1_gifs_related&rid=giphy.gif&ct=g",
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
