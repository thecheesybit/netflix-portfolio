import React from 'react';
import './ProfileCard.css';

interface ProfileCardProps {
  name: string;
  image: string;
  backgroundGif?: string; // ✅ Add this line
  isAddProfile?: boolean;
  onClick: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ name, image, onClick }) => {
  return (
    <div className="profile-card" onClick={onClick}>
      <div className="image-container">
        <img src={image} alt={`${name} profile`} className="profile-image" />
      </div>
      <h3 className="profile-name">{name}</h3>
    </div>
  );
};

export default ProfileCard;

