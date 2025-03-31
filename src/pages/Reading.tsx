// Reading.tsx

import React from 'react';
import './Reading.css';
import sapien from '../images/sapiens.webp';
import origins from '../images/origins.webp';
import sherlock from '../images/sherlock.webp';
import snakes from '../images/sankes.webp';
import lawOfPower from '../images/lawsOfPower.webp';
import letter from '../images/letters.webp';

const books = [
  {
    title: "SAPIENS : A BRIEF HISTORY OF HUMANKIND",
    author: "Yuval Noah Harari",
    imgSrc: sapien,
    description: "Based on a series of lectures he taught at The Hebrew University of Jerusalem.",
  },
  {
    title: "Origin",
    author: "Dan Brown",
    imgSrc: origins,
    description: "A debate of science and religion and the question of human origin and ending. The book opens with an intriguing prologue in which wealthy scientist and atheist Edmond Kirsch meets with the leaders of three of the most powerful world religions: Judaism, Christianity and Islam.",
  },
  {
    title: "Sherlock Holmes",
    author: "Arthur Conan Doyle",
    imgSrc: sherlock,
    description: "Sherlock Holmes is a fictional consulting detective in London ~1880-1914 created by Scottish author and physician Sir Arthur Conan Doyle. Holmes, master of disguise, reasoned logically to deduce clients' background from their first appearance. He used fingerprints, chemical analysis, and forensic science.",
  },
  {
    title: "Snakes in the Ganga: Breaking India 2.0",
    author: "Rajiv Malhotra and Vijaya Viswanathan",
    imgSrc: snakes,
    description: "Intense warfare against India's integrity is the work of a well-orchestrated global machinery driven by a new ideology.",
  },
  {
    title: "The 48 Laws Of Power",
    author: "Robert Greene",
    imgSrc: lawOfPower,
    description: "A guide to understanding and wielding power, drawing on historical examples and emphasizing the importance of strategy, manipulation, and self-awareness to achieve dominance and influence.",
  },
  {
    title: "Letters from a Stoic",
    author: "Lucius Annaeus Seneca",
    imgSrc: letter,
    description: "A letter collection of 124 letters that Seneca the Younger wrote at the end of his life, during his retirement, after he had worked for the Emperor Nero for more than ten years.",
  },
];

const Reading: React.FC = () => {
  return (
    <div className="reading-container">
      <h2 className="reading-title">📚 Books That Shaped My Journey</h2>
      <p className="reading-intro">These books have influenced my perspectives, motivation, and self-growth.</p>
      <div className="books-grid">
        {books.map((book, index) => (
          <div key={index} className="book-card" style={{ '--delay': `${index * 0.1}s` } as React.CSSProperties}>
            <img src={book.imgSrc} alt={book.title} className="book-cover" />
            <div className="book-info">
              <h3 className="book-title">{book.title}</h3>
              <h4 className="book-author">{book.author}</h4>
              <p className="book-description">{book.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reading;
