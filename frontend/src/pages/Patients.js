import React, { useState, useEffect } from 'react';
import './DataPages.css';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'view'
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    medicalHistory: ''
  });

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

  const fetchPatientById = async (id) => {
    try {
      const response = await fetch(`/patients/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch patient');
      }
      const data = await response.json();
      setSelectedPatient(data);
      setFormData({
        name: data.name,
        age: data.age || '',
        gender: data.gender || '',
        medicalHistory: data.medicalHistory || ''
      });
      setModalMode('view');
      setShowModal(true);
    } catch (err) {
      alert('Error fetching patient: ' + err.message);
    }
  };

  const handleCreate = () => {
    setFormData({
      name: '',
      age: '',
      gender: '',
      medicalHistory: ''
    });
    setSelectedPatient(null);
    setModalMode('create');
    setShowModal(true);
  };

  const handleEdit = (patient) => {
    setSelectedPatient(patient);
    setFormData({
      name: patient.name,
      age: patient.age || '',
      gender: patient.gender || '',
      medicalHistory: patient.medicalHistory || ''
    });
    setModalMode('edit');
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this patient?')) {
      return;
    }
    try {
      const response = await fetch(`/patients/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        alert('Patient deleted successfully');
        fetchPatients();
      } else {
        const errorData = await response.json();
        alert('Error deleting patient: ' + (errorData.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Error deleting patient: ' + err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const patientData = {
      name: formData.name,
      age: formData.age ? parseInt(formData.age) : null,
      gender: formData.gender,
      medicalHistory: formData.medicalHistory
    };

    try {
      if (modalMode === 'create') {
        const response = await fetch('/patients', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(patientData)
        });

        if (response.ok) {
          alert('Patient created successfully');
          setShowModal(false);
          fetchPatients();
        } else {
          const errorData = await response.json();
          alert('Error creating patient: ' + (errorData.error || 'Unknown error'));
        }
      } else if (modalMode === 'edit') {
        const response = await fetch(`/patients/${selectedPatient.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(patientData)
        });

        if (response.ok) {
          alert('Patient updated successfully');
          setShowModal(false);
          fetchPatients();
        } else {
          const errorData = await response.json();
          alert('Error updating patient: ' + (errorData.error || 'Unknown error'));
        }
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) return <div className="page-container"><div className="loading">Loading patients...</div></div>;
  if (error) return <div className="page-container"><div className="error">Error: {error}</div></div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Patients</h1>
        <p>Manage patient records and medical history</p>
        <button className="btn-primary" onClick={handleCreate}>
          + Add New Patient
        </button>
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
              <div className="card-actions">
                <button className="btn-view" onClick={() => fetchPatientById(patient.id)}>
                  View Details
                </button>
                <button className="btn-edit" onClick={() => handleEdit(patient)}>
                  Edit
                </button>
                <button className="btn-delete" onClick={() => handleDelete(patient.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {modalMode === 'create' && 'Create New Patient'}
                {modalMode === 'edit' && 'Edit Patient'}
                {modalMode === 'view' && 'Patient Details'}
              </h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                &times;
              </button>
            </div>

            {modalMode === 'view' ? (
              <div className="modal-body">
                <div className="detail-row">
                  <strong>ID:</strong> {selectedPatient?.id}
                </div>
                <div className="detail-row">
                  <strong>Name:</strong> {selectedPatient?.name}
                </div>
                <div className="detail-row">
                  <strong>Age:</strong> {selectedPatient?.age || 'N/A'}
                </div>
                <div className="detail-row">
                  <strong>Gender:</strong> {selectedPatient?.gender || 'N/A'}
                </div>
                <div className="detail-row">
                  <strong>Medical History:</strong>
                  <div className="detail-text">{selectedPatient?.medicalHistory || 'None'}</div>
                </div>
                <div className="modal-actions">
                  <button className="btn-edit" onClick={() => setModalMode('edit')}>
                    Edit Patient
                  </button>
                  <button className="btn-secondary" onClick={() => setShowModal(false)}>
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="form-group">
                    <label htmlFor="name">Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter patient name"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="age">Age</label>
                    <input
                      type="number"
                      id="age"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      placeholder="Enter age"
                      min="0"
                      max="150"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="gender">Gender</label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="medicalHistory">Medical History</label>
                    <textarea
                      id="medicalHistory"
                      name="medicalHistory"
                      value={formData.medicalHistory}
                      onChange={handleInputChange}
                      placeholder="Enter medical history"
                      rows="4"
                    />
                  </div>
                </div>
                <div className="modal-actions">
                  <button type="submit" className="btn-primary">
                    {modalMode === 'create' ? 'Create Patient' : 'Update Patient'}
                  </button>
                  <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Patients;
