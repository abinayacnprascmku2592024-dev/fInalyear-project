import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, MapPin } from 'lucide-react';
import { routeService } from '../../services/routeService';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';

const RouteManagement = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    route_number: '',
    route_name: '',
    starting_point: '',
    destination: '',
    distance: 10,
    estimated_time: '30 mins',
    status: 'Active',
  });

  const fetchRoutes = async () => {
    setLoading(true);
    try {
      const res = await routeService.getAllRoutes();
      setRoutes(res.data?.data || []);
    } catch (err) {
      setErrorMsg('Failed to load routes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const handleOpenAdd = () => {
    setEditingRoute(null);
    setFormData({
      route_number: '',
      route_name: '',
      starting_point: '',
      destination: '',
      distance: 10,
      estimated_time: '30 mins',
      status: 'Active',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (r) => {
    setEditingRoute(r);
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
      if (editingRoute) {
        await routeService.updateRoute(editingRoute.id, formData);
        setSuccessMsg(`Route ${formData.route_number} updated.`);
      } else {
        await routeService.createRoute(formData);
        setSuccessMsg(`Route ${formData.route_number} created.`);
      }
      setShowModal(false);
      fetchRoutes();
    } catch (err) {
      setErrorMsg(err.message || 'Error saving route.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete route?')) return;
    try {
      await routeService.deleteRoute(id);
      setSuccessMsg('Route deleted.');
      fetchRoutes();
    } catch (err) {
      setErrorMsg('Error deleting route.');
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-1">Route Management</h3>
          <p className="text-muted mb-0">Define transit corridors, distances, estimated duration, and operational routes.</p>
        </div>
        <button className="btn btn-primary rounded-pill px-4 d-flex align-items-center gap-2" onClick={handleOpenAdd}>
          <Plus size={18} />
          <span>Add New Route</span>
        </button>
      </div>

      {successMsg && <div className="alert alert-success">{successMsg}</div>}
      {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

      <div className="custom-card shadow-sm overflow-hidden">
        {loading ? (
          <LoadingSpinner text="Loading routes..." />
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th>Route No</th>
                  <th>Route Name</th>
                  <th>Starting Point</th>
                  <th>Destination</th>
                  <th>Distance</th>
                  <th>Est Time</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {routes.map((r) => (
                  <tr key={r.id}>
                    <td><strong className="text-primary font-monospace">{r.route_number}</strong></td>
                    <td><span className="fw-semibold text-dark">{r.route_name}</span></td>
                    <td>{r.starting_point}</td>
                    <td>{r.destination}</td>
                    <td>{r.distance} km</td>
                    <td>{r.estimated_time}</td>
                    <td><StatusBadge status={r.status} /></td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleOpenEdit(r)}>
                        <Edit2 size={16} />
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(r.id)}>
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

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block backdrop-blur bg-dark bg-opacity-50" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <form onSubmit={handleSubmit}>
                <div className="modal-header bg-dark text-white">
                  <h5 className="modal-title fw-bold">{editingRoute ? 'Edit Route' : 'Add New Route'}</h5>
                  <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body p-4 row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Route Number *</label>
                    <input type="text" className="form-control" value={formData.route_number} onChange={(e) => setFormData({ ...formData, route_number: e.target.value })} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Route Name *</label>
                    <input type="text" className="form-control" value={formData.route_name} onChange={(e) => setFormData({ ...formData, route_name: e.target.value })} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Starting Point *</label>
                    <input type="text" className="form-control" value={formData.starting_point} onChange={(e) => setFormData({ ...formData, starting_point: e.target.value })} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Destination *</label>
                    <input type="text" className="form-control" value={formData.destination} onChange={(e) => setFormData({ ...formData, destination: e.target.value })} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Distance (km) *</label>
                    <input type="number" step="0.1" className="form-control" value={formData.distance} onChange={(e) => setFormData({ ...formData, distance: e.target.value })} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Estimated Time *</label>
                    <input type="text" className="form-control" value={formData.estimated_time} onChange={(e) => setFormData({ ...formData, estimated_time: e.target.value })} required />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">Status *</label>
                    <select className="form-select" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary rounded-pill" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary rounded-pill px-4">Save Route</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RouteManagement;
