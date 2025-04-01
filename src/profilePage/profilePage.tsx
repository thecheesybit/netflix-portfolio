import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import './ProfilePage.css';

import ProfileBanner from './ProfileBanner';
import TopPicksRow from './TopPicksRow';
import ContinueWatching from './ContinueWatching';
import SeriesRow from './SeriesRow';

type ProfileType = 'recruiter' | 'developer' | 'stalker' | 'user';

const ProfilePage: React.FC = () => {
  const location = useLocation();
  const backgroundGif =
    location.state?.backgroundGif ||
    "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExOGlrMTU4MW51MXZhMnl1ajRsMjQybzd2OXVwMWg5ZTFyc2Z4N3VnbSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l4JySAWfMaY7w88sU/giphy.gif"; // Default GIF

  const { profileName } = useParams<{ profileName: string }>();

  const profile: ProfileType = ['recruiter', 'developer', 'stalker'].includes(profileName!)
    ? (profileName as ProfileType)
    : 'user';

  return (
    <>
      <div className="profile-page" style={{ backgroundImage: `url(${backgroundGif})` }}>
        <ProfileBanner />
      </div>
      <TopPicksRow profile={profile} />
      <ContinueWatching profile={profile} />
      <SeriesRow profile={profile} />

      {/* Footer with Disclaimer */}
      <footer className="portfolio-footer">
        <p className="disclaimer">
          This project is developed solely for portfolio demonstration, showcasing technical skills and expertise. 
          All trademarks, brand names, and content belong to their respective owners.
          No commercial use or affiliation is intended. This work is inspired by publicly available knowledge 
          and open-source references, adhering to fair use principles.
        </p>
      </footer>
    </>
  );
};

export default ProfilePage;
