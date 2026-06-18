import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import ALL_PROBLEMS from '../data/problems_with_tags.json';
import './UserProgress.css';

const UserProgress = () => {
  const { user } = useAuth();
  const [solvedStats, setSolvedStats] = useState({
    total: 0,
    easy: 0,
    medium: 0,
    hard: 0
  });
  const [rank, setRank] = useState(null);
  const [loading, setLoading] = useState(true);

  // Total counts in our database
  const totalProblems = ALL_PROBLEMS.length;
  const totalEasy = ALL_PROBLEMS.filter(p => p.difficulty === 'Easy').length;
  const totalMedium = ALL_PROBLEMS.filter(p => p.difficulty === 'Medium').length;
  const totalHard = ALL_PROBLEMS.filter(p => p.difficulty === 'Hard').length;

  useEffect(() => {
    const fetchProgress = async () => {
      if (!user) return;
      setLoading(true);
      try {
        // Fetch solved problems
        const { data: solvedData, error: solvedError } = await supabase
          .from('solved_problems')
          .select('problem_id')
          .eq('user_id', user.id);

        if (solvedData) {
          let e = 0, m = 0, h = 0;
          const solvedIds = new Set(solvedData.map(d => String(d.problem_id)));
          
          ALL_PROBLEMS.forEach(p => {
            if (solvedIds.has(String(p.slug)) || solvedIds.has(String(p.id))) {
              if (p.difficulty === 'Easy') e++;
              else if (p.difficulty === 'Medium') m++;
              else if (p.difficulty === 'Hard') h++;
            }
          });

          setSolvedStats({ total: solvedData.length, easy: e, medium: m, hard: h });
        }

        // Fetch rank (Requires an RPC function in Supabase)
        const { data: rankData, error: rankError } = await supabase
          .rpc('get_user_rank', { input_user_id: user.id });
          
        if (rankData && !rankError) {
          setRank(rankData);
        } else {
          // Fallback mock rank if RPC isn't set up yet
          setRank('-');
        }

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [user]);

  if (!user) return null;

  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (solvedStats.total / totalProblems) * circumference;

  return (
    <section className="user-progress-section container">
      <div className="progress-glass p-card">
        <div className="progress-header">
          <div className="header-titles">
            <h2>Welcome back, <span className="highlight">{user.user_metadata?.username || user.email.split('@')[0]}</span></h2>
            {rank !== null && <div className="rank-badge">Global Rank: <span>{rank === '-' ? 'Unranked' : `#${rank}`}</span></div>}
          </div>
          <Link to="/problems" className="hero-cta" style={{ margin: 0, padding: '0.75rem 1.5rem', fontSize: '1rem' }}>
            Solve More Problems →
          </Link>
        </div>

        <div className="progress-grid">
          {/* Circular Progress */}
          <div className="circular-progress-container">
            <svg className="progress-ring" width="120" height="120">
              <circle className="progress-ring-circle-bg" strokeWidth="8" fill="transparent" r={radius} cx="60" cy="60" />
              <circle 
                className="progress-ring-circle" 
                strokeWidth="8" 
                fill="transparent" 
                r={radius} 
                cx="60" 
                cy="60" 
                style={{ strokeDasharray: circumference, strokeDashoffset: strokeDashoffset }}
              />
            </svg>
            <div className="progress-text-center">
              <span className="solved-big">{solvedStats.total}</span>
              <span className="total-small">/ {totalProblems}</span>
              <span className="label-small">Solved</span>
            </div>
          </div>

          {/* Difficulty Bars */}
          <div className="difficulty-bars">
            <div className="diff-bar-item">
              <div className="diff-labels">
                <span className="diff-name easy">Easy</span>
                <span className="diff-count">{solvedStats.easy} <span className="diff-total">/ {totalEasy}</span></span>
              </div>
              <div className="bar-bg">
                <div className="bar-fill easy-fill" style={{ width: `${(solvedStats.easy / totalEasy) * 100}%` }}></div>
              </div>
            </div>

            <div className="diff-bar-item">
              <div className="diff-labels">
                <span className="diff-name medium">Medium</span>
                <span className="diff-count">{solvedStats.medium} <span className="diff-total">/ {totalMedium}</span></span>
              </div>
              <div className="bar-bg">
                <div className="bar-fill medium-fill" style={{ width: `${(solvedStats.medium / totalMedium) * 100}%` }}></div>
              </div>
            </div>

            <div className="diff-bar-item">
              <div className="diff-labels">
                <span className="diff-name hard">Hard</span>
                <span className="diff-count">{solvedStats.hard} <span className="diff-total">/ {totalHard}</span></span>
              </div>
              <div className="bar-bg">
                <div className="bar-fill hard-fill" style={{ width: `${(solvedStats.hard / totalHard) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserProgress;
