import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaPlus, FaEdit, FaTrash, FaSearch, FaFilter } from 'react-icons/fa';
import { routeService } from '../../services/routeService';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';

const AdminBusStops = () => {
  const [stops, setStops] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRouteFilter, setSelectedRouteFilter] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [formData, setFormData] = useState({
    route: '',
    stop_name: '',
    location: '',
    sequence_number: 1,
    status: 'Active',
  });

  useEffect(() => {
    fetchInitial();
  }, [selectedRouteFilter]);

  const fetchInitial = async () => {
    setLoading(true);
    try {
      const [rRes, stRes] = await Promise.all([
        routeService.getAll(),
        routeService.getStops(selectedRouteFilter ? { route_id: selectedRouteFilter } : {})
      ]);
      const rts = rRes.data.results || rRes.data || [];
      const stp = stRes.data.results || stRes.data || [];
      setRoutes(rts);
      setStops(stp);

      if (rts.length > 0 && !formData.route) {
        setFormData(prev => ({ ...prev, route: rts[0].id }));
      }
    } catch (err) {
      console.error('Error fetching stops/routes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditMode(false);
    setSelectedId(null);
    setFormData({
      route: routes.length > 0 ? routes[0].id : '',
      stop_name: '',
      location: '',
      sequence_number: stops.length + 1,
      status: 'Active',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (st) => {
    setEditMode(true);
    setSelectedId(st.id);
    setFormData({
      route: st.route,
      stop_name: st.stop_name,
      location: st.location || '',
      sequence_number: st.sequence_number,
      status: st.status,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode && selectedId) {
        await routeService.updateStop(selectedId, formData);
      } else {
        await routeService.createStop(formData);
      }
      setShowModal(false);
      fetchInitial();
    } catch (err) {
      alert('Failed to save bus stop.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete bus stop?')) return;
    try {
      await routeService.deleteStop(id);
      fetchInitial();
    } catch (err) {
      alert('Failed to delete stop.');
    }
  };

  const filteredStops = stops.filter(st => 
    st.stop_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    st.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="font-heading fw-bold text-dark mb-1">Bus Stops Management</h3>
          <p className="text-muted small mb-0">Manage designated bus stops and sequence numbers assigned to routes.</p>
        </div>
        <button className="btn btn-primary-custom d-flex align-items-center gap-2" onClick={handleOpenAdd}>
          <FaPlus /> Add Bus Stop
        </button>
      </div>

      <div className="app-card p-3 mb-4 shadow-sm">
        <div className="row g-2">
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-white text-muted"><FaSearch /></span>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Search by stop name or location..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-white text-muted"><FaFilter /></span>
              <select 
                className="form-select"
                value={selectedRouteFilter}
                onChange={(e) => setSelectedRouteFilter(e.target.value)}
              >
                <option value="">All Routes</option>
                {routes.map(r => (
                  <option key={r.id} value={r.id}>{r.route_number}: {r.route_name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="app-card shadow-sm overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-dark">
              <tr>
                <th>Seq #</th>
                <th>Stop Name</th>
                <th>Route</th>
                <th>Location Details</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="text-center py-4">Loading stops...</td></tr>
              ) : filteredStops.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-4 text-muted">No bus stops found.</td></tr>
              ) : (
                filteredStops.map((st) => (
                  <tr key={st.id}>
                    <td><span className="badge bg-secondary font-mono">#{st.sequence_number}</span></td>
                    <td className="fw-bold text-dark">{st.stop_name}</td>
                    <td><span className="badge bg-light text-dark border font-mono">{st.route_number || st.route}</span></td>
                    <td><small className="text-muted">{st.location || 'N/A'}</small></td>
                    <td><StatusBadge status={st.status} /></td>
                    <td className="text-end">
                      <div className="btn-group btn-group-sm">
                        <button className="btn btn-outline-primary" onClick={() => handleOpenEdit(st)}><FaEdit /></button>
                        <button className="btn btn-outline-danger" onClick={() => handleDelete(st.id)}><FaTrash /></button>
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
        title={editMode ? 'Edit Bus Stop' : 'Add New Bus Stop'}
      >
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Assign to Route *</label>
              <select className="form-select" value={formData.route} onChange={(e) => setFormData({...formData, route: e.target.value})} required>
                {routes.map(r => (
                  <option key={r.id} value={r.id}>{r.route_number}: {r.route_name}</option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Stop Name *</label>
              <input type="text" className="form-control" value={formData.stop_name} onChange={(e) => setFormData({...formData, stop_name: e.target.value})} required placeholder="e.g. Market Yard Gate" />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Location Landmark</label>
              <input type="text" className="form-control" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} placeholder="Near Main Chowk..." />
            </div>
            <div className="col-md-3">
              <label className="form-label fw-semibold">Sequence Number</label>
              <input type="number" className="form-control" value={formData.sequence_number} onChange={(e) => setFormData({...formData, sequence_number: Number(e.target.value)})} required />
            </div>
            <div className="col-md-3">
              <label className="form-label fw-semibold">Status</label>
              <select className="form-select" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="text-end border-top pt-3 mt-4">
            <button type="button" className="btn btn-secondary me-2" onClick={() => setShowModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary-custom">Save Bus Stop</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminBusStops;
