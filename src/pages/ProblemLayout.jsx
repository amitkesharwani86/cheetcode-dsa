import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from '../ThemeContext';
import './ProblemLayout.css';
import './VideoAndDryRun.css';

const ProblemLayout = ({ title, difficulty, description, intuition, dryRun, videoId, leetcodeLink, solutions, timeComplexity, spaceComplexity }) => {
  const [activeLang, setActiveLang] = useState('python');
  const { isDarkMode } = useTheme();

  return (
    <div className="problem-page container">
      <div className="problem-header">
        <Link to="/problems" className="back-link">← Back to Problems</Link>
        <div className="title-row">
          <h1 className="problem-title">{title}</h1>
          <div className="meta-tags">
            <span className={`difficulty-badge ${difficulty ? difficulty.toLowerCase() : 'medium'}`}>{difficulty || 'Medium'}</span>
            <span className="meta-tag topics-tag">🏷️ Topics</span>
            <span className="meta-tag companies-tag">🏢 Companies</span>
            <span className="meta-tag hint-tag">💡 Hint</span>
          </div>
          {leetcodeLink && (
            <a href={leetcodeLink} target="_blank" rel="noopener noreferrer" className="leetcode-link-btn">
              Solve on LeetCode ↗
            </a>
          )}
        </div>
      </div>

      <div className="problem-content grid-layout">
        <div className="left-panel">
          <section className="glass p-card">
            <h2>Description</h2>
            <div className="prose" dangerouslySetInnerHTML={{ __html: description }}></div>
          </section>

          <section className="glass p-card mt-4">
            <h2>Intuition & Approach</h2>
            <div className="prose" dangerouslySetInnerHTML={{ __html: intuition }}></div>
            
            {dryRun && (
              <div className="dry-run mt-4">
                <h3>Step-by-Step Dry Run</h3>
                <div className="prose" dangerouslySetInnerHTML={{ __html: dryRun }}></div>
              </div>
            )}
            
            <div className="complexities mt-4">
              <div className="complexity-item">
                <strong>Time Complexity:</strong> <code>{timeComplexity}</code>
              </div>
              <div className="complexity-item">
                <strong>Space Complexity:</strong> <code>{spaceComplexity}</code>
              </div>
            </div>
          </section>
        </div>

        <div className="right-panel">
          <section className="glass p-card code-section">
            <div className="lang-tabs">
              {Object.keys(solutions).map(lang => (
                <button 
                  key={lang} 
                  className={`lang-tab ${activeLang === lang ? 'active' : ''}`}
                  onClick={() => setActiveLang(lang)}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
            <div className="code-container">
              <SyntaxHighlighter 
                language={activeLang} 
                style={vscDarkPlus}
                customStyle={{ background: 'transparent', margin: 0, padding: '1rem' }}
              >
                {solutions[activeLang]}
              </SyntaxHighlighter>
            </div>
          </section>
        </div>
      </div>

      {videoId && (
        <section className="glass p-card video-section mt-4">
          <h2>Video Explanation</h2>
          <div className="video-container">
            <iframe 
              src={`https://www.youtube.com/embed/${videoId}`} 
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen>
            </iframe>
          </div>
        </section>
      )}
    </div>
  );
};

export default ProblemLayout;
