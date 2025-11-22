import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  const handleLaunchApp = () => {
    navigate('/app');
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <div className="hero-section">
          <h1 className="hero-title">AI Health Chain Tools</h1>
          <p className="hero-description">
            Empowering healthcare with advanced AI-driven solutions for patient management,
            doctor coordination, and appointment scheduling.
          </p>
          <button onClick={handleLaunchApp} className="launch-button">
            Launch App
          </button>
        </div>

        <div className="features-section">
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Patient Management</h3>
            <p>Efficiently manage patient records, medical history, and personal information</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🩺</div>
            <h3>Doctor Directory</h3>
            <p>Organize and access comprehensive doctor profiles and specialties</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📅</div>
            <h3>Appointment Scheduling</h3>
            <p>Seamless appointment booking and management system</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
