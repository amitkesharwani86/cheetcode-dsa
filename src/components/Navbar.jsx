import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, openAuthModal, signOut } = useAuth();

  return (
    <nav className="navbar glass">
      <div className="navbar-container container">
        <Link to="/" className="navbar-logo">
          Cheet<span>Code</span>
        </Link>
        
        <div className={`navbar-links ${isOpen ? 'active' : ''}`}>
          <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/problems" onClick={() => setIsOpen(false)}>All Problems</Link>
          <div className="navbar-theme-container">
            <ThemeToggle />
          </div>
          {user ? (
            <div className="auth-menu">
              <span className="user-email" style={{ marginRight: '1rem', fontSize: '0.9rem', opacity: 0.8 }}>
                {user.user_metadata?.username || user.email}
              </span>
              <button className="auth-btn logout-btn" onClick={signOut}>Logout</button>
            </div>
          ) : (
            <button className="auth-btn login-btn" onClick={openAuthModal}>Log In / Sign Up</button>
          )}
        </div>

        <button className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? '✕' : '☰'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
