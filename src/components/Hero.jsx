import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="badge glass">🚀 The Ultimate DSA Resource</div>
        <h1 className="hero-title">
          Master Data Structures <br /> & Algorithms
        </h1>
        <p className="hero-subtitle">
          Comprehensive solutions and detailed explanations for every LeetCode problem.
          Available in <strong>Python, C, C++, Java, and JavaScript</strong>.
        </p>
        <div className="hero-buttons">
          <Link to="/problems" className="btn btn-primary">Start Exploring</Link>
        </div>
      </div>
      
      {/* Decorative Background Elements */}
      <div className="glow-orb orb-1"></div>
      <div className="glow-orb orb-2"></div>
    </section>
  );
};

export default Hero;
