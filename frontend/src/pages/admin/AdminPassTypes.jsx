import React, { useState, useEffect } from 'react';
import { FaTags, FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import { passTypeService } from '../../services/passTypeService';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import { formatCurrency } from '../../utils/formatters';

const AdminPassTypes = () => {
  const [passTypes, setPassTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration_days: 30,
    price: 500.00,
    status: 'Active',
  });

  useEffect(() => {
    fetchPassTypes();
  }, []);

  const fetchPassTypes = async () => {
    setLoading(true);
    try {
      const res = await passTypeService.getAll();
      setPassTypes(res.data.results || res.data || []);
    } catch (err) {
      console.error('Error fetching pass types:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditMode(false);
    setSelectedId(null);
    setFormData({
      name: '',
      description: '',
      duration_days: 30,
      price: 500.00,
      status: 'Active',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (pt) => {
    setEditMode(true);
    setSelectedId(pt.id);
    setFormData({
      name: pt.name,
      description: pt.description || '',
      duration_days: pt.duration_days,
      price: pt.price,
      status: pt.status,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode && selectedId) {
        await passTypeService.update(selectedId, formData);
      } else {
        await passTypeService.create(formData);
      }
      setShowModal(false);
      fetchPassTypes();
    } catch (err) {
      alert('Failed to save pass type.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete pass type category?')) return;
    try {
      await passTypeService.delete(id);
      fetchPassTypes();
    } catch (err) {
      alert('Failed to delete pass type.');
    }
  };

  const filteredPassTypes = passTypes.filter(pt => 
    pt.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pt.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="font-heading fw-bold text-dark mb-1">Pass Category & Pricing Management</h3>
          <p className="text-muted small mb-0">Configure pass durations, subscription pricing, and active categories.</p>
        </div>
        <button className="btn btn-primary-custom d-flex align-items-center gap-2" onClick={handleOpenAdd}>
          <FaPlus /> Add Pass Type
        </button>
      </div>

      <div className="app-card p-3 mb-4 shadow-sm">
        <div className="input-group">
          <span className="input-group-text bg-white text-muted"><FaSearch /></span>
          <input 
            type="text" 
            className="form-control" 
            placeholder="Search by pass type name or description..." 
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
                <th>Category Name</th>
                <th>Description</th>
                <th>Duration</th>
                <th>Price (₹)</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="text-center py-4">Loading pass categories...</td></tr>
              ) : filteredPassTypes.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-4 text-muted">No pass categories found.</td></tr>
              ) : (
                filteredPassTypes.map((pt) => (
                  <tr key={pt.id}>
                    <td><strong className="fw-bold text-dark">{pt.name}</strong></td>
                    <td><small className="text-muted">{pt.description}</small></td>
                    <td><span className="badge bg-light text-dark border font-mono">{pt.duration_days} Days</span></td>
                    <td><strong className="text-primary">{formatCurrency(pt.price)}</strong></td>
                    <td><StatusBadge status={pt.status} /></td>
                    <td className="text-end">
                      <div className="btn-group btn-group-sm">
                        <button className="btn btn-outline-primary" onClick={() => handleOpenEdit(pt)}><FaEdit /></button>
                        <button className="btn btn-outline-danger" onClick={() => handleDelete(pt.id)}><FaTrash /></button>
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
        title={editMode ? 'Edit Pass Category' : 'Add New Pass Category'}
      >
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Pass Type Name *</label>
              <input type="text" className="form-control" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required placeholder="e.g. Student Monthly Pass" />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Duration (Days) *</label>
              <input type="number" className="form-control" value={formData.duration_days} onChange={(e) => setFormData({...formData, duration_days: Number(e.target.value)})} required />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Price (INR ₹) *</label>
              <input type="number" step="0.01" className="form-control" value={formData.price} onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} required />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Category Status</label>
              <select className="form-select" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="col-12">
              <label className="form-label fw-semibold">Description</label>
              <textarea className="form-control" rows="2" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Pass benefits and rules..."></textarea>
            </div>
          </div>
          <div className="text-end border-top pt-3 mt-4">
            <button type="button" className="btn btn-secondary me-2" onClick={() => setShowModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary-custom">Save Category</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminPassTypes;
