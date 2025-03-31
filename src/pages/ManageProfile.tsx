import React, { useState } from "react";
import { auth } from "../firebase";
import {
  deleteUser,
  signOut,
  reauthenticateWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./manageProfile.css";
import yellowImage from "../images/4.png"; // Profile Image

const ManageProfile: React.FC = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const [error, setError] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const provider = new GoogleAuthProvider();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const handleDeleteAccount = async () => {
    if (user) {
      try {
        await reauthenticateWithPopup(user, provider); // Re-authenticate
        await deleteUser(user);
        
        // Show popup and redirect
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          navigate("/");
        }, 2000);
      } catch (error: any) {
        console.error("Failed to delete account", error);
        setError(error.message);
      }
    }
  };

  return (
    <div className="manage-profile-modal">
      <div className="manage-profile-container">
        {/* Close Button */}
        <button className="close-btn" onClick={() => navigate(-1)}>×</button>

        {/* Title */}
        <h2 className="manage-title">Manage Profile</h2>

        {/* Profile Image */}
        <div className="profile-avatar">
          <img src={yellowImage} alt="Profile Avatar" />
        </div>

        {/* Display Name */}
        <h3 className="profile-name">{user?.displayName || "User"}</h3>

        {/* Error Message */}
        {error && <p className="error-message">{error}</p>}

        {/* Buttons */}
        <div className="profile-actions">
          <button onClick={handleLogout} className="logout-btn">Logout</button>
          <button onClick={handleDeleteAccount} className="delete-btn">Delete Profile</button>
        </div>
      </div>

      {/* Netflix-Style Success Popup */}
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>✔ Account Deleted</h2>
            <p>We're sad to see you go!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProfile;
