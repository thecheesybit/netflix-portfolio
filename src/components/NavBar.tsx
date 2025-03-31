import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaBriefcase,
  FaTools,
  FaProjectDiagram,
  FaEnvelope,
  FaCoins, // Credit Icon
} from "react-icons/fa";
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import "./Navbar.css";
import netflixLogo from "../images/ak-logo-2.png";
import blueImage from "../images/blue.png";
import google from "../images/google.svg"

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profilePath, setProfilePath] = useState<string>("/browse");
  const [profileImage, setProfileImage] = useState(blueImage);
  const [user, setUser] = useState<{ uid: string; displayName?: string } | null>(null);
  const [credits, setCredits] = useState<number | null>(null);
  const [showCreditsPopup, setShowCreditsPopup] = useState(false);

  useEffect(() => {
    // Load selected profile from localStorage
    const savedProfile = localStorage.getItem("selectedProfile");
    if (savedProfile) {
      try {
        const profileData = JSON.parse(savedProfile);
        if (profileData?.name) {
          setProfilePath(`/profile/${profileData.name}`);
          setProfileImage(profileData.image || blueImage);
        }
      } catch (error) {
        console.error("Error parsing profile data from localStorage:", error);
      }
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser({
          uid: currentUser.uid,
          displayName: currentUser.displayName ?? "User",
        });

        // Fetch credits from Firestore
        const userDoc = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userDoc);

        if (userSnap.exists()) {
          setCredits(userSnap.data().credits);
        } else {
          setCredits(10); // Default credits if not found
        }
      } else {
        setUser(null);
        setCredits(null);
      }
    });

    return () => unsubscribe();
  }, [auth, db]);

  const handleProfileClick = () => {
    navigate(profilePath);
  };

  const handleScroll = () => {
    setIsScrolled(window.scrollY > 80);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };

  return (
    <>
      <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
        <div className="navbar-left">
          <Link to="/" className="navbar-logo">
            <img src={netflixLogo} alt="Logo" />
          </Link>
          <ul className="navbar-links">
            <li>
              <Link to="#" onClick={(e) => { e.preventDefault(); handleProfileClick(); }}>
                Home
              </Link>
            </li>
            <li><Link to="/work-experience">Professional</Link></li>
            <li><Link to="/skills">Skills</Link></li>
            <li><Link to="/projects">Projects</Link></li>
            <li><Link to="/contact-me">Hire Me</Link></li>
          </ul>
        </div>

        <div className="navbar-right">
          {/* Show Credits Icon for Desktop */}
          {user && (
            <div 
              className="credits-container"
              onMouseEnter={() => setShowCreditsPopup(true)}
              onMouseLeave={() => setShowCreditsPopup(false)}
            >
              <FaCoins className="credits-icon" style={{ color: "#e50914" }} />
              {showCreditsPopup && (
                <div className="credits-popup">
                  {credits !== null ? `Credits: ${credits}` : "Loading..."}
                </div>
              )}
            </div>
          )}

          {/* Hamburger menu for mobile */}
          <div className="hamburger" onClick={toggleSidebar}>
            <div></div>
            <div></div>
            <div></div>
          </div>

          <img
            src={profileImage}
            alt="Profile"
            className="profile-icon"
            onClick={() => navigate("/browse")}
            style={{ cursor: "pointer" }}
          />
        </div>
      </nav>

      {/* Sidebar Overlay */}
      <div className={`sidebar-overlay ${isSidebarOpen ? "open" : ""}`} onClick={closeSidebar}></div>

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        {/* Logo inside sidebar (Clickable in mobile) */}
        <div
          className="sidebar-logo"
          onClick={() => {
            navigate(profilePath); // Redirects to the selected profile
            closeSidebar(); // Closes the sidebar after clicking
          }}
          style={{ cursor: "pointer" }}
        >
          <img src={netflixLogo} alt="Logo" />
        </div>

        <ul>
          {/* Show credits instead of Home in Mobile */}
          {user ? (
            <li className="credits-text">
              <FaCoins style={{ color: "#e50914" }} />
              Credits: {credits !== null ? credits : "Loading..."}
            </li>
          ) : (
            // Google Login Button for Guests
            <li className="google-login">
              <button onClick={handleGoogleLogin} className="google-login-btn">
                <img
                  src={google}
                  alt="Google Logo"
                  className="google-logo-img"
                />
                Sign In
              </button>
            </li>
          )}
          <li><Link to="/work-experience" onClick={closeSidebar}><FaBriefcase /> Professional</Link></li>
          <li><Link to="/skills" onClick={closeSidebar}><FaTools /> Skills</Link></li>
          <li><Link to="/projects" onClick={closeSidebar}><FaProjectDiagram /> Projects</Link></li>
          <li><Link to="/contact-me" onClick={closeSidebar}><FaEnvelope /> Hire Me</Link></li>
        </ul>
        {/* Footnote for mobile sign-in */}
        <small className="sign-in-footnote">
          {user ? "Credits get refreshed every 24 Hours" : "Sign in to test featured projects."}
        </small>
      </div>
    </>
  );
};

export default Navbar;
