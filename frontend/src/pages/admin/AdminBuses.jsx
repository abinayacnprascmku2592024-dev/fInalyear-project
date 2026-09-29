import React, { useState, useEffect } from 'react';
import { FaBus, FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import { busService } from '../../services/busService';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';

const AdminBuses = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [formData, setFormData] = useState({
    bus_number: '',
    registration_number: '',
    bus_type: 'City Bus',
    capacity: 40,
    driver_name: '',
    driver_phone: '',
    status: 'Active',
  });

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    setLoading(true);
    try {
      const res = await busService.getAll();
      setBuses(res.data.results || res.data || []);
    } catch (err) {
      console.error('Error fetching buses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditMode(false);
    setSelectedId(null);
    setFormData({
      bus_number: `BUS-${Math.floor(100 + Math.random() * 900)}`,
      registration_number: `MH-12-AB-${Math.floor(1000 + Math.random() * 9000)}`,
      bus_type: 'City Bus',
      capacity: 40,
      driver_name: '',
      driver_phone: '',
      status: 'Active',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (b) => {
    setEditMode(true);
    setSelectedId(b.id);
    setFormData({
      bus_number: b.bus_number,
      registration_number: b.registration_number,
      bus_type: b.bus_type,
      capacity: b.capacity,
      driver_name: b.driver_name,
      driver_phone: b.driver_phone,
      status: b.status,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode && selectedId) {
        await busService.update(selectedId, formData);
      } else {
        await busService.create(formData);
      }
      setShowModal(false);
      fetchBuses();
    } catch (err) {
      alert('Failed to save bus record.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete bus record?')) return;
    try {
      await busService.delete(id);
      fetchBuses();
    } catch (err) {
      alert('Failed to delete bus record.');
    }
  };

  const filteredBuses = buses.filter(b => 
    b.bus_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.registration_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.driver_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="font-heading fw-bold text-dark mb-1">Transit Buses Management</h3>
          <p className="text-muted small mb-0">Manage transit fleet, bus registrations, capacity, and drivers.</p>
        </div>
        <button className="btn btn-primary-custom d-flex align-items-center gap-2" onClick={handleOpenAdd}>
          <FaPlus /> Add New Bus
        </button>
      </div>

      <div className="app-card p-3 mb-4 shadow-sm">
        <div className="input-group">
          <span className="input-group-text bg-white text-muted"><FaSearch /></span>
          <input 
            type="text" 
            className="form-control" 
            placeholder="Search by bus number, registration number, or driver..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="app-card shadow-sm overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-dark">
              <tr>
                <th>Bus Number</th>
                <th>Registration No.</th>
                <th>Bus Type</th>
                <th>Capacity</th>
                <th>Driver Name</th>
                <th>Driver Phone</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="8" className="text-center py-4">Loading bus fleet...</td></tr>
              ) : filteredBuses.length === 0 ? (
                <tr><td colSpan="8" className="text-center py-4 text-muted">No bus records found.</td></tr>
              ) : (
                filteredBuses.map((b) => (
                  <tr key={b.id}>
                    <td><strong className="font-mono text-primary">{b.bus_number}</strong></td>
                    <td><span className="font-mono fw-semibold">{b.registration_number}</span></td>
                    <td><span className="badge bg-light text-dark border">{b.bus_type}</span></td>
                    <td>{b.capacity} seats</td>
                    <td>{b.driver_name}</td>
                    <td>{b.driver_phone}</td>
                    <td><StatusBadge status={b.status} /></td>
                    <td className="text-end">
                      <div className="btn-group btn-group-sm">
                        <button className="btn btn-outline-primary" onClick={() => handleOpenEdit(b)}><FaEdit /></button>
                        <button className="btn btn-outline-danger" onClick={() => handleDelete(b.id)}><FaTrash /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editMode ? 'Edit Bus Entry' : 'Add New Bus'}
      >
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Bus Number *</label>
              <input type="text" className="form-control" value={formData.bus_number} onChange={(e) => setFormData({...formData, bus_number: e.target.value})} required />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Registration Number *</label>
              <input type="text" className="form-control" value={formData.registration_number} onChange={(e) => setFormData({...formData, registration_number: e.target.value})} required />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Bus Type *</label>
              <select className="form-select" value={formData.bus_type} onChange={(e) => setFormData({...formData, bus_type: e.target.value})}>
                <option value="City Bus">City Bus</option>
                <option value="Express">Express</option>
                <option value="AC Sleeper">AC Sleeper</option>
                <option value="Non-AC Seater">Non-AC Seater</option>
                <option value="Mini Bus">Mini Bus</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Seating Capacity *</label>
              <input type="number" className="form-control" value={formData.capacity} onChange={(e) => setFormData({...formData, capacity: Number(e.target.value)})} required />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Driver Name *</label>
              <input type="text" className="form-control" value={formData.driver_name} onChange={(e) => setFormData({...formData, driver_name: e.target.value})} required />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Driver Phone *</label>
              <input type="text" className="form-control" value={formData.driver_phone} onChange={(e) => setFormData({...formData, driver_phone: e.target.value})} required />
            </div>
            <div className="col-md-12">
              <label className="form-label fw-semibold">Fleet Status</label>
              <select className="form-select" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
          </div>
          <div className="text-end border-top pt-3 mt-4">
            <button type="button" className="btn btn-secondary me-2" onClick={() => setShowModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary-custom">Save Bus Record</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminBuses;
