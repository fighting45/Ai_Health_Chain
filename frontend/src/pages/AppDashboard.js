import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AppDashboard.css';

const AppDashboard = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    todayAppointments: 0
  });
  const [recentPatients, setRecentPatients] = useState([]);
  const [recentDoctors, setRecentDoctors] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch all data
      const [patientsRes, doctorsRes, appointmentsRes] = await Promise.all([
        fetch('/patients'),
        fetch('/doctors'),
        fetch('/appointments')
      ]);

      const patients = await patientsRes.json();
      const doctors = await doctorsRes.json();
      const appointments = await appointmentsRes.json();

      // Calculate statistics
      const today = new Date().toISOString().split('T')[0];
      const todayAppts = appointments.filter(apt => apt.date === today).length;

      setStats({
        totalPatients: patients.length,
        totalDoctors: doctors.length,
        totalAppointments: appointments.length,
        todayAppointments: todayAppts
      });

      // Get recent data (last 5)
      setRecentPatients(patients.slice(-5).reverse());
      setRecentDoctors(doctors.slice(-5).reverse());

      // Get upcoming appointments (sort by date)
      const upcoming = appointments
        .filter(apt => new Date(apt.date) >= new Date())
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 5);
      setUpcomingAppointments(upcoming);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const getSpecialtyStats = () => {
    // Calculate doctor specialties distribution
    const specialties = {};
    recentDoctors.forEach(doc => {
      specialties[doc.specialty] = (specialties[doc.specialty] || 0) + 1;
    });
    return Object.entries(specialties).slice(0, 3);
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-dashboard">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">Healthcare Management Dashboard</h1>
          <p className="dashboard-subtitle">Welcome back! Here's what's happening today</p>
        </div>
        <div className="header-time">
          <div className="current-date">{new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-patients">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>Total Patients</h3>
            <div className="stat-number">{stats.totalPatients}</div>
            <Link to="/app/patients" className="stat-link">View all →</Link>
          </div>
        </div>

        <div className="stat-card stat-doctors">
          <div className="stat-icon">🩺</div>
          <div className="stat-info">
            <h3>Total Doctors</h3>
            <div className="stat-number">{stats.totalDoctors}</div>
            <Link to="/app/doctors" className="stat-link">View all →</Link>
          </div>
        </div>

        <div className="stat-card stat-appointments">
          <div className="stat-icon">📅</div>
          <div className="stat-info">
            <h3>Total Appointments</h3>
            <div className="stat-number">{stats.totalAppointments}</div>
            <Link to="/app/appointments" className="stat-link">View all →</Link>
          </div>
        </div>

        <div className="stat-card stat-today">
          <div className="stat-icon">⏰</div>
          <div className="stat-info">
            <h3>Today's Appointments</h3>
            <div className="stat-number">{stats.todayAppointments}</div>
            <div className="stat-label">Scheduled for today</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <h2 className="section-title">Quick Actions</h2>
        <div className="quick-actions-grid">
          <Link to="/app/patients" className="action-card action-primary">
            <div className="action-icon">➕</div>
            <div className="action-text">
              <h3>Add Patient</h3>
              <p>Register a new patient</p>
            </div>
          </Link>

          <Link to="/app/appointments" className="action-card action-secondary">
            <div className="action-icon">📋</div>
            <div className="action-text">
              <h3>Schedule Appointment</h3>
              <p>Book a new appointment</p>
            </div>
          </Link>

          <Link to="/app/doctors" className="action-card action-tertiary">
            <div className="action-icon">👨‍⚕️</div>
            <div className="action-text">
              <h3>View Doctors</h3>
              <p>Browse doctor profiles</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-content-grid">
        {/* Recent Patients */}
        <div className="dashboard-widget">
          <div className="widget-header">
            <h2 className="widget-title">Recent Patients</h2>
            <Link to="/app/patients" className="widget-link">View all</Link>
          </div>
          <div className="widget-content">
            {recentPatients.length === 0 ? (
              <p className="empty-state">No patients found</p>
            ) : (
              <div className="list-items">
                {recentPatients.map((patient) => (
                  <div key={patient.id} className="list-item">
                    <div className="item-avatar">👤</div>
                    <div className="item-info">
                      <div className="item-name">{patient.name}</div>
                      <div className="item-meta">
                        {patient.age ? `${patient.age} years` : 'Age N/A'} • {patient.gender || 'N/A'}
                      </div>
                    </div>
                    <div className="item-badge">ID: {patient.id}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="dashboard-widget">
          <div className="widget-header">
            <h2 className="widget-title">Upcoming Appointments</h2>
            <Link to="/app/appointments" className="widget-link">View all</Link>
          </div>
          <div className="widget-content">
            {upcomingAppointments.length === 0 ? (
              <p className="empty-state">No upcoming appointments</p>
            ) : (
              <div className="list-items">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="list-item appointment-item">
                    <div className="item-avatar appointment-avatar">📅</div>
                    <div className="item-info">
                      <div className="item-name">Patient ID: {appointment.patientId}</div>
                      <div className="item-meta">
                        Doctor ID: {appointment.doctorId} • {appointment.date}
                      </div>
                    </div>
                    <div className="appointment-status">{appointment.status || 'Scheduled'}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Doctors */}
        <div className="dashboard-widget">
          <div className="widget-header">
            <h2 className="widget-title">Recent Doctors</h2>
            <Link to="/app/doctors" className="widget-link">View all</Link>
          </div>
          <div className="widget-content">
            {recentDoctors.length === 0 ? (
              <p className="empty-state">No doctors found</p>
            ) : (
              <div className="list-items">
                {recentDoctors.map((doctor) => (
                  <div key={doctor.id} className="list-item">
                    <div className="item-avatar doctor-avatar">👨‍⚕️</div>
                    <div className="item-info">
                      <div className="item-name">{doctor.name}</div>
                      <div className="item-meta">{doctor.specialty}</div>
                    </div>
                    <div className="item-badge specialty-badge">{doctor.specialty}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* System Overview */}
        <div className="dashboard-widget overview-widget">
          <div className="widget-header">
            <h2 className="widget-title">System Overview</h2>
          </div>
          <div className="widget-content">
            <div className="overview-stats">
              <div className="overview-item">
                <div className="overview-label">Total Records</div>
                <div className="overview-value">
                  {stats.totalPatients + stats.totalDoctors + stats.totalAppointments}
                </div>
              </div>
              <div className="overview-item">
                <div className="overview-label">Active Modules</div>
                <div className="overview-value">3</div>
              </div>
              <div className="overview-item">
                <div className="overview-label">Database Status</div>
                <div className="overview-value status-active">Active</div>
              </div>
            </div>

            <div className="progress-section">
              <div className="progress-item">
                <div className="progress-header">
                  <span>Patients</span>
                  <span className="progress-count">{stats.totalPatients}</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill progress-patients"
                    style={{ width: `${Math.min((stats.totalPatients / 100) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="progress-item">
                <div className="progress-header">
                  <span>Doctors</span>
                  <span className="progress-count">{stats.totalDoctors}</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill progress-doctors"
                    style={{ width: `${Math.min((stats.totalDoctors / 100) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="progress-item">
                <div className="progress-header">
                  <span>Appointments</span>
                  <span className="progress-count">{stats.totalAppointments}</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill progress-appointments"
                    style={{ width: `${Math.min((stats.totalAppointments / 100) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppDashboard;
