import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTheme } from '../../ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../supabaseClient';
import CodeWorkspace from '../../components/CodeWorkspace';
import '../ProblemLayout.css';
import '../VideoAndDryRun.css';

const ProblemDetail = () => {
  const { slug } = useParams();
  const [problemData, setProblemData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSolved, setIsSolved] = useState(false);
  const [markingSolved, setMarkingSolved] = useState(false);
  const { isDarkMode } = useTheme();
  const { user } = useAuth();

  useEffect(() => {
    const fetchProblemData = async () => {
      setLoading(true);
      setError(null);
      try {
        const query = `
          query questionData($titleSlug: String!) {
            question(titleSlug: $titleSlug) {
              questionId
              questionFrontendId
              title
              titleSlug
              content
              difficulty
              topicTags { name }
            }
          }
        `;

        const response = await fetch('/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query,
            variables: { titleSlug: slug }
          })
        });

        if (!response.ok) {
          throw new Error('Failed to fetch from GraphQL proxy');
        }

        const data = await response.json();
        if (data.errors) {
          throw new Error(data.errors[0].message);
        }

        setProblemData(data.data.question);
      } catch (err) {
        console.error('Error fetching problem data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchSolvedStatus = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('solved_problems')
          .select('id')
          .eq('user_id', user.id)
          .eq('problem_id', slug) // Wait, problem_id in our DB needs to be string if slug, or we use questionFrontendId. Let's use slug as problem_id for simplicity since we have it here. Let's assume slug is the problem_id.
          .single();
          
        if (data) {
          setIsSolved(true);
        }
      } catch (err) {
        // Ignored, just means not solved
      }
    };

    if (slug) {
      fetchProblemData();
      fetchSolvedStatus();
    }
  }, [slug, user]);

  const handleMarkSolved = async () => {
    if (!user) return alert('Please log in to track your progress!');
    
    setMarkingSolved(true);
    try {
      if (isSolved) {
        // Unmark
        const { error } = await supabase
          .from('solved_problems')
          .delete()
          .eq('user_id', user.id)
          .eq('problem_id', slug);
        if (error) throw error;
        setIsSolved(false);
      } else {
        // Mark
        const { error } = await supabase
          .from('solved_problems')
          .insert({ user_id: user.id, problem_id: slug });
        if (error) throw error;
        setIsSolved(true);
      }
    } catch (err) {
      console.error("Supabase Error:", err);
      alert(`Error updating progress: ${err.message}`);
    } finally {
      setMarkingSolved(false);
    }
  };

  if (loading) {
    return (
      <div className="problem-page container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <h2>Loading Problem Details...</h2>
      </div>
    );
  }

  if (error || !problemData) {
    return (
      <div className="problem-page container">
        <div className="problem-header">
          <Link to="/problems" className="back-link">← Back to Problems</Link>
          <div className="title-row">
            <h1 className="problem-title" style={{ color: 'red' }}>Error Loading Problem</h1>
          </div>
          <p>{error || 'Problem not found'}</p>
        </div>
      </div>
    );
  }

  const { title, questionFrontendId, difficulty, content, topicTags, titleSlug } = problemData;

  return (
    <div className="problem-page container">
      <div className="problem-header">
        <Link to="/problems" className="back-link">← Back to Problems</Link>
        <div className="title-row">
          <h1 className="problem-title">{questionFrontendId}. {title}</h1>
          <div className="meta-tags">
            <span className={`difficulty-badge ${difficulty ? difficulty.toLowerCase() : 'medium'}`}>
              {difficulty}
            </span>
            {topicTags && topicTags.map(tag => (
              <span key={tag.name} className="meta-tag topics-tag">{tag.name}</span>
            ))}
          </div>
          <a 
            href={`https://leetcode.com/problems/${titleSlug}/`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="leetcode-link-btn"
          >
            Solve on LeetCode ↗
          </a>
          <button 
            onClick={handleMarkSolved} 
            className="leetcode-link-btn" 
            style={{ 
              background: isSolved ? 'rgba(0, 255, 0, 0.2)' : 'transparent',
              borderColor: isSolved ? '#00ff00' : 'rgba(255,255,255,0.2)',
              marginLeft: '10px'
            }}
            disabled={markingSolved}
          >
            {markingSolved ? '...' : isSolved ? '✅ Solved' : 'Mark as Solved'}
          </button>
        </div>
      </div>

      <div className="problem-content grid-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'stretch' }}>
        <div className="left-panel">
          <section className="glass p-card" style={{ height: '100%', overflowY: 'auto' }}>
            <h2>Description</h2>
            {content ? (
              <div className="prose leetcode-content" dangerouslySetInnerHTML={{ __html: content }}></div>
            ) : (
              <p>Description restricted by LeetCode (Premium Problem or hidden).</p>
            )}
          </section>
        </div>
        
        <div className="right-panel">
          <CodeWorkspace problemId={titleSlug} />
        </div>
      </div>
    </div>
  );
};

export default ProblemDetail;
