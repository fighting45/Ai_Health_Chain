import React from 'react';
import { Link } from 'react-router-dom';
import './AppDashboard.css';

const AppDashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <h1 className="dashboard-title">Healthcare Management Dashboard</h1>
        <p className="dashboard-subtitle">Select a module to get started</p>

        <div className="dashboard-grid">
          <Link to="/app/patients" className="dashboard-card">
            <div className="card-icon">👥</div>
            <h2>Patients</h2>
            <p>Manage patient records and medical history</p>
            <span className="card-arrow">→</span>
          </Link>

          <Link to="/app/doctors" className="dashboard-card">
            <div className="card-icon">🩺</div>
            <h2>Doctors</h2>
            <p>View and manage doctor profiles</p>
            <span className="card-arrow">→</span>
          </Link>

          <Link to="/app/appointments" className="dashboard-card">
            <div className="card-icon">📅</div>
            <h2>Appointments</h2>
            <p>Schedule and manage appointments</p>
            <span className="card-arrow">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AppDashboard;
