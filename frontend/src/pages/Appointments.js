import React, { useState, useEffect } from 'react';
import './DataPages.css';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch('/appointments');
      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }
      const data = await response.json();
      setAppointments(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) return <div className="page-container"><div className="loading">Loading appointments...</div></div>;
  if (error) return <div className="page-container"><div className="error">Error: {error}</div></div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Appointments</h1>
        <p>Schedule and manage appointments</p>
      </div>

      <div className="data-grid">
        {appointments.length === 0 ? (
          <p className="no-data">No appointments found</p>
        ) : (
          appointments.map((appointment) => (
            <div key={appointment.id} className="data-card">
              <div className="card-header">
                <h3>Appointment #{appointment.id}</h3>
                <span className="badge">{new Date(appointment.dateTime).toLocaleDateString()}</span>
              </div>
              <div className="card-body">
                <p><strong>Patient ID:</strong> {appointment.patientId}</p>
                <p><strong>Doctor ID:</strong> {appointment.doctorId}</p>
                <p><strong>Date & Time:</strong> {new Date(appointment.dateTime).toLocaleString()}</p>
                {appointment.reason && (
                  <p><strong>Reason:</strong> {appointment.reason}</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Appointments;
