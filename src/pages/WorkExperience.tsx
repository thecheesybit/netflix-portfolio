import React from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { MdOutlineWork as WorkIcon } from 'react-icons/md';
import { IoSchool as SchoolIcon } from 'react-icons/io5';
import { FaStar as StarIcon } from 'react-icons/fa';
import './WorkExperience.css';

const WorkExperience: React.FC = () => {
  // Hardcoded timeline data
  const timeLineData = [
    
    {
      timelineType: "education",
      name: "Indian Institute of Technology, Patna",
      title: "M.Tech in Artificial Intelligence & Data Science Engineering",
      summaryPoints: "Currently pursuing\nFocus on advanced AI and Data Science techniques",
      dateRange: "2025 - 2027"
    },
    {
      timelineType: "work",
      title: "Research Intern",
      name: "CyberPhysical Systems, VIT",
      techStack: "Python, Machine Learning, MRI Data Processing",
      summaryPoints: "Implemented noise reduction and optimization algorithms for Alzheimer's detection\nAchieved 80% accuracy on MRI dataset\nCo-authored a research paper in Arabian Journal for Science and Engineering",
      dateRange: "Jan 2021 - Jul 2021"
    },
    {
      timelineType: "education",
      name: "Vellore Institute of Technology",
      title: "B.Tech in Artificial Intelligence and Machine Learning",
      summaryPoints: "Achieved 8.09/10 CGPA",
      dateRange: "June 2019 - May 2023" // Assumed 4-year B.Tech duration; adjust as needed
    },
    {
      timelineType: "education",
      name: "Jagran Public School", // Replace with your actual school name
      title: "Higher Secondary (12th Grade)", // Adjust title if different (e.g., CBSE, ICSE)
      summaryPoints: "Completed with Science stream (Physics, Chemistry, Math)\nAchieved 79% in board exams", // Replace with your stream and marks
      dateRange: "June 2017 - May 2018" // Assumed 2 years before B.Tech; adjust as needed
    },
    {
      timelineType: "education",
      name: "Jagran Public School", // Replace with your actual school name
      title: "Higher Secondary (10th Grade)", // Adjust title if different (e.g., CBSE, ICSE)
      summaryPoints: "Achieved 9.6 CGPA in board exams", // Replace with your stream and marks
      dateRange: "June 2015 - May 2016" // Assumed 2 years before B.Tech; adjust as needed
    },
  ];

  return (
    <>
      <div className="timeline-container">
        <h2 className="timeline-title">📅 Work Experience & Education Timeline</h2>
      </div>
      <VerticalTimeline>
        {timeLineData.map((item, index) => (
          <VerticalTimelineElement
            key={index}
            className={`vertical-timeline-element--${item.timelineType}`}
            contentStyle={
              item.timelineType === "work"
                ? index === 0
                  ? { background: 'rgb(33, 150, 243)', color: '#fff' }
                  : { background: 'rgb(240, 240, 240)', color: '#fff' }
                : { background: 'rgb(255, 224, 230)', color: '#fff' }
            }
            contentArrowStyle={
              item.timelineType === "work"
                ? { borderRight: index === 0 ? '7px solid rgb(33, 150, 243)' : '7px solid rgb(240, 240, 240)' }
                : { borderRight: '7px solid rgb(255, 224, 230)' }
            }
            date={item.dateRange}
            iconStyle={
              item.timelineType === "work"
                ? { background: 'rgb(33, 150, 243)', color: '#fff' }
                : { background: 'rgb(255, 160, 200)', color: '#fff' }
            }
            icon={item.timelineType === "work" ? <WorkIcon /> : <SchoolIcon />}
          >
            {item.timelineType === "work" ? (
              <div style={{ color: 'black' }}>
                <h3 className="vertical-timeline-element-title">{item.title}</h3>
                <h4 className="vertical-timeline-element-subtitle">{item.name}</h4>
                <p className="vertical-timeline-element-tech">🔧 {item.techStack}</p>
                <p>{item.summaryPoints}</p>
              </div>
            ) : (
              <div style={{ color: 'black' }}>
                <h3 className="vertical-timeline-element-title">{item.name}</h3>
                <h4 className="vertical-timeline-element-subtitle">{item.title}</h4>
                <p>{item.summaryPoints}</p>
              </div>
            )}
          </VerticalTimelineElement>
        ))}
        <VerticalTimelineElement
          iconStyle={{ background: 'rgb(16, 204, 82)', color: '#fff' }}
          icon={<StarIcon />}
        />
      </VerticalTimeline>
    </>
  );
};

export default WorkExperience;