import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import './SeriesRow.css';
import { FaTv } from 'react-icons/fa';

type ProfileType = 'recruiter' | 'developer' | 'stalker' | 'user';

interface SeriesRowProps {
  profile: ProfileType;
}

const seriesConfig = [
  {
    title: "Special Ops: Lioness",
    imgSrc: "https://m.media-amazon.com/images/S/pv-target-images/be76edcbebca08653aaf73e9f8f7bd589fe8782cdc83fd79c3ee3b2cea8631db.jpg",
    icon: <FaTv />,
    route: "/stream/SpecialOpsLioness",
  },
  {
    title: "Dune Prophecy",
    imgSrc: "https://m.media-amazon.com/images/S/pv-target-images/be3d953f08523e4d4f06160f8905788629cc115367e3a1200a5c483c70154601._SX1080_FMjpg_.jpg",
    icon: <FaTv />,
    route: "/stream/DuneProphecy",
    
  },
  {
    title: "Suits LA",
    imgSrc: "https://img10.hotstar.com/image/upload/f_auto/sources/r1/cms/prod/91/1739523440091-i",
    icon: <FaTv />,
    route: "/stream/SuitsLA",
  },

  // Add more series here as needed
];

const SeriesRow: React.FC<SeriesRowProps> = ({ profile }) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName || profile.charAt(0).toUpperCase() + profile.slice(1));
      } else {
        setUserName(profile.charAt(0).toUpperCase() + profile.slice(1));
      }
    });
    return () => unsubscribe(); // Cleanup subscription
  }, [profile]);

  // Only render content if profile is "user"
  if (profile !== 'user') {
    return null; // Hide content for non-user profiles
  }

  return (
    <div className="series-row">
      <h2 className="row-title"> {userName} You Might Like These Series</h2>
      <div className="card-row">
        {seriesConfig.map((series, index) => (
          <div
            key={index}
            className="series-card"
            onClick={() => navigate(series.route)}
          >
            <img src={series.imgSrc} alt={series.title} className="series-image" />
            <div className="overlay">
              <div className="series-label">{series.title}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeriesRow;