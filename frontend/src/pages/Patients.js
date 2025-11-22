import React, { useState, useEffect } from 'react';
import './DataPages.css';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await fetch('/patients');
      if (!response.ok) {
        throw new Error('Failed to fetch patients');
      }
      const data = await response.json();
      setPatients(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) return <div className="page-container"><div className="loading">Loading patients...</div></div>;
  if (error) return <div className="page-container"><div className="error">Error: {error}</div></div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Patients</h1>
        <p>Manage patient records and medical history</p>
      </div>

      <div className="data-grid">
        {patients.length === 0 ? (
          <p className="no-data">No patients found</p>
        ) : (
          patients.map((patient) => (
            <div key={patient.id} className="data-card">
              <div className="card-header">
                <h3>{patient.name}</h3>
                <span className="badge">ID: {patient.id}</span>
              </div>
              <div className="card-body">
                <p><strong>Age:</strong> {patient.age || 'N/A'}</p>
                <p><strong>Gender:</strong> {patient.gender || 'N/A'}</p>
                {patient.medicalHistory && (
                  <p><strong>Medical History:</strong> {patient.medicalHistory}</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Patients;
