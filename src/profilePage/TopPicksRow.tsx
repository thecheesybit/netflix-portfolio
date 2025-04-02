import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import './TopPicksRow.css';
import { FaPassport, FaCode, FaBriefcase, FaCertificate, FaHandsHelping, FaProjectDiagram, FaEnvelope, FaMusic } from 'react-icons/fa';

type ProfileType = 'recruiter' | 'developer' | 'stalker' | 'user';

interface TopPicksRowProps {
  profile: ProfileType;
}

const topPicksConfig = {
  recruiter: [
    { title: "Career Gap", imgSrc: "https://media.giphy.com/media/V54uolBNY5zVcsVrdc/giphy.gif?cid=790b7611l48evtkidjrdtim8d1gaz5c9kttplditotn923eh&ep=v1_gifs_search&rid=giphy.gif&ct=g", icon: <FaPassport />, route: "/career-gap" },
    { title: "Skills", imgSrc: "https://media.giphy.com/media/aBv5IC7zFOFjVVVs7I/giphy.gif?cid=790b7611ti9azf8lwh985qcp3yzpmu8an9my2wh27vr1kper&ep=v1_gifs_search&rid=giphy.gif&ct=g", icon: <FaCode />, route: "/skills" },
    { title: "Experience", imgSrc: "https://media.giphy.com/media/nHMViIeeBlhhS/giphy.gif?cid=ecf05e47kvd60lhxmsfx8vevcawse4zly6izxydsl9gatvsb&ep=v1_gifs_search&rid=giphy.gif&ct=g", icon: <FaBriefcase />, route: "/work-experience" },
    { title: "Certifications", imgSrc: "https://media.giphy.com/media/bAztItaKZWFLrj04LT/giphy.gif?cid=790b7611611vwatgghj7g4nxvjis7qk3eb9x5cn1oepau7n6&ep=v1_gifs_search&rid=giphy.gif&ct=g", icon: <FaCertificate />, route: "/certifications" },
    { title: "Recommendations", imgSrc: "https://media.giphy.com/media/3ohhwjkQvZoHwNtRCg/giphy.gif?cid=ecf05e47mwhw71h4d12hxn53y4tycsxaz3xdqpopfvpn01kh&ep=v1_gifs_related&rid=giphy.gif&ct=g", icon: <FaHandsHelping />, route: "/recommendations" },
    { title: "Projects", imgSrc: "https://images.unsplash.com/photo-1572177812156-58036aae439c?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvamVjdHxlbnwwfHwwfHx8MA%3D%3D", icon: <FaProjectDiagram />, route: "/projects" },
    { title: "Contact Me", imgSrc: "https://media.giphy.com/media/oC5V6VFUiwPjjMN4Xe/giphy.gif?cid=790b7611j0ld3dkipe4h4ydnyoj5ozy7um1s85s6cq9gbcpp&ep=v1_gifs_search&rid=giphy.gif&ct=g", icon: <FaEnvelope />, route: "/contact-me" }
  ],
  developer: [
    { title: "Skills", imgSrc: "https://media.giphy.com/media/aBv5IC7zFOFjVVVs7I/giphy.gif?cid=790b7611ti9azf8lwh985qcp3yzpmu8an9my2wh27vr1kper&ep=v1_gifs_search&rid=giphy.gif&ct=g", icon: <FaCode />, route: "/skills" },
    { title: "Projects", imgSrc: "https://images.unsplash.com/photo-1572177812156-58036aae439c?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvamVjdHxlbnwwfHwwfHx8MA%3D%3D", icon: <FaProjectDiagram />, route: "/projects" },
    
    { title: "Experience", imgSrc: "https://media.giphy.com/media/nHMViIeeBlhhS/giphy.gif?cid=ecf05e47kvd60lhxmsfx8vevcawse4zly6izxydsl9gatvsb&ep=v1_gifs_search&rid=giphy.gif&ct=g", icon: <FaBriefcase />, route: "/work-experience" },
    { title: "Recommendations", imgSrc: "https://media.giphy.com/media/3ohhwjkQvZoHwNtRCg/giphy.gif?cid=ecf05e47mwhw71h4d12hxn53y4tycsxaz3xdqpopfvpn01kh&ep=v1_gifs_related&rid=giphy.gif&ct=g", icon: <FaHandsHelping />, route: "/recommendations" },
    
  ],
  stalker: [
    
    { title: "Recommendations", imgSrc: "https://media.giphy.com/media/3ohhwjkQvZoHwNtRCg/giphy.gif?cid=ecf05e47mwhw71h4d12hxn53y4tycsxaz3xdqpopfvpn01kh&ep=v1_gifs_related&rid=giphy.gif&ct=g", icon: <FaHandsHelping />, route: "/recommendations" },
    { title: "Projects", imgSrc: "https://images.unsplash.com/photo-1572177812156-58036aae439c?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvamVjdHxlbnwwfHwwfHx8MA%3D%3D", icon: <FaProjectDiagram />, route: "/projects" },
    { title: "Certifications", imgSrc: "https://media.giphy.com/media/bAztItaKZWFLrj04LT/giphy.gif?cid=790b7611611vwatgghj7g4nxvjis7qk3eb9x5cn1oepau7n6&ep=v1_gifs_search&rid=giphy.gif&ct=g", icon: <FaCertificate />, route: "/certifications" },
    { title: "Experience", imgSrc: "https://media.giphy.com/media/nHMViIeeBlhhS/giphy.gif?cid=ecf05e47kvd60lhxmsfx8vevcawse4zly6izxydsl9gatvsb&ep=v1_gifs_search&rid=giphy.gif&ct=g", icon: <FaBriefcase />, route: "/work-experience" },
  ],
  user: [
    { title: "Music", imgSrc: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bXVzaWN8ZW58MHx8MHx8fDA%3D", route: "/music", icon: <FaMusic /> },
    { title: "Projects", imgSrc: "https://images.unsplash.com/photo-1572177812156-58036aae439c?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvamVjdHxlbnwwfHwwfHx8MA%3D%3D", icon: <FaProjectDiagram />, route: "/projects" },
    { title: "Certifications", imgSrc: "https://media.giphy.com/media/bAztItaKZWFLrj04LT/giphy.gif?cid=790b7611611vwatgghj7g4nxvjis7qk3eb9x5cn1oepau7n6&ep=v1_gifs_search&rid=giphy.gif&ct=g", icon: <FaCertificate />, route: "/certifications" },
  ]
};

const TopPicksRow: React.FC<TopPicksRowProps> = ({ profile }) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName || profile.charAt(0).toUpperCase() + profile.slice(1)); 
      } else {
        setUserName(profile.charAt(0).toUpperCase() + profile.slice(1));
      }
    });
  }, [profile]);

  const topPicks = topPicksConfig[profile] || topPicksConfig['user'];

  return (
    <div className="top-picks-row">
      <h2 className="row-title">Today's Top Picks for {userName}</h2>
      <div className="card-row">
        {topPicks.map((pick, index) => (
          <div 
            key={index} 
            className="pick-card" 
            onClick={() => navigate(pick.route)}
          >
            <img src={pick.imgSrc} alt={pick.title} className="pick-image" />
            <div className="overlay">
              <div className="pick-label">{pick.title}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopPicksRow;
