import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Layers } from 'lucide-react';
import { passTypeService } from '../../services/passService';
import StatusBadge from '../../components/StatusBadge';
import { formatCurrency } from '../../utils/helpers';
import LoadingSpinner from '../../components/LoadingSpinner';

const PassTypeManagement = () => {
  const [passTypes, setPassTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPt, setEditingPt] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration_days: 30,
    price: 50.0,
    status: 'Active',
  });

  const fetchPassTypes = async () => {
    setLoading(true);
    try {
      const res = await passTypeService.getAll();
      setPassTypes(res.data?.data || []);
    } catch (err) {
      setErrorMsg('Failed to load pass types.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPassTypes();
  }, []);

  const handleOpenAdd = () => {
    setEditingPt(null);
    setFormData({
      name: '',
      description: '',
      duration_days: 30,
      price: 50.0,
      status: 'Active',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (pt) => {
    setEditingPt(pt);
    setFormData({
      name: pt.name,
      description: pt.description,
      duration_days: pt.duration_days,
      price: pt.price,
      status: pt.status,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPt) {
        await passTypeService.update(editingPt.id, formData);
        setSuccessMsg(`Pass type ${formData.name} updated.`);
      } else {
        await passTypeService.create(formData);
        setSuccessMsg(`Pass type ${formData.name} created.`);
      }
      setShowModal(false);
      fetchPassTypes();
    } catch (err) {
      setErrorMsg(err.message || 'Error saving pass type.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this pass type?')) return;
    try {
      await passTypeService.delete(id);
      setSuccessMsg('Pass type deleted.');
      fetchPassTypes();
    } catch (err) {
      setErrorMsg('Error deleting pass type.');
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-1">Pass Type Management</h3>
          <p className="text-muted mb-0">Configure pass categories, validity duration days, prices, and status.</p>
        </div>
        <button className="btn btn-primary rounded-pill px-4 d-flex align-items-center gap-2" onClick={handleOpenAdd}>
          <Plus size={18} />
          <span>Add Pass Type</span>
        </button>
      </div>

      {successMsg && <div className="alert alert-success">{successMsg}</div>}
      {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

      <div className="custom-card shadow-sm overflow-hidden">
        {loading ? (
          <LoadingSpinner text="Loading pass types..." />
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th>Pass Name</th>
                  <th>Description</th>
                  <th>Duration</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {passTypes.map((pt) => (
                  <tr key={pt.id}>
                    <td><strong className="text-dark">{pt.name}</strong></td>
                    <td className="text-muted small" style={{ maxWidth: '300px' }}>{pt.description}</td>
                    <td><span className="badge bg-primary bg-opacity-10 text-primary">{pt.duration_days} Days</span></td>
                    <td><strong className="text-success">{formatCurrency(pt.price)}</strong></td>
                    <td><StatusBadge status={pt.status} /></td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleOpenEdit(pt)}>
                        <Edit2 size={16} />
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(pt.id)}>
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
                  <h5 className="modal-title fw-bold">{editingPt ? 'Edit Pass Type' : 'Add Pass Type'}</h5>
                  <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body p-4 row g-3">
                  <div className="col-12">
                    <label className="form-label fw-semibold">Pass Type Name *</label>
                    <input type="text" className="form-control" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">Description *</label>
                    <textarea className="form-control" rows="2" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required></textarea>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Duration (Days) *</label>
                    <input type="number" className="form-control" value={formData.duration_days} onChange={(e) => setFormData({ ...formData, duration_days: e.target.value })} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Price ($) *</label>
                    <input type="number" step="0.01" className="form-control" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
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
                  <button type="submit" className="btn btn-primary rounded-pill px-4">Save Pass Type</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PassTypeManagement;
