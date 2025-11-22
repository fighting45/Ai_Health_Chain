import React, { useState, useEffect } from 'react';
import './DataPages.css';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'view'
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    bio: ''
  });

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

  const fetchDoctorById = async (id) => {
    try {
      const response = await fetch(`/doctors/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch doctor');
      }
      const data = await response.json();
      setSelectedDoctor(data);
      setFormData({
        name: data.name,
        specialty: data.specialty,
        bio: data.bio || ''
      });
      setModalMode('view');
      setShowModal(true);
    } catch (err) {
      alert('Error fetching doctor: ' + err.message);
    }
  };

  const handleCreate = () => {
    setFormData({
      name: '',
      specialty: '',
      bio: ''
    });
    setSelectedDoctor(null);
    setModalMode('create');
    setShowModal(true);
  };

  const handleEdit = (doctor) => {
    setSelectedDoctor(doctor);
    setFormData({
      name: doctor.name,
      specialty: doctor.specialty,
      bio: doctor.bio || ''
    });
    setModalMode('edit');
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this doctor?')) {
      return;
    }
    try {
      const response = await fetch(`/doctors/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        alert('Doctor deleted successfully');
        fetchDoctors();
      } else {
        const errorData = await response.json();
        alert('Error deleting doctor: ' + (errorData.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Error deleting doctor: ' + err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const doctorData = {
      name: formData.name,
      specialty: formData.specialty,
      bio: formData.bio
    };

    try {
      if (modalMode === 'create') {
        const response = await fetch('/doctors', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(doctorData)
        });

        if (response.ok) {
          alert('Doctor created successfully');
          setShowModal(false);
          fetchDoctors();
        } else {
          const errorData = await response.json();
          alert('Error creating doctor: ' + (errorData.error || 'Unknown error'));
        }
      } else if (modalMode === 'edit') {
        const response = await fetch(`/doctors/${selectedDoctor.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(doctorData)
        });

        if (response.ok) {
          alert('Doctor updated successfully');
          setShowModal(false);
          fetchDoctors();
        } else {
          const errorData = await response.json();
          alert('Error updating doctor: ' + (errorData.error || 'Unknown error'));
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

  if (loading) return <div className="page-container"><div className="loading">Loading doctors...</div></div>;
  if (error) return <div className="page-container"><div className="error">Error: {error}</div></div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Doctors</h1>
        <p>View and manage doctor profiles</p>
        <button className="btn-primary" onClick={handleCreate}>
          + Add New Doctor
        </button>
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
              <div className="card-actions">
                <button className="btn-view" onClick={() => fetchDoctorById(doctor.id)}>
                  View Details
                </button>
                <button className="btn-edit" onClick={() => handleEdit(doctor)}>
                  Edit
                </button>
                <button className="btn-delete" onClick={() => handleDelete(doctor.id)}>
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
                {modalMode === 'create' && 'Create New Doctor'}
                {modalMode === 'edit' && 'Edit Doctor'}
                {modalMode === 'view' && 'Doctor Details'}
              </h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                &times;
              </button>
            </div>

            {modalMode === 'view' ? (
              <div className="modal-body">
                <div className="detail-row">
                  <strong>ID:</strong> {selectedDoctor?.id}
                </div>
                <div className="detail-row">
                  <strong>Name:</strong> {selectedDoctor?.name}
                </div>
                <div className="detail-row">
                  <strong>Specialty:</strong> {selectedDoctor?.specialty}
                </div>
                <div className="detail-row">
                  <strong>Bio:</strong>
                  <div className="detail-text">{selectedDoctor?.bio || 'None'}</div>
                </div>
                <div className="modal-actions">
                  <button className="btn-edit" onClick={() => setModalMode('edit')}>
                    Edit Doctor
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
                      placeholder="Enter doctor name"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="specialty">Specialty *</label>
                    <input
                      type="text"
                      id="specialty"
                      name="specialty"
                      value={formData.specialty}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter specialty (e.g., Cardiology)"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="bio">Bio</label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="Enter doctor bio"
                      rows="4"
                    />
                  </div>
                </div>
                <div className="modal-actions">
                  <button type="submit" className="btn-primary">
                    {modalMode === 'create' ? 'Create Doctor' : 'Update Doctor'}
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

export default Doctors;
