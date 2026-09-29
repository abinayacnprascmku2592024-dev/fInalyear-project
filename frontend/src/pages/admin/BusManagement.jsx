import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Bus as BusIcon, Search } from 'lucide-react';
import { busService } from '../../services/busService';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';

const BusManagement = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingBus, setEditingBus] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    bus_number: '',
    registration_number: '',
    bus_type: 'AC Deluxe',
    capacity: 45,
    driver_name: '',
    driver_phone: '',
    status: 'Active',
  });

  const fetchBuses = async () => {
    setLoading(true);
    try {
      const res = await busService.getAll({ search });
      setBuses(res.data?.data || []);
    } catch (err) {
      setErrorMsg('Failed to load buses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuses();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchBuses();
  };

  const handleOpenAddModal = () => {
    setEditingBus(null);
    setFormData({
      bus_number: '',
      registration_number: '',
      bus_type: 'AC Deluxe',
      capacity: 45,
      driver_name: '',
      driver_phone: '',
      status: 'Active',
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (bus) => {
    setEditingBus(bus);
    setFormData({
      bus_number: bus.bus_number,
      registration_number: bus.registration_number,
      bus_type: bus.bus_type,
      capacity: bus.capacity,
      driver_name: bus.driver_name,
      driver_phone: bus.driver_phone,
      status: bus.status,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      if (editingBus) {
        await busService.update(editingBus.id, formData);
        setSuccessMsg(`Bus ${formData.bus_number} updated.`);
      } else {
        await busService.create(formData);
        setSuccessMsg(`Bus ${formData.bus_number} created.`);
      }
      setShowModal(false);
      fetchBuses();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save bus record.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this bus record?')) return;
    try {
      await busService.delete(id);
      setSuccessMsg('Bus record deleted.');
      fetchBuses();
    } catch (err) {
      setErrorMsg('Failed to delete bus record.');
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-1">Bus Fleet Management</h3>
          <p className="text-muted mb-0">Manage transit buses, capacity, drivers, and operational statuses.</p>
        </div>
        <button className="btn btn-primary rounded-pill px-4 d-flex align-items-center gap-2" onClick={handleOpenAddModal}>
          <Plus size={18} />
          <span>Add New Bus</span>
        </button>
      </div>

      {successMsg && <div className="alert alert-success">{successMsg}</div>}
      {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

      <div className="custom-card p-3 mb-4 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="d-flex gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search bus number, registration, or driver..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="btn btn-primary px-4">Search</button>
        </form>
      </div>

      <div className="custom-card shadow-sm overflow-hidden">
        {loading ? (
          <LoadingSpinner text="Loading bus fleet..." />
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th>Bus Number</th>
                  <th>Registration No</th>
                  <th>Bus Type</th>
                  <th>Capacity</th>
                  <th>Driver Name</th>
                  <th>Driver Phone</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {buses.map((bus) => (
                  <tr key={bus.id}>
                    <td><strong className="text-primary font-monospace">{bus.bus_number}</strong></td>
                    <td>{bus.registration_number}</td>
                    <td><span className="badge bg-light text-dark border">{bus.bus_type}</span></td>
                    <td>{bus.capacity} seats</td>
                    <td>{bus.driver_name}</td>
                    <td>{bus.driver_phone}</td>
                    <td><StatusBadge status={bus.status} /></td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleOpenEditModal(bus)}>
                        <Edit2 size={16} />
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(bus.id)}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="modal show d-block backdrop-blur bg-dark bg-opacity-50" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <form onSubmit={handleSubmit}>
                <div className="modal-header bg-dark text-white">
                  <h5 className="modal-title fw-bold">{editingBus ? 'Edit Bus' : 'Add New Bus'}</h5>
                  <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body p-4 row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Bus Number *</label>
                    <input type="text" className="form-control" value={formData.bus_number} onChange={(e) => setFormData({ ...formData, bus_number: e.target.value })} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Registration Number *</label>
                    <input type="text" className="form-control" value={formData.registration_number} onChange={(e) => setFormData({ ...formData, registration_number: e.target.value })} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Bus Type *</label>
                    <input type="text" className="form-control" value={formData.bus_type} onChange={(e) => setFormData({ ...formData, bus_type: e.target.value })} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Seating Capacity *</label>
                    <input type="number" className="form-control" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: e.target.value })} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Driver Name *</label>
                    <input type="text" className="form-control" value={formData.driver_name} onChange={(e) => setFormData({ ...formData, driver_name: e.target.value })} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Driver Phone *</label>
                    <input type="text" className="form-control" value={formData.driver_phone} onChange={(e) => setFormData({ ...formData, driver_phone: e.target.value })} required />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">Status *</label>
                    <select className="form-select" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Maintenance">Maintenance</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary rounded-pill" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary rounded-pill px-4">Save Bus</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusManagement;
