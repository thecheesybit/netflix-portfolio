import React from 'react';
import './ContactMe.css';
import profilePic from '../images/ayush.webp'; // Image import for Ayush Kumar
import { FaEnvelope, FaPhoneAlt, FaCoffee, FaLinkedin, FaGithub } from 'react-icons/fa';
import { ContactMe as IContactMe } from '../types';

const contactData: IContactMe = {
  name: "Ayush Kumar",
  title: "Software Developer",
  summary:
    "Results-driven B.Tech graduate specializing in Artificial Intelligence and Machine Learning, with expertise in full-stack development, Flutter applications, and AWS Cloud solutions. Recognized for winning The GoldenHack 3.0 and developing an Alzheimer's detection system.",
  companyUniversity: "Indian Institute of Technology, Patna",
  linkedinLink: "https://www.linkedin.com/in/cheesybit/",
  email: "ak.aimldev@gmail.com",
  phoneNumber: "+919140793931", // Removed spaces for tel: link compatibility
  profilePicture: { url: profilePic }, // Wrap profilePic in an object with 'url'
};

const ContactMe: React.FC = () => {
  return (
    <div className="contact-container">
      <div className="linkedin-badge-custom">
        <img src={contactData.profilePicture.url} alt="Ayush Kumar" className="badge-avatar" />
        <div className="badge-content">
          <h3 className="badge-name">{contactData.name}</h3>
          <p className="badge-title">{contactData.title}</p>
          <p className="badge-description">{contactData.summary}</p>
          <p className="badge-company">{contactData.companyUniversity}</p>
          <a
            href={contactData.linkedinLink}
            target="_blank"
            rel="noopener noreferrer"
            className="badge-link"
          >
            <FaLinkedin className="linkedin-icon" /> View Profile
          </a>
          <a
            href="https://github.com/thecheesybit"
            target="_blank"
            rel="noopener noreferrer"
            className="badge-link"
          >
            <FaGithub className="github-icon" /> View Profile
          </a>
        </div>
      </div>
      <div className="contact-header">
        <p>I'm always up for a chat or a coffee! Feel free to reach out.</p>
      </div>
      <div className="contact-details">
        <div className="contact-item">
          <FaEnvelope className="contact-icon" />
          <a href={`mailto:${contactData.email}`} className="contact-link">
            {contactData.email}
          </a>
        </div>
        <div className="contact-item">
          <FaPhoneAlt className="contact-icon" />
          <a href={`tel:${contactData.phoneNumber}`} className="contact-link">
            {contactData.phoneNumber}
          </a>
        </div>
        <div className="contact-fun">
          <p>Or catch up over a coffee ☕</p>
          <FaCoffee className="coffee-icon" />
        </div>
      </div>
    </div>
  );
};

export default ContactMe;