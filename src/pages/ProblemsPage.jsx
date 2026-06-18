import React, { useState, useEffect } from 'react';
import TopicGrid from '../components/TopicGrid';
import './FeaturedProblems.css';
import { Link } from 'react-router-dom';
import ALL_PROBLEMS from '../data/problems_with_tags.json';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';

const FeaturedProblems = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [solvedSet, setSolvedSet] = useState(new Set());
  const { user } = useAuth();
  const itemsPerPage = 50;

  useEffect(() => {
    const fetchSolved = async () => {
      if (!user) {
        setSolvedSet(new Set());
        return;
      }
      try {
        const { data, error } = await supabase
          .from('solved_problems')
          .select('problem_id')
          .eq('user_id', user.id);
        
        if (data) {
          setSolvedSet(new Set(data.map(d => d.problem_id)));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchSolved();
  }, [user]);

  const filteredProblems = ALL_PROBLEMS.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.id.toString() === searchQuery
  );

  const totalPages = Math.ceil(filteredProblems.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const currentProblems = filteredProblems.slice(startIndex, startIndex + itemsPerPage);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setPage(1); // Reset to first page on new search
  };

  return (
    <section className="featured-problems container" style={{ paddingTop: '2rem' }}>
      <div className="section-header">
        <h2 className="section-title">All {ALL_PROBLEMS.length} Problems</h2>
      </div>
      
      <div className="search-container">
        <input 
          type="text" 
          className="search-input glass" 
          placeholder="Search for a problem or ID..." 
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      <div className="problems-list">
        {currentProblems.length > 0 ? (
          currentProblems.map((p) => {
            const isSolved = solvedSet.has(p.slug);
            return (
            <Link key={p.id} to={`/problems/${p.slug}`} className="problem-link-card glass">
              <span className="problem-id">{p.id}</span>
              <h3 className="problem-name">
                {isSolved && <span style={{ color: '#00ff00', marginRight: '8px' }}>✅</span>}
                {p.title} {p.paidOnly ? '🔒' : ''}
              </h3>
              <span className={`difficulty-badge ${p.difficulty.toLowerCase()}`}>{p.difficulty}</span>
            </Link>
          )})
        ) : (
          <div className="no-results">No problems found matching "{searchQuery}"</div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
          <button 
            className="glass" 
            style={{ padding: '0.5rem 1rem', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.5 : 1 }}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <span style={{ padding: '0.5rem 1rem' }}>Page {page} of {totalPages}</span>
          <button 
            className="glass" 
            style={{ padding: '0.5rem 1rem', cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.5 : 1 }}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
};

const ProblemsPage = () => {
  return (
    <div className="problems-page">
      <TopicGrid />
      <FeaturedProblems />
    </div>
  );
};

export default ProblemsPage;
