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
    { title: "Projects", imgSrc: "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExa3l6Nm15cDg0MHB1b2VkazZlbTVycWN2Z2prcmR1Z3AyZHBoMzMxYyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/gVlgj80ZLp9yo/giphy.gif", icon: <FaProjectDiagram />, route: "/projects" },
    { title: "Contact Me", imgSrc: "https://media.giphy.com/media/oC5V6VFUiwPjjMN4Xe/giphy.gif?cid=790b7611j0ld3dkipe4h4ydnyoj5ozy7um1s85s6cq9gbcpp&ep=v1_gifs_search&rid=giphy.gif&ct=g", icon: <FaEnvelope />, route: "/contact-me" }
  ],
  developer: [
    { title: "Skills", imgSrc: "https://media.giphy.com/media/aBv5IC7zFOFjVVVs7I/giphy.gif?cid=790b7611ti9azf8lwh985qcp3yzpmu8an9my2wh27vr1kper&ep=v1_gifs_search&rid=giphy.gif&ct=g", icon: <FaCode />, route: "/skills" },
    { title: "Projects", imgSrc: "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExa3l6Nm15cDg0MHB1b2VkazZlbTVycWN2Z2prcmR1Z3AyZHBoMzMxYyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/gVlgj80ZLp9yo/giphy.gif", icon: <FaProjectDiagram />, route: "/projects" },
    
    { title: "Experience", imgSrc: "https://media.giphy.com/media/nHMViIeeBlhhS/giphy.gif?cid=ecf05e47kvd60lhxmsfx8vevcawse4zly6izxydsl9gatvsb&ep=v1_gifs_search&rid=giphy.gif&ct=g", icon: <FaBriefcase />, route: "/work-experience" },
    { title: "Recommendations", imgSrc: "https://media.giphy.com/media/3ohhwjkQvZoHwNtRCg/giphy.gif?cid=ecf05e47mwhw71h4d12hxn53y4tycsxaz3xdqpopfvpn01kh&ep=v1_gifs_related&rid=giphy.gif&ct=g", icon: <FaHandsHelping />, route: "/recommendations" },
    
  ],
  stalker: [
    
    { title: "Recommendations", imgSrc: "https://media.giphy.com/media/3ohhwjkQvZoHwNtRCg/giphy.gif?cid=ecf05e47mwhw71h4d12hxn53y4tycsxaz3xdqpopfvpn01kh&ep=v1_gifs_related&rid=giphy.gif&ct=g", icon: <FaHandsHelping />, route: "/recommendations" },
    { title: "Projects", imgSrc: "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExa3l6Nm15cDg0MHB1b2VkazZlbTVycWN2Z2prcmR1Z3AyZHBoMzMxYyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/gVlgj80ZLp9yo/giphy.gif", icon: <FaProjectDiagram />, route: "/projects" },
    { title: "Certifications", imgSrc: "https://media.giphy.com/media/bAztItaKZWFLrj04LT/giphy.gif?cid=790b7611611vwatgghj7g4nxvjis7qk3eb9x5cn1oepau7n6&ep=v1_gifs_search&rid=giphy.gif&ct=g", icon: <FaCertificate />, route: "/certifications" },
    { title: "Experience", imgSrc: "https://media.giphy.com/media/nHMViIeeBlhhS/giphy.gif?cid=ecf05e47kvd60lhxmsfx8vevcawse4zly6izxydsl9gatvsb&ep=v1_gifs_search&rid=giphy.gif&ct=g", icon: <FaBriefcase />, route: "/work-experience" },
  ],
  user: [
    { title: "Anora", imgSrc: "https://media.giphy.com/media/jceZJOi7HHeRh8dgid/giphy.gif?cid=790b7611b1ynt90i0myyqfx1na3zhqm2cpc9o3ekpki0yk96&ep=v1_gifs_search&rid=giphy.gif&ct=g", icon: <FaHandsHelping />, route: "/stream/Anora" },
    { title: "Deadpool 2024", imgSrc: "https://media.giphy.com/media/SwsaIZIvtamH0JtFxj/giphy.gif?cid=790b76118ofpieufh0agtqf5e2saysn8pcaq2rpr7am2g82o&ep=v1_gifs_search&rid=giphy.gif&ct=g", icon: <FaHandsHelping />, route: "/stream/Deadpool" },
    { title: "Music", imgSrc: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeGZ5a2tmZnJtamt0OGM3cWIxc3ZydzliYjRrd2xpM2tocGR2aTE2dyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/blSTtZehjAZ8I/giphy.gif", route: "/music", icon: <FaMusic /> },
    { title: "Projects", imgSrc: "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExa3l6Nm15cDg0MHB1b2VkazZlbTVycWN2Z2prcmR1Z3AyZHBoMzMxYyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/gVlgj80ZLp9yo/giphy.gif", icon: <FaProjectDiagram />, route: "/projects" },
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
