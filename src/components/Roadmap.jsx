import React from 'react';
import './Roadmap.css';

const roadmapData = [
  {
    month: 'Month 1: The Basics',
    topics: ['Arrays & Strings', 'Time/Space Complexity', 'Two Pointers', 'Sliding Window'],
    status: 'active'
  },
  {
    month: 'Month 2: Core Data Structures',
    topics: ['Linked Lists', 'Stacks & Queues', 'Hash Maps', 'Prefix Sum'],
    status: 'pending'
  },
  {
    month: 'Month 3: Trees & Graphs',
    topics: ['Binary Trees', 'Binary Search Trees', 'DFS & BFS', 'Graph Fundamentals'],
    status: 'pending'
  },
  {
    month: 'Month 4: Algorithmic Paradigms',
    topics: ['Binary Search', 'Sorting Algorithms', 'Greedy Algorithms', 'Backtracking'],
    status: 'pending'
  },
  {
    month: 'Month 5: Dynamic Programming',
    topics: ['1D DP', '2D DP', 'Knapsack Pattern', 'Longest Common Subsequence'],
    status: 'pending'
  },
  {
    month: 'Month 6: Advanced & Interview Prep',
    topics: ['Tries', 'Heaps / Priority Queues', 'Bit Manipulation', 'Mock Interviews'],
    status: 'pending'
  }
];

const Roadmap = () => {
  return (
    <section className="roadmap-section container">
      <div className="section-header">
        <h2 className="section-title">6-Month DSA Mastery Roadmap</h2>
        <p className="section-subtitle">A structured path from beginner to interview-ready.</p>
      </div>

      <div className="roadmap-timeline">
        {roadmapData.map((phase, index) => (
          <div key={index} className={`roadmap-step ${phase.status}`}>
            <div className="roadmap-spacer"></div>
            
            <div className={`roadmap-card glass`}>
              <div className="roadmap-month">{phase.month}</div>
              <ul className="roadmap-topics">
                {phase.topics.map((topic, tIndex) => (
                  <li key={tIndex}>✓ {topic}</li>
                ))}
              </ul>
            </div>
            
            <div className="roadmap-curve"></div>
            <div className="roadmap-dot"></div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Roadmap;
