import React from 'react';
import './Certifications.css';
import { FaExternalLinkAlt, FaUniversity } from 'react-icons/fa';
import { SiUdemy, SiCoursera, SiIeee } from 'react-icons/si';
import { Certification } from '../types';

const iconData: { [key: string]: JSX.Element } = {
  udemy: <SiUdemy />,
  coursera: <SiCoursera />,
  ieee: <SiIeee />,
  university: <FaUniversity />,
};;

const certifications: Certification[] = [
  { title: "AWS Cloud Practitioner", issuer: "AWS", issuedDate: "2023", link: "https://drive.google.com/file/d/1dOgp1FE5YVv4mSIYTAwrozGP_t0Kb041/view?usp=sharing", iconName: "university" },
  { title: "AWS AI Practitioner", issuer: "AWS", issuedDate: "2023", link: "#", iconName: "university" },
  { title: "AI for Medicine", issuer: "Coursera", issuedDate: "2023", link: "https://coursera.org/share/8ac99a6607e10b56aaac139128d89cf5", iconName: "coursera" },
  { title: "Data Structures and Algorithms", issuer: "Coursera", issuedDate: "2023", link: "https://coursera.org/share/9619074675818183dddece2044e7ad38", iconName: "coursera" },
  { title: "Genome Assembly Programming Challenge", issuer: "Coursera", issuedDate: "2023", link: "https://coursera.org/share/a1e6cbd9846aa128f06c0e94c843cdcb", iconName: "coursera" },
  { title: "Algorithmic Toolbox", issuer: "Coursera", issuedDate: "2023", link: "https://coursera.org/share/5a4fb814733befb6303b50d653c856eb", iconName: "coursera" },
  { title: "AI for Medical Prognosis", issuer: "Coursera", issuedDate: "2023", link: "https://coursera.org/share/f8cbea6d01500bf6d543b3954e0f1503", iconName: "coursera" },
  { title: "Version Control with Git", issuer: "Coursera", issuedDate: "2023", link: "https://coursera.org/share/0eba58cb731ed995a87729482ef813a8", iconName: "coursera" },
  { title: "Algorithms on Strings", issuer: "Coursera", issuedDate: "2023", link: "https://coursera.org/share/22d10021593ef6bf07bf52035ce6b3cb", iconName: "coursera" },
  { title: "Google Cloud IAM and Networking for AWS Professionals", issuer: "Coursera", issuedDate: "2023", link: "https://coursera.org/share/8d5e0a47b9d3544c6ecf7c89a085505f", iconName: "coursera" },
  { title: "Algorithms on Strings (Duplicate Entry)", issuer: "Coursera", issuedDate: "2023", link: "https://coursera.org/share/e60ea99fbc578bbf732e923ddb754de9", iconName: "coursera" },
  { title: "Advanced Computer Vision with TensorFlow", issuer: "Coursera", issuedDate: "2023", link: "https://coursera.org/share/a730ce0def4c3cb6709a49ed235c5e9e", iconName: "coursera" },
  { title: "Advanced Algorithms and Complexity", issuer: "Coursera", issuedDate: "2023", link: "https://coursera.org/share/c32a7177be9a940ee17e8ed95c52c9e5", iconName: "coursera" },
  { title: "Algorithms on Graphs", issuer: "Coursera", issuedDate: "2023", link: "https://coursera.org/share/992fdb2cd8a086dbf692a8df7a145329", iconName: "coursera" },
  { title: "The Complete Flutter Development Bootcamp with Dart", issuer: "Udemy", issuedDate: "2023", link: "https://www.udemy.com/certificate/UC-29230a66-4f0a-455f-8f8f-b0b6ea6c42bc/", iconName: "udemy" },
  { title: "Machine Learning, Data Science and Generative AI with Python", issuer: "Udemy", issuedDate: "2023", link: "https://www.udemy.com/certificate/UC-3648d610-bcc4-4bda-8e3b-4812dd885e65/", iconName: "udemy" }
];

const groupedCertifications: { [key: string]: Certification[] } = certifications.reduce((acc, cert) => {
  if (!acc[cert.issuer]) {
    acc[cert.issuer] = [];
  }
  acc[cert.issuer].push(cert);
  return acc;
}, {} as { [key: string]: Certification[] });

const Certifications: React.FC = () => {
  return (
    <div className="certifications-container">
      <h1 className="certifications-title">Certifications</h1>
      {Object.entries(groupedCertifications).map(([issuer, certs], index) => (
        <div key={index} className="certification-section">
          <h2 className="certification-heading">{issuer}</h2>
          <div className="certifications-grid">
            {certs.map((cert, certIndex) => (
              <a
                href={cert.link}
                key={certIndex}
                target="_blank"
                rel="noopener noreferrer"
                className="certification-card"
                style={{ '--delay': `${certIndex * 0.2}s` } as React.CSSProperties}
              >
                <div className="certification-content">
                  <div className="certification-icon">{iconData[cert.iconName] || <FaUniversity />}</div>
                  <h3 className="certification-title">{cert.title}</h3>
                  <p className="certification-issuer">{cert.issuer}</p>
                  {cert.issuedDate && <span className="issued-date">Issued {cert.issuedDate}</span>}
                </div>
                <div className="certification-link animated-icon">
                  <FaExternalLinkAlt />
                </div>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Certifications;
