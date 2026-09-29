import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaIdCard, FaQrcode, FaTrash } from 'react-icons/fa';
import { passService } from '../../services/passService';
import StatusBadge from '../../components/common/StatusBadge';
import Pagination from '../../components/common/Pagination';
import Modal from '../../components/common/Modal';
import DigitalBusPass from '../../components/pass/DigitalBusPass';
import { formatDate } from '../../utils/formatters';

const AdminPasses = () => {
  const [passes, setPasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const [selectedPass, setSelectedPass] = useState(null);
  const [showPassModal, setShowPassModal] = useState(false);

  useEffect(() => {
    fetchPasses();
  }, [currentPage, pageSize, statusFilter]);

  const fetchPasses = async () => {
    setLoading(true);
    try {
      const params = { page: currentPage, page_size: pageSize };
      if (statusFilter) params.status = statusFilter;
      if (searchTerm) params.search = searchTerm;

      const res = await passService.getAll(params);
      if (res.data.results) {
        setPasses(res.data.results);
        setTotalCount(res.data.count || 0);
      } else {
        setPasses(res.data || []);
        setTotalCount((res.data || []).length);
      }
    } catch (err) {
      console.error('Error fetching bus passes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchPasses();
  };

  const handleDelete = async (passId) => {
    if (!window.confirm('Delete this pass record?')) return;
    try {
      await passService.delete(passId);
      fetchPasses();
    } catch (err) {
      alert('Failed to delete pass record.');
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="font-heading fw-bold text-dark mb-1">Issued Bus Passes</h3>
          <p className="text-muted small mb-0">Manage active digital bus passes, validity dates, and QR credentials.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="app-card p-3 mb-4 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="row g-2 align-items-center">
          <div className="col-md-5">
            <div className="input-group">
              <span className="input-group-text bg-white text-muted"><FaSearch /></span>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Search by Pass Number, Applicant Name..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="col-md-4">
            <div className="input-group">
              <span className="input-group-text bg-white text-muted"><FaFilter /></span>
              <select 
                className="form-select" 
                value={statusFilter} 
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              >
                <option value="">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Expired">Expired</option>
                <option value="Suspended">Suspended</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="col-md-3 text-end">
            <button type="submit" className="btn btn-primary-custom w-100">
              Apply Filters
            </button>
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="app-card shadow-sm overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-dark">
              <tr>
                <th>Pass Number</th>
                <th>Commuter</th>
                <th>Pass Type</th>
                <th>Route</th>
                <th>Issue Date</th>
                <th>Expiry Date</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-4">Loading passes...</td>
                </tr>
              ) : passes.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-muted">No bus passes found.</td>
                </tr>
              ) : (
                passes.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <strong className="font-mono text-primary">{p.pass_number}</strong>
                    </td>
                    <td>
                      <div className="fw-semibold text-dark">{p.application?.applicant?.name}</div>
                      <small className="text-muted">{p.application?.applicant?.phone}</small>
                    </td>
                    <td><span className="badge bg-light text-dark border">{p.pass_type?.name}</span></td>
                    <td><small className="fw-semibold">{p.route?.route_number}</small></td>
                    <td><small>{formatDate(p.issue_date)}</small></td>
                    <td><small className="text-danger fw-semibold">{formatDate(p.expiry_date)}</small></td>
                    <td><StatusBadge status={p.status} /></td>
                    <td className="text-end">
                      <div className="btn-group btn-group-sm">
                        <button 
                          className="btn btn-outline-primary"
                          title="View Digital Pass"
                          onClick={() => { setSelectedPass(p); setShowPassModal(true); }}
                        >
                          <FaIdCard /> View Card
                        </button>
                        <button 
                          className="btn btn-outline-danger"
                          title="Delete Pass"
                          onClick={() => handleDelete(p.id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-3 pb-2">
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
            pageSize={pageSize}
            onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
          />
        </div>
      </div>

      {/* Digital Pass Card Modal */}
      {selectedPass && (
        <Modal
          isOpen={showPassModal}
          onClose={() => setShowPassModal(false)}
          title={`Digital Bus Pass — ${selectedPass.pass_number}`}
        >
          <DigitalBusPass busPass={selectedPass} />
        </Modal>
      )}
    </div>
  );
};

export default AdminPasses;
