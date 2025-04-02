import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import './ContinueWatching.css';

type ProfileType = 'recruiter' | 'developer' | 'stalker' | 'user';

interface ContinueWatchingProps {
  profile: ProfileType;
}

const continueWatchingConfig = {
  recruiter: [
    { title: "Music", imgSrc: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bXVzaWN8ZW58MHx8MHx8fDA%3D", link: "/music" },
    { title: "Reading", imgSrc: "https://media.giphy.com/media/VgY4dDdN1W3NS/giphy.gif?cid=790b7611y7dak6cc5mwv8bc50dr814mo5obry6aqu7h72ptp&ep=v1_gifs_search&rid=giphy.gif&ct=g", link: "/reading" },
    { title: "Blogs", imgSrc: "https://media.giphy.com/media/10LziGOBkifXzO/giphy.gif?cid=790b7611bc1rl1wbji44jkjz1itf2yankgmam5nxsgl7hitr&ep=v1_gifs_search&rid=giphy.gif&ct=g", link: "/blogs" },
    
  ],
  developer: [
    { title: "Music", imgSrc: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bXVzaWN8ZW58MHx8MHx8fDA%3D", link: "/music" },
    { title: "Reading", imgSrc: "https://media.giphy.com/media/VgY4dDdN1W3NS/giphy.gif?cid=790b7611y7dak6cc5mwv8bc50dr814mo5obry6aqu7h72ptp&ep=v1_gifs_search&rid=giphy.gif&ct=g", link: "/reading" },
    { title: "Certifications", imgSrc: "https://media.giphy.com/media/bAztItaKZWFLrj04LT/giphy.gif?cid=790b7611611vwatgghj7g4nxvjis7qk3eb9x5cn1oepau7n6&ep=v1_gifs_search&rid=giphy.gif&ct=g", link: "/certifications" },
    { title: "Contact Me", imgSrc: "https://media.giphy.com/media/oC5V6VFUiwPjjMN4Xe/giphy.gif?cid=790b7611j0ld3dkipe4h4ydnyoj5ozy7um1s85s6cq9gbcpp&ep=v1_gifs_search&rid=giphy.gif&ct=g", link: "/contact-me" }
  ],
  stalker: [
    { title: "Reading", imgSrc: "https://media.giphy.com/media/VgY4dDdN1W3NS/giphy.gif?cid=790b7611y7dak6cc5mwv8bc50dr814mo5obry6aqu7h72ptp&ep=v1_gifs_search&rid=giphy.gif&ct=g", link: "/reading" },
    { title: "Blogs", imgSrc: "https://media.giphy.com/media/10LziGOBkifXzO/giphy.gif?cid=790b7611bc1rl1wbji44jkjz1itf2yankgmam5nxsgl7hitr&ep=v1_gifs_search&rid=giphy.gif&ct=g", link: "/blogs" },
    { title: "Contact Me", imgSrc: "https://media.giphy.com/media/oC5V6VFUiwPjjMN4Xe/giphy.gif?cid=790b7611j0ld3dkipe4h4ydnyoj5ozy7um1s85s6cq9gbcpp&ep=v1_gifs_search&rid=giphy.gif&ct=g", link: "/contact-me" }
  ],
  user: [
    { title: "Reading", imgSrc: "https://media.giphy.com/media/VgY4dDdN1W3NS/giphy.gif?cid=790b7611y7dak6cc5mwv8bc50dr814mo5obry6aqu7h72ptp&ep=v1_gifs_search&rid=giphy.gif&ct=g", link: "/reading" },
    { title: "Contact Me", imgSrc: "https://media.giphy.com/media/oC5V6VFUiwPjjMN4Xe/giphy.gif?cid=790b7611j0ld3dkipe4h4ydnyoj5ozy7um1s85s6cq9gbcpp&ep=v1_gifs_search&rid=giphy.gif&ct=g", link: "/contact-me" },
  ]
};

const ContinueWatching: React.FC<ContinueWatchingProps> = ({ profile }) => {
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
  

  const continueWatching = continueWatchingConfig[profile] || continueWatchingConfig['user'];

  return (
    <div className="continue-watching-row">
      <h2 className="row-title">Continue Watching for {userName}</h2>
      <div className="card-row">
        {continueWatching.map((pick, index) => (
          <Link to={pick.link} key={index} className="pick-card">
            <img src={pick.imgSrc} alt={pick.title} className="pick-image" />
            <div className="overlay">
              <div className="pick-label">{pick.title}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ContinueWatching;
