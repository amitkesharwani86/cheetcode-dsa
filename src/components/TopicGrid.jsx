import React from 'react';
import { Link } from 'react-router-dom';
import './TopicGrid.css';

const topics = [
  { id: 'arrays-and-hashing', name: 'Arrays & Hashing', icon: '🗂️', count: 124 },
  { id: 'two-pointers', name: 'Two Pointers', icon: '👉', count: 42 },
  { id: 'sliding-window', name: 'Sliding Window', icon: '🪟', count: 35 },
  { id: 'stack', name: 'Stack', icon: '🥞', count: 58 },
  { id: 'binary-search', name: 'Binary Search', icon: '🔍', count: 76 },
  { id: 'linked-list', name: 'Linked List', icon: '🔗', count: 61 },
  { id: 'trees', name: 'Trees', icon: '🌳', count: 145 },
  { id: 'graphs', name: 'Graphs', icon: '🕸️', count: 98 },
  { id: 'dynamic-programming', name: 'Dynamic Programming', icon: '🧠', count: 210 },
];

const TopicGrid = () => {
  return (
    <section className="topics-section container">
      <div className="section-header">
        <h2 className="section-title">Explore by Topic</h2>
        <p className="section-subtitle">Structured paths to conquer technical interviews.</p>
      </div>
      
      <div className="topic-grid">
        {topics.map((topic) => (
          <Link key={topic.id} to={`/topic/${topic.id}`} className="topic-card glass">
            <div className="topic-icon">{topic.icon}</div>
            <h3 className="topic-name">{topic.name}</h3>
            <span className="topic-count">{topic.count} Problems</span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default TopicGrid;
