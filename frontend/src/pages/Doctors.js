import React, { useState, useEffect } from 'react';
import './DataPages.css';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await fetch('/doctors');
      if (!response.ok) {
        throw new Error('Failed to fetch doctors');
      }
      const data = await response.json();
      setDoctors(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) return <div className="page-container"><div className="loading">Loading doctors...</div></div>;
  if (error) return <div className="page-container"><div className="error">Error: {error}</div></div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Doctors</h1>
        <p>View and manage doctor profiles</p>
      </div>

      <div className="data-grid">
        {doctors.length === 0 ? (
          <p className="no-data">No doctors found</p>
        ) : (
          doctors.map((doctor) => (
            <div key={doctor.id} className="data-card">
              <div className="card-header">
                <h3>{doctor.name}</h3>
                <span className="badge specialty">{doctor.specialty}</span>
              </div>
              <div className="card-body">
                <p><strong>ID:</strong> {doctor.id}</p>
                {doctor.bio && (
                  <p><strong>Bio:</strong> {doctor.bio}</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Doctors;
