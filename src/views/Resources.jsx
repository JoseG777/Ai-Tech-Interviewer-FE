// src/views/Resources.jsx
import React from 'react';
import '../styles/Resources.css';


function Resources() {
  return (
    <div className="resources-container">
      <h1>Resources</h1>
      <div className="resources-icons">
        <a href="https://leetcode.com/" target="_blank" rel="noopener noreferrer">
          <img src="src/assets/leetcode.png" alt="Leetcode" className="resource-icon" />
        <p>Leetcode</p>
        </a>
        <a href="https://www.hackerrank.com/" target="_blank" rel="noopener noreferrer">
          <img src="src/assets/hackerrank.png" alt="Hackerrank" className="resource-icon" />
          <p>Hackerrank</p>
        </a>
        <a href="https://interviewing.io/" target="_blank" rel="noopener noreferrer">
          <img src="src/assets/interviewing.png" alt="Interviewing.io" className="resource-icon" />
          <p>Interviewing.io</p>
        </a>
        <a href="https://www.algoexpert.io/product" target="_blank" rel="noopener noreferrer">
          <img src="src/assets/algoexpert.png" alt="AlgoExpert" className="resource-icon" />
          <p>AlgoExpert</p>
        </a>
        <a href="https://www.geeksforgeeks.org/" target="_blank" rel="noopener noreferrer">
          <img src="src/assets/geekforgeeks.png" alt="GeeksforGeeks" className="resource-icon" />
          <p>GeeksforGeeks</p>
        </a>
      </div>
    </div>
  );
}

export default Resources;