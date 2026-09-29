import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, List } from 'lucide-react';
import { routeService } from '../../services/routeService';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';

const BusStopManagement = () => {
  const [stops, setStops] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRouteId, setSelectedRouteId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingStop, setEditingStop] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    route: '',
    stop_name: '',
    location: '',
    sequence_number: 1,
    status: 'Active',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [stopsRes, routesRes] = await Promise.all([
        routeService.getAllStops({ route_id: selectedRouteId || undefined }),
        routeService.getAllRoutes(),
      ]);
      setStops(stopsRes.data?.data || []);
      setRoutes(routesRes.data?.data || []);
      if (routesRes.data?.data?.length > 0 && !formData.route) {
        setFormData((prev) => ({ ...prev, route: routesRes.data.data[0].id }));
      }
    } catch (err) {
      setErrorMsg('Failed to load bus stops.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedRouteId]);

  const handleOpenAdd = () => {
    setEditingStop(null);
    setFormData({
      route: routes[0]?.id || '',
      stop_name: '',
      location: '',
      sequence_number: stops.length + 1,
      status: 'Active',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (st) => {
    setEditingStop(st);
    setFormData({
      route: st.route,
      stop_name: st.stop_name,
      location: st.location,
      sequence_number: st.sequence_number,
      status: st.status,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStop) {
        await routeService.updateStop(editingStop.id, formData);
        setSuccessMsg(`Bus Stop ${formData.stop_name} updated.`);
      } else {
        await routeService.createStop(formData);
        setSuccessMsg(`Bus Stop ${formData.stop_name} added.`);
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      setErrorMsg(err.message || 'Error saving bus stop.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete bus stop?')) return;
    try {
      await routeService.deleteStop(id);
      setSuccessMsg('Bus stop deleted.');
      fetchData();
    } catch (err) {
      setErrorMsg('Error deleting bus stop.');
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-1">Bus Stop Management</h3>
          <p className="text-muted mb-0">Configure sequence numbers, stop names, and locations for route pick-up points.</p>
        </div>
        <button className="btn btn-primary rounded-pill px-4 d-flex align-items-center gap-2" onClick={handleOpenAdd}>
          <Plus size={18} />
          <span>Add Bus Stop</span>
        </button>
      </div>

      {successMsg && <div className="alert alert-success">{successMsg}</div>}
      {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

      <div className="custom-card p-3 mb-4 shadow-sm">
        <div className="row align-items-center">
          <div className="col-md-6">
            <label className="form-label small fw-semibold">Filter by Route:</label>
            <select className="form-select" value={selectedRouteId} onChange={(e) => setSelectedRouteId(e.target.value)}>
              <option value="">All Routes</option>
              {routes.map((r) => (
                <option key={r.id} value={r.id}>
                  Route #{r.route_number}: {r.route_name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="custom-card shadow-sm overflow-hidden">
        {loading ? (
          <LoadingSpinner text="Loading bus stops..." />
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th>Seq #</th>
                  <th>Stop Name</th>
                  <th>Route</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {stops.map((st) => (
                  <tr key={st.id}>
                    <td><span className="badge bg-secondary font-monospace">#{st.sequence_number}</span></td>
                    <td><strong className="text-dark">{st.stop_name}</strong></td>
                    <td><span className="badge bg-primary bg-opacity-10 text-primary">Route #{st.route_number}</span></td>
                    <td>{st.location}</td>
                    <td><StatusBadge status={st.status} /></td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleOpenEdit(st)}>
                        <Edit2 size={16} />
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(st.id)}>
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
                  <h5 className="modal-title fw-bold">{editingStop ? 'Edit Bus Stop' : 'Add Bus Stop'}</h5>
                  <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body p-4 row g-3">
                  <div className="col-12">
                    <label className="form-label fw-semibold">Belongs to Route *</label>
                    <select className="form-select" value={formData.route} onChange={(e) => setFormData({ ...formData, route: e.target.value })} required>
                      {routes.map((r) => (
                        <option key={r.id} value={r.id}>
                          Route #{r.route_number}: {r.route_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-8">
                    <label className="form-label fw-semibold">Stop Name *</label>
                    <input type="text" className="form-control" value={formData.stop_name} onChange={(e) => setFormData({ ...formData, stop_name: e.target.value })} required />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Seq Number *</label>
                    <input type="number" className="form-control" value={formData.sequence_number} onChange={(e) => setFormData({ ...formData, sequence_number: e.target.value })} required />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">Location / Address *</label>
                    <input type="text" className="form-control" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} required />
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
                  <button type="submit" className="btn btn-primary rounded-pill px-4">Save Bus Stop</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusStopManagement;
