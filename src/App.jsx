import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, useTheme } from './ThemeContext';
import LandingPage from './pages/LandingPage';
import ProblemDetail from './pages/problems/ProblemDetail';
import TopicPage from './pages/TopicPage';
import ProblemsPage from './pages/ProblemsPage';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import { AuthProvider } from './context/AuthContext';
import './App.css';

function AppContent() {
  const { isDarkMode, toggleTheme } = useTheme();
  
  return (
    <div className={`app ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      <Router>
        <Navbar toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
        <AuthModal />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/problems" element={<ProblemsPage />} />
          <Route path="/topic/:topicName" element={<TopicPage />} />
          <Route path="/problems/:slug" element={<ProblemDetail />} />
        </Routes>
      </Router>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
