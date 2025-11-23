import React, { useState, useEffect } from 'react';
import './DataPages.css';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'view'
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    dateTime: '',
    reason: ''
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [appointmentsRes, patientsRes, doctorsRes] = await Promise.all([
        fetch('/appointments'),
        fetch('/patients'),
        fetch('/doctors')
      ]);

      const appointmentsData = await appointmentsRes.json();
      const patientsData = await patientsRes.json();
      const doctorsData = await doctorsRes.json();

      setAppointments(appointmentsData);
      setPatients(patientsData);
      setDoctors(doctorsData);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchAppointmentById = async (id) => {
    try {
      const response = await fetch(`/appointments/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch appointment');
      }
      const data = await response.json();
      setSelectedAppointment(data);
      setFormData({
        patientId: data.patientId,
        doctorId: data.doctorId,
        dateTime: data.dateTime,
        reason: data.reason || ''
      });
      setModalMode('view');
      setShowModal(true);
    } catch (err) {
      alert('Error fetching appointment: ' + err.message);
    }
  };

  const handleCreate = () => {
    setFormData({
      patientId: '',
      doctorId: '',
      dateTime: '',
      reason: ''
    });
    setSelectedAppointment(null);
    setModalMode('create');
    setShowModal(true);
  };

  const handleEdit = (appointment) => {
    setSelectedAppointment(appointment);
    setFormData({
      patientId: appointment.patientId,
      doctorId: appointment.doctorId,
      dateTime: appointment.dateTime,
      reason: appointment.reason || ''
    });
    setModalMode('edit');
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) {
      return;
    }
    try {
      const response = await fetch(`/appointments/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        alert('Appointment deleted successfully');
        fetchAllData();
      } else {
        const errorData = await response.json();
        alert('Error deleting appointment: ' + (errorData.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Error deleting appointment: ' + err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const appointmentData = {
      patientId: parseInt(formData.patientId),
      doctorId: parseInt(formData.doctorId),
      dateTime: formData.dateTime,
      reason: formData.reason
    };

    try {
      if (modalMode === 'create') {
        const response = await fetch('/appointments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(appointmentData)
        });

        if (response.ok) {
          alert('Appointment created successfully');
          setShowModal(false);
          fetchAllData();
        } else {
          const errorData = await response.json();
          alert('Error creating appointment: ' + (errorData.error || 'Unknown error'));
        }
      } else if (modalMode === 'edit') {
        const response = await fetch(`/appointments/${selectedAppointment.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(appointmentData)
        });

        if (response.ok) {
          alert('Appointment updated successfully');
          setShowModal(false);
          fetchAllData();
        } else {
          const errorData = await response.json();
          alert('Error updating appointment: ' + (errorData.error || 'Unknown error'));
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

  const getPatientName = (patientId) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? patient.name : `Patient #${patientId}`;
  };

  const getDoctorName = (doctorId) => {
    const doctor = doctors.find(d => d.id === doctorId);
    return doctor ? doctor.name : `Doctor #${doctorId}`;
  };

  if (loading) return <div className="page-container"><div className="loading">Loading appointments...</div></div>;
  if (error) return <div className="page-container"><div className="error">Error: {error}</div></div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Appointments</h1>
        <p>Schedule and manage appointments</p>
        <button className="btn-primary" onClick={handleCreate}>
          + Schedule Appointment
        </button>
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
                <p><strong>Patient:</strong> {getPatientName(appointment.patientId)}</p>
                <p><strong>Doctor:</strong> {getDoctorName(appointment.doctorId)}</p>
                <p><strong>Date & Time:</strong> {new Date(appointment.dateTime).toLocaleString()}</p>
                {appointment.reason && (
                  <p><strong>Reason:</strong> {appointment.reason}</p>
                )}
              </div>
              <div className="card-actions">
                <button className="btn-view" onClick={() => fetchAppointmentById(appointment.id)}>
                  View Details
                </button>
                <button className="btn-edit" onClick={() => handleEdit(appointment)}>
                  Edit
                </button>
                <button className="btn-delete" onClick={() => handleDelete(appointment.id)}>
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
                {modalMode === 'create' && 'Schedule New Appointment'}
                {modalMode === 'edit' && 'Edit Appointment'}
                {modalMode === 'view' && 'Appointment Details'}
              </h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                &times;
              </button>
            </div>

            {modalMode === 'view' ? (
              <div className="modal-body">
                <div className="detail-row">
                  <strong>ID:</strong> {selectedAppointment?.id}
                </div>
                <div className="detail-row">
                  <strong>Patient:</strong> {getPatientName(selectedAppointment?.patientId)}
                </div>
                <div className="detail-row">
                  <strong>Doctor:</strong> {getDoctorName(selectedAppointment?.doctorId)}
                </div>
                <div className="detail-row">
                  <strong>Date & Time:</strong> {selectedAppointment?.dateTime && new Date(selectedAppointment.dateTime).toLocaleString()}
                </div>
                <div className="detail-row">
                  <strong>Reason:</strong>
                  <div className="detail-text">{selectedAppointment?.reason || 'None specified'}</div>
                </div>
                <div className="modal-actions">
                  <button className="btn-edit" onClick={() => setModalMode('edit')}>
                    Edit Appointment
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
                    <label htmlFor="patientId">Patient *</label>
                    <select
                      id="patientId"
                      name="patientId"
                      value={formData.patientId}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select a patient</option>
                      {patients.map(patient => (
                        <option key={patient.id} value={patient.id}>
                          {patient.name} (ID: {patient.id})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="doctorId">Doctor *</label>
                    <select
                      id="doctorId"
                      name="doctorId"
                      value={formData.doctorId}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select a doctor</option>
                      {doctors.map(doctor => (
                        <option key={doctor.id} value={doctor.id}>
                          {doctor.name} - {doctor.specialty} (ID: {doctor.id})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="dateTime">Date & Time *</label>
                    <input
                      type="datetime-local"
                      id="dateTime"
                      name="dateTime"
                      value={formData.dateTime}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="reason">Reason for Visit</label>
                    <textarea
                      id="reason"
                      name="reason"
                      value={formData.reason}
                      onChange={handleInputChange}
                      placeholder="Enter reason for appointment"
                      rows="4"
                    />
                  </div>
                </div>
                <div className="modal-actions">
                  <button type="submit" className="btn-primary">
                    {modalMode === 'create' ? 'Schedule Appointment' : 'Update Appointment'}
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

export default Appointments;
