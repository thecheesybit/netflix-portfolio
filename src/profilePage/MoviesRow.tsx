import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "./MoviesRow.css";
import { FaTv } from "react-icons/fa";

type ProfileType = "recruiter" | "developer" | "stalker" | "user";

interface MoviesRowProps {
  profile: ProfileType;
}

const moviesConfig = [
  {
    title: "Inside Out 2",
    imgSrc:
      "https://media.giphy.com/media/u7YNeEXgaf42XYwle6/giphy.gif?cid=790b7611yh0stth2ll75281dff6qylkeao66j850vdwscrkv&ep=v1_gifs_search&rid=giphy.gif&ct=g",
    icon: <FaTv />,
    route: "/stream/InsideOut2",
  },
  {
    title: "Arrival",
    imgSrc:
      "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ3pwYnY3dG9jcHA4bGdkNjEzNjh4YTgxd28ydGo5N2RmcjMyanEyNyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oriOeYGl5MKFtb2FO/giphy.gif",
    icon: <FaTv />,
    route: "/stream/Arrival",
  },
  {
    title: "Sully",
    imgSrc:
      "https://i.ndtvimg.com/i/2016-11/tom-hanks_640x480_41479741116.jpg",
    icon: <FaTv />,
    route: "/stream/Sully",
  },
  {
    title: "Anora",
    imgSrc:
      "https://media.giphy.com/media/jceZJOi7HHeRh8dgid/giphy.gif?cid=790b7611b1ynt90i0myyqfx1na3zhqm2cpc9o3ekpki0yk96&ep=v1_gifs_search&rid=giphy.gif&ct=g",
    icon: <FaTv />,
    route: "/stream/Anora",
  },
  {
    title: "Deadpool 2024",
    imgSrc:
      "https://media.giphy.com/media/SwsaIZIvtamH0JtFxj/giphy.gif?cid=790b76118ofpieufh0agtqf5e2saysn8pcaq2rpr7am2g82o&ep=v1_gifs_search&rid=giphy.gif&ct=g",
    icon: <FaTv />,
    route: "/stream/Deadpool",
  },
  {
    title: "Dune 2",
    imgSrc:
      "https://media.giphy.com/media/VhQ6lcE0qyRYI88bI6/giphy.gif?cid=790b76116y0itlz4muxgrekrv3w4mxsszdyn65kgxv0u10vo&ep=v1_gifs_search&rid=giphy.gif&ct=g",
    icon: <FaTv />,
    route: "/stream/Dune2",
  },
  {
    title: "Kraven",
    imgSrc:
      "https://spaces.filmstories.co.uk/uploads/2024/02/kraven-the-hunter.jpg",
    icon: <FaTv />,
    route: "/stream/Kraven",
  },
  {
    title: "Alien Romulus",
    imgSrc:
      "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNXNiOXk2MnFjOWl2Z2RqYzRxajZxNDVtbGlvM2JoN2FhcmxmcTBtcCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/hF4jNsNkYVSAwNqszv/giphy.gif",
    icon: <FaTv />,
    route: "/stream/AlienRomulus",
  },

  // Add more movies here as needed
];

const MoviesRow: React.FC<MoviesRowProps> = ({ profile }) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(
          user.displayName || profile.charAt(0).toUpperCase() + profile.slice(1)
        );
      } else {
        setUserName(profile.charAt(0).toUpperCase() + profile.slice(1));
      }
    });
    return () => unsubscribe(); // Cleanup subscription
  }, [profile]);

  // Only render content if profile is "user"
  if (profile !== "user") {
    return null; // Hide content for non-user profiles
  }

  return (
    <div className="movies-row">
      <h2 className="row-title"> Top Movies for you</h2>
      <div className="card-row">
        {moviesConfig.map((movies, index) => (
          <div
            key={index}
            className="movies-card"
            onClick={() => navigate(movies.route)}
          >
            <img
              src={movies.imgSrc}
              alt={movies.title}
              className="movies-image"
            />
            <div className="overlay">
              <div className="movies-label">{movies.title}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoviesRow;
