import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaBriefcase,
  FaTools,
  FaProjectDiagram,
  FaEnvelope,
} from "react-icons/fa";
import "./Navbar.css";
import netflixLogo from "../images/ak-logo-2.png";
import blueImage from "../images/blue.png";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profilePath, setProfilePath] = useState<string>("/browse");
  const [profileImage, setProfileImage] = useState(blueImage);

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

  const handleProfileClick = () => {
    console.log("Navigating to:", profilePath);
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

  return (
    <>
      <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
        <div className="navbar-left">
          <Link to="/" className="navbar-logo">
            <img src={netflixLogo} alt="Logo" />
          </Link>
          <ul className="navbar-links">
            <li>
              <Link
                to="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleProfileClick();
                }}
              >
                 Home
              </Link>
            </li>
            <li>
              <Link to="/work-experience">Professional</Link>
            </li>
            <li>
              <Link to="/skills">Skills</Link>
            </li>
            <li>
              <Link to="/projects">Projects</Link>
            </li>
            <li>
              <Link to="/contact-me">Hire Me</Link>
            </li>
          </ul>
        </div>
        <div className="navbar-right">
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
            onClick={() => navigate("/browse")} // Profile image always navigates to /browse
            style={{ cursor: "pointer" }}
          />
        </div>
      </nav>

      {/* Sidebar Overlay */}
      <div
        className={`sidebar-overlay ${isSidebarOpen ? "open" : ""}`}
        onClick={closeSidebar}
      ></div>

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-logo">
          <img src={netflixLogo} alt="Logo" />
        </div>
        <ul>
          <li>
            <Link
              to="#"
              onClick={(e) => {
                e.preventDefault();
                handleProfileClick();
              }}
            >
              <FaHome /> Home
            </Link>
          </li>
          <li>
            <Link to="/work-experience" onClick={closeSidebar}>
              <FaBriefcase /> Professional
            </Link>
          </li>
          <li>
            <Link to="/skills" onClick={closeSidebar}>
              <FaTools /> Skills
            </Link>
          </li>
          <li>
            <Link to="/projects" onClick={closeSidebar}>
              <FaProjectDiagram /> Projects
            </Link>
          </li>
          <li>
            <Link to="/contact-me" onClick={closeSidebar}>
              <FaEnvelope /> Hire Me
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Navbar;
