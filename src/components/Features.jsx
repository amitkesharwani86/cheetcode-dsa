import React from 'react';
import './Features.css';

const Features = () => {
  return (
    <section className="features-section container">
      <div className="section-header">
        <h2 className="section-title">Why Learn Here?</h2>
      </div>

      <div className="features-grid">
        <div className="feature-card glass">
          <div className="feature-icon">🌐</div>
          <h3>Multi-Language Support</h3>
          <p>Every solution provided in Python, C, C++, Java, and JavaScript. Learn your favorite language or master a new one.</p>
        </div>
        
        <div className="feature-card glass">
          <div className="feature-icon">📝</div>
          <h3>In-Depth Explanations</h3>
          <p>We don't just give you the code. We explain the intuition, the time complexity, and the space complexity.</p>
        </div>
      </div>
    </section>
  );
};

export default Features;
