import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import Roadmap from '../components/Roadmap';
import Features from '../components/Features';
import UserProgress from '../components/UserProgress';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { user } = useAuth();

  return (
    <main>
      {user ? <UserProgress /> : <Hero />}
      <Roadmap />
      <Features />
    </main>
  );
};

export default LandingPage;
