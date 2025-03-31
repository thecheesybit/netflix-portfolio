import React from 'react';
import './Skills.css';
import { Skill } from '../types';

// Import all required icons
import { 
  FaReact, 
  FaNodeJs, 
  FaAws, 
  FaDocker, 
  FaGitAlt, 
  FaJava,
  FaPython,
  FaBootstrap
} from 'react-icons/fa';
import { 
  SiPhp, 
  SiHtml5, 
  SiCss3, 
  SiMongodb,
  SiFirebase,
  SiDjango,
  SiTensorflow,
  SiPytorch,
  SiOpencv,
  SiScikitlearn,
  SiWordpress,
  SiHeroku,
  SiJupyter,
  SiNetlify
} from 'react-icons/si';

const iconMap: { [key: string]: JSX.Element } = {
  FaReact: <FaReact />,
  FaNodeJs: <FaNodeJs />,
  FaAws: <FaAws />,
  FaDocker: <FaDocker />,
  FaGitAlt: <FaGitAlt />,
  FaJava: <FaJava />,
  SiPhp: <SiPhp />,
  SiHtml5: <SiHtml5 />,
  SiCss3: <SiCss3 />,
  SiMongodb: <SiMongodb />,
  SiFirebase: <SiFirebase />,
  FaPython: <FaPython />,
  SiDjango: <SiDjango />,
  FaBootstrap: <FaBootstrap />,
  SiTensorflow: <SiTensorflow />,
  SiPytorch: <SiPytorch />,
  SiOpencv: <SiOpencv />,
  SiScikitlearn: <SiScikitlearn />,
  SiWordpress: <SiWordpress />,
  SiHeroku: <SiHeroku />,
  SiJupyter: <SiJupyter />,
  SiNetlify: <SiNetlify />,
  // Note: Missing icons (FaCplusplus, FaFlutter) need to be added from appropriate libraries
};

const skillsData: Skill[] = [
  // Languages and Databases
  {
    name: "C++",
    category: "Languages and Databases",
    description: "Proficient in C++ for system-level programming and algorithms",
    icon: "FaCplusplus"
  },
  {
    name: "Python",
    category: "Languages and Databases",
    description: "Experienced in Python for AI, ML, and backend development",
    icon: "FaPython"
  },
  {
    name: "Java",
    category: "Languages and Databases",
    description: "Skilled in Java for object-oriented programming",
    icon: "FaJava"
  },
  {
    name: "PHP",
    category: "Languages and Databases",
    description: "Used PHP for web development and server-side scripting",
    icon: "SiPhp"
  },
  {
    name: "HTML5",
    category: "Languages and Databases",
    description: "Expert in HTML5 for building responsive web interfaces",
    icon: "SiHtml5"
  },
  {
    name: "CSS3",
    category: "Languages and Databases",
    description: "Proficient in CSS3 for styling and animations",
    icon: "SiCss3"
  },
  {
    name: "MongoDB",
    category: "Languages and Databases",
    description: "Experienced with MongoDB for NoSQL database management",
    icon: "SiMongodb"
  },
  {
    name: "Firebase",
    category: "Languages and Databases",
    description: "Used Firebase for real-time database and authentication",
    icon: "SiFirebase"
  },
  // Frameworks
  {
    name: "React",
    category: "Frameworks",
    description: "Built dynamic web applications using React",
    icon: "FaReact"
  },
  {
    name: "Flutter",
    category: "Frameworks",
    description: "Developed cross-platform mobile apps with Flutter",
    icon: "FaFlutter"
  },
  {
    name: "Node.js",
    category: "Frameworks",
    description: "Created scalable backend services with Node.js",
    icon: "FaNodeJs"
  },
  {
    name: "Django",
    category: "Frameworks",
    description: "Built secure web applications using Django",
    icon: "SiDjango"
  },
  {
    name: "Bootstrap",
    category: "Frameworks",
    description: "Utilized Bootstrap for responsive UI design",
    icon: "FaBootstrap"
  },
  {
    name: "TensorFlow",
    category: "Frameworks",
    description: "Applied TensorFlow for machine learning models",
    icon: "SiTensorflow"
  },
  {
    name: "PyTorch",
    category: "Frameworks",
    description: "Used PyTorch for deep learning projects",
    icon: "SiPytorch"
  },
  {
    name: "OpenCV",
    category: "Frameworks",
    description: "Implemented computer vision solutions with OpenCV",
    icon: "SiOpencv"
  },
  {
    name: "scikit-learn",
    category: "Frameworks",
    description: "Leveraged scikit-learn for machine learning tasks",
    icon: "SiScikitlearn"
  },
  // Tools
  {
    name: "Git",
    category: "Tools",
    description: "Managed version control with Git",
    icon: "FaGitAlt"
  },
  {
    name: "AWS",
    category: "Tools",
    description: "Deployed applications on AWS cloud services",
    icon: "FaAws"
  },
  {
    name: "Docker",
    category: "Tools",
    description: "Containerized applications using Docker",
    icon: "FaDocker"
  },
  {
    name: "WordPress",
    category: "Tools",
    description: "Developed websites using WordPress",
    icon: "SiWordpress"
  },
  {
    name: "Heroku",
    category: "Tools",
    description: "Deployed applications on Heroku",
    icon: "SiHeroku"
  },
  {
    name: "Jupyter",
    category: "Tools",
    description: "Used Jupyter for data analysis and visualization",
    icon: "SiJupyter"
  },
  {
    name: "Netlify",
    category: "Tools",
    description: "Hosted static sites on Netlify",
    icon: "SiNetlify"
  }
];

const Skills: React.FC = () => {
  const skillsByCategory = skillsData.reduce((acc: any, skill: any) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <div className="skills-container">
      {Object.keys(skillsByCategory).map((category, index) => (
        <div key={index} className="skill-category">
          <h3 className="category-title">{category}</h3>
          <div className="skills-grid">
            {skillsByCategory[category].map((skill: any, idx: number) => (
              <div key={idx} className="skill-card">
                <div className="icon">{iconMap[skill.icon] || <FaReact />}</div>
                <h3 className="skill-name">
                  {skill.name.split('').map((letter: any, i: number) => (
                    <span key={i} className="letter" style={{ animationDelay: `${i * 0.05}s` }}>
                      {letter}
                    </span>
                  ))}
                </h3>
                <p className="skill-description">{skill.description}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Skills;