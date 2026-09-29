import React, { useState, useEffect } from 'react';
import { FaRoute, FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import { routeService } from '../../services/routeService';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';

const AdminRoutes = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [formData, setFormData] = useState({
    route_number: '',
    route_name: '',
    starting_point: '',
    destination: '',
    distance: '20 km',
    estimated_time: '40 mins',
    status: 'Active',
  });

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    setLoading(true);
    try {
      const res = await routeService.getAll();
      setRoutes(res.data.results || res.data || []);
    } catch (err) {
      console.error('Error fetching routes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditMode(false);
    setSelectedId(null);
    setFormData({
      route_number: `R-${Math.floor(100 + Math.random() * 900)}`,
      route_name: '',
      starting_point: '',
      destination: '',
      distance: '20 km',
      estimated_time: '40 mins',
      status: 'Active',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (r) => {
    setEditMode(true);
    setSelectedId(r.id);
    setFormData({
      route_number: r.route_number,
      route_name: r.route_name,
      starting_point: r.starting_point,
      destination: r.destination,
      distance: r.distance,
      estimated_time: r.estimated_time,
      status: r.status,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode && selectedId) {
        await routeService.update(selectedId, formData);
      } else {
        await routeService.create(formData);
      }
      setShowModal(false);
      fetchRoutes();
    } catch (err) {
      alert('Failed to save route.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete route?')) return;
    try {
      await routeService.delete(id);
      fetchRoutes();
    } catch (err) {
      alert('Failed to delete route.');
    }
  };

  const filteredRoutes = routes.filter(r => 
    r.route_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.route_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.starting_point?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.destination?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="font-heading fw-bold text-dark mb-1">Route Network Management</h3>
          <p className="text-muted small mb-0">Create and update transport corridors, starting points, and destinations.</p>
        </div>
        <button className="btn btn-primary-custom d-flex align-items-center gap-2" onClick={handleOpenAdd}>
          <FaPlus /> Add New Route
        </button>
      </div>

      <div className="app-card p-3 mb-4 shadow-sm">
        <div className="input-group">
          <span className="input-group-text bg-white text-muted"><FaSearch /></span>
          <input 
            type="text" 
            className="form-control" 
            placeholder="Search by route number, name, origin..." 
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
                <th>Route Number</th>
                <th>Route Name</th>
                <th>Starting Point</th>
                <th>Destination</th>
                <th>Distance</th>
                <th>Est. Time</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="8" className="text-center py-4">Loading routes...</td></tr>
              ) : filteredRoutes.length === 0 ? (
                <tr><td colSpan="8" className="text-center py-4 text-muted">No routes found.</td></tr>
              ) : (
                filteredRoutes.map((r) => (
                  <tr key={r.id}>
                    <td><strong className="font-mono text-primary">{r.route_number}</strong></td>
                    <td className="fw-semibold text-dark">{r.route_name}</td>
                    <td>{r.starting_point}</td>
                    <td>{r.destination}</td>
                    <td>{r.distance}</td>
                    <td>{r.estimated_time}</td>
                    <td><StatusBadge status={r.status} /></td>
                    <td className="text-end">
                      <div className="btn-group btn-group-sm">
                        <button className="btn btn-outline-primary" onClick={() => handleOpenEdit(r)}><FaEdit /></button>
                        <button className="btn btn-outline-danger" onClick={() => handleDelete(r.id)}><FaTrash /></button>
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
        title={editMode ? 'Edit Route Entry' : 'Add New Route'}
      >
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Route Number *</label>
              <input type="text" className="form-control" value={formData.route_number} onChange={(e) => setFormData({...formData, route_number: e.target.value})} required />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Route Name *</label>
              <input type="text" className="form-control" value={formData.route_name} onChange={(e) => setFormData({...formData, route_name: e.target.value})} required placeholder="e.g. Central Station to Tech Park" />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Starting Point *</label>
              <input type="text" className="form-control" value={formData.starting_point} onChange={(e) => setFormData({...formData, starting_point: e.target.value})} required />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Destination *</label>
              <input type="text" className="form-control" value={formData.destination} onChange={(e) => setFormData({...formData, destination: e.target.value})} required />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold">Distance *</label>
              <input type="text" className="form-control" value={formData.distance} onChange={(e) => setFormData({...formData, distance: e.target.value})} required placeholder="25 km" />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold">Estimated Time *</label>
              <input type="text" className="form-control" value={formData.estimated_time} onChange={(e) => setFormData({...formData, estimated_time: e.target.value})} required placeholder="45 mins" />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold">Status</label>
              <select className="form-select" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="text-end border-top pt-3 mt-4">
            <button type="button" className="btn btn-secondary me-2" onClick={() => setShowModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary-custom">Save Route</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminRoutes;
