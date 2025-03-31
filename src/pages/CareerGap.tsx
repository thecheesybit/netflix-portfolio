import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CareerGap.css';

function CareerGap() {
  const navigate = useNavigate();

  return (
    <div className="career-gap-container">
      <div className="career-gap-card">
        {/* Close Button */}
        <button className="close-button" onClick={() => navigate(-1)}>✖</button>

        <h2 className="career-gap-headline">⏳ Career Gap</h2>
        <p className="career-gap-summary">
          After completing my B.Tech from <strong>VIT in 2023</strong>, I took a dedicated period to focus on my aspirations. During this time, I immersed myself in <strong>UPSC Preparation</strong>, refining my knowledge, analytical skills, and discipline. 📚  
        </p>
        <p className="career-gap-summary">
          While preparing for civil services, I also pursued higher education and am currently enrolled in <strong>M.Tech at IIT, Patna.</strong> This phase has been instrumental in broadening my technical expertise while maintaining my commitment to public service ambitions.  
        </p>
        <p className="additional-info">
          I believe Career gaps, when used productively, showcase determination and strategic planning. Whether in academia or civil service preparation, every experience adds value to my journey. 🚀
        </p>
      </div>
    </div>
  );
}

export default CareerGap;
