import React, { useState, useEffect } from 'react';
import { FaSearch, FaCheck, FaTimes, FaRedo, FaFilter } from 'react-icons/fa';
import { renewalService } from '../../services/renewalService';
import StatusBadge from '../../components/common/StatusBadge';
import Pagination from '../../components/common/Pagination';
import Modal from '../../components/common/Modal';
import { formatDate, formatCurrency } from '../../utils/formatters';

const AdminRenewals = () => {
  const [renewals, setRenewals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const [selectedRen, setSelectedRen] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchRenewals();
  }, [currentPage, pageSize, statusFilter]);

  const fetchRenewals = async () => {
    setLoading(true);
    try {
      const params = { page: currentPage, page_size: pageSize };
      if (statusFilter) params.status = statusFilter;
      if (searchTerm) params.search = searchTerm;

      const res = await renewalService.getAll(params);
      if (res.data.results) {
        setRenewals(res.data.results);
        setTotalCount(res.data.count || 0);
      } else {
        setRenewals(res.data || []);
        setTotalCount((res.data || []).length);
      }
    } catch (err) {
      console.error('Error fetching renewals:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setActionLoading(true);
    try {
      const res = await renewalService.approve(id);
      alert(res.data.message || 'Renewal approved! Expiry updated.');
      fetchRenewals();
    } catch (err) {
      alert('Failed to approve renewal.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectSubmit = async () => {
    if (!selectedRen) return;
    setActionLoading(true);
    try {
      await renewalService.reject(selectedRen.id, rejectReason);
      setShowRejectModal(false);
      fetchRenewals();
    } catch (err) {
      alert('Failed to reject renewal.');
    } finally {
      setActionLoading(false);
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="font-heading fw-bold text-dark mb-1">Pass Renewal Requests</h3>
          <p className="text-muted small mb-0">Approve or reject pass extension requests and collect renewal fees.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="app-card p-3 mb-4 shadow-sm">
        <form className="row g-2 align-items-center" onSubmit={(e) => { e.preventDefault(); setCurrentPage(1); fetchRenewals(); }}>
          <div className="col-md-5">
            <div className="input-group">
              <span className="input-group-text bg-white text-muted"><FaSearch /></span>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Search by Renewal ID, Pass Number, Applicant..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="input-group">
              <span className="input-group-text bg-white text-muted"><FaFilter /></span>
              <select className="form-select" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}>
                <option value="">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
          <div className="col-md-3">
            <button type="submit" className="btn btn-primary-custom w-100">Filter Requests</button>
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="app-card shadow-sm overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-dark">
              <tr>
                <th>Renewal ID</th>
                <th>Pass Number</th>
                <th>Applicant</th>
                <th>Current Expiry</th>
                <th>Duration</th>
                <th>Fee</th>
                <th>Request Date</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" className="text-center py-4">Loading renewal requests...</td>
                </tr>
              ) : renewals.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-4 text-muted">No renewal requests found.</td>
                </tr>
              ) : (
                renewals.map((r) => (
                  <tr key={r.id}>
                    <td><strong className="font-mono text-warning">{r.renewal_id}</strong></td>
                    <td><span className="font-mono fw-bold text-primary">{r.bus_pass?.pass_number}</span></td>
                    <td>
                      <div className="fw-semibold">{r.bus_pass?.application?.applicant?.name}</div>
                    </td>
                    <td><small className="text-danger">{formatDate(r.bus_pass?.expiry_date)}</small></td>
                    <td><small>{r.requested_duration} Days</small></td>
                    <td><strong className="text-success">{formatCurrency(r.renewal_fee)}</strong></td>
                    <td><small>{formatDate(r.request_date || r.created_at)}</small></td>
                    <td><StatusBadge status={r.status} /></td>
                    <td className="text-end">
                      {r.status === 'Pending' ? (
                        <div className="btn-group btn-group-sm">
                          <button 
                            className="btn btn-success"
                            title="Approve Renewal"
                            onClick={() => handleApprove(r.id)}
                            disabled={actionLoading}
                          >
                            <FaCheck /> Approve
                          </button>
                          <button 
                            className="btn btn-danger"
                            title="Reject Renewal"
                            onClick={() => { setSelectedRen(r); setRejectReason('Renewal fee not confirmed'); setShowRejectModal(true); }}
                            disabled={actionLoading}
                          >
                            <FaTimes /> Reject
                          </button>
                        </div>
                      ) : (
                        <small className="text-muted">Processed</small>
                      )}
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

      {/* Reject Modal */}
      <Modal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        title="Reject Renewal Request"
        footerButtons={
          <>
            <button className="btn btn-secondary" onClick={() => setShowRejectModal(false)}>Cancel</button>
            <button className="btn btn-danger" onClick={handleRejectSubmit} disabled={actionLoading}>
              Confirm Rejection
            </button>
          </>
        }
      >
        <div className="py-2">
          <p className="text-muted">Reason for rejecting Renewal <strong>{selectedRen?.renewal_id}</strong>:</p>
          <textarea 
            className="form-control" 
            rows="3" 
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          ></textarea>
        </div>
      </Modal>
    </div>
  );
};

export default AdminRenewals;
