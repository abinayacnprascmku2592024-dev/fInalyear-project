import React, { useState, useEffect } from 'react';
import { 
  FaSearch, FaCheck, FaTimes, FaIdCard, FaTrash, 
  FaEye, FaFilter, FaExclamationTriangle 
} from 'react-icons/fa';
import { applicationService } from '../../services/applicationService';
import StatusBadge from '../../components/common/StatusBadge';
import Pagination from '../../components/common/Pagination';
import Modal from '../../components/common/Modal';
import { formatDate } from '../../utils/formatters';

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  // Selected item & Modals
  const [selectedApp, setSelectedApp] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');

  useEffect(() => {
    fetchApplications();
  }, [currentPage, pageSize, statusFilter]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        page_size: pageSize,
      };
      if (statusFilter) params.status = statusFilter;
      if (searchTerm) params.search = searchTerm;

      const res = await applicationService.getAll(params);
      if (res.data.results) {
        setApplications(res.data.results);
        setTotalCount(res.data.count || 0);
      } else {
        setApplications(res.data || []);
        setTotalCount((res.data || []).length);
      }
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchApplications();
  };

  const handleApprove = async (appId) => {
    setActionLoading(true);
    try {
      await applicationService.approve(appId);
      setAlertMsg('Application approved successfully!');
      fetchApplications();
    } catch (err) {
      alert('Failed to approve application.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenRejectModal = (app) => {
    setSelectedApp(app);
    setRejectionReason('Documents provided do not match records.');
    setShowRejectModal(true);
  };

  const handleRejectSubmit = async () => {
    if (!selectedApp) return;
    setActionLoading(true);
    try {
      await applicationService.reject(selectedApp.id, rejectionReason);
      setShowRejectModal(false);
      setAlertMsg('Application rejected.');
      fetchApplications();
    } catch (err) {
      alert('Failed to reject application.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleIssuePass = async (appId) => {
    setActionLoading(true);
    try {
      const res = await applicationService.issuePass(appId);
      alert(res.data.message || 'Pass issued successfully!');
      fetchApplications();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to issue pass.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (appId) => {
    if (!window.confirm('Are you sure you want to delete this application record?')) return;
    try {
      await applicationService.delete(appId);
      fetchApplications();
    } catch (err) {
      alert('Failed to delete application.');
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="font-heading fw-bold text-dark mb-1">Application Management</h3>
          <p className="text-muted small mb-0">Review, approve, reject, and issue passes for incoming applications.</p>
        </div>
      </div>

      {alertMsg && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {alertMsg}
          <button type="button" className="btn-close" onClick={() => setAlertMsg('')}></button>
        </div>
      )}

      {/* Search & Status Filters */}
      <div className="app-card p-3 mb-4 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="row g-2 align-items-center">
          <div className="col-md-5">
            <div className="input-group">
              <span className="input-group-text bg-white text-muted"><FaSearch /></span>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Search by App ID, Name, Phone, Email..." 
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
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Issued">Issued</option>
                <option value="Rejected">Rejected</option>
                <option value="Expired">Expired</option>
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

      {/* Applications Data Table */}
      <div className="app-card shadow-sm overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-dark">
              <tr>
                <th>App ID</th>
                <th>Applicant</th>
                <th>Phone</th>
                <th>Pass Type</th>
                <th>Route</th>
                <th>App Date</th>
                <th>Start Date</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" className="text-center py-4">
                    <div className="spinner-border text-primary spinner-border-sm me-2" role="status"></div>
                    Loading application records...
                  </td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-4 text-muted">No applications found matching query.</td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app.id}>
                    <td>
                      <strong className="font-mono text-primary">{app.application_id}</strong>
                    </td>
                    <td>
                      <div className="fw-semibold text-dark">{app.applicant?.name}</div>
                      <small className="text-muted">{app.applicant?.email}</small>
                    </td>
                    <td>{app.applicant?.phone}</td>
                    <td>
                      <span className="badge bg-light text-dark border">{app.pass_type?.name}</span>
                    </td>
                    <td>
                      <small className="fw-semibold">{app.route?.route_number}</small>
                    </td>
                    <td><small>{formatDate(app.application_date || app.created_at)}</small></td>
                    <td><small>{formatDate(app.start_date)}</small></td>
                    <td><StatusBadge status={app.status} /></td>
                    <td className="text-end">
                      <div className="btn-group btn-group-sm">
                        <button 
                          className="btn btn-outline-secondary" 
                          title="View Details"
                          onClick={() => { setSelectedApp(app); setShowViewModal(true); }}
                        >
                          <FaEye />
                        </button>
                        {app.status === 'Pending' && (
                          <>
                            <button 
                              className="btn btn-success" 
                              title="Approve Application"
                              onClick={() => handleApprove(app.id)}
                            >
                              <FaCheck />
                            </button>
                            <button 
                              className="btn btn-danger" 
                              title="Reject Application"
                              onClick={() => handleOpenRejectModal(app)}
                            >
                              <FaTimes />
                            </button>
                          </>
                        )}
                        {(app.status === 'Approved' || app.status === 'Pending') && (
                          <button 
                            className="btn btn-primary" 
                            title="Issue Bus Pass"
                            onClick={() => handleIssuePass(app.id)}
                          >
                            <FaIdCard /> Pass
                          </button>
                        )}
                        <button 
                          className="btn btn-outline-danger" 
                          title="Delete Record"
                          onClick={() => handleDelete(app.id)}
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

      {/* View Modal */}
      {selectedApp && (
        <Modal
          isOpen={showViewModal}
          onClose={() => setShowViewModal(false)}
          title={`Application Details — ${selectedApp.application_id}`}
        >
          <div className="row g-3">
            <div className="col-md-6">
              <small className="text-muted d-block">Applicant Name</small>
              <strong>{selectedApp.applicant?.name}</strong>
            </div>
            <div className="col-md-6">
              <small className="text-muted d-block">Status</small>
              <StatusBadge status={selectedApp.status} />
            </div>
            <div className="col-md-6">
              <small className="text-muted d-block">DOB & Gender</small>
              <span>{formatDate(selectedApp.applicant?.date_of_birth)} ({selectedApp.applicant?.gender})</span>
            </div>
            <div className="col-md-6">
              <small className="text-muted d-block">Phone & Email</small>
              <span>{selectedApp.applicant?.phone} | {selectedApp.applicant?.email}</span>
            </div>
            <div className="col-12">
              <small className="text-muted d-block">Address</small>
              <span>{selectedApp.applicant?.address}, {selectedApp.applicant?.city}, {selectedApp.applicant?.state} - {selectedApp.applicant?.pincode}</span>
            </div>
            <div className="col-md-6">
              <small className="text-muted d-block">Organization & ID</small>
              <span>{selectedApp.applicant?.organization} ({selectedApp.applicant?.id_number})</span>
            </div>
            <div className="col-md-6">
              <small className="text-muted d-block">Pass Type Category</small>
              <strong>{selectedApp.pass_type?.name} (₹{selectedApp.pass_type?.price})</strong>
            </div>
            <div className="col-md-6">
              <small className="text-muted d-block">Route & Segment</small>
              <span>{selectedApp.route?.route_number} ({selectedApp.source_stop?.stop_name} &rarr; {selectedApp.destination_stop?.stop_name})</span>
            </div>
            <div className="col-md-6">
              <small className="text-muted d-block">Requested Start Date</small>
              <span>{formatDate(selectedApp.start_date)} ({selectedApp.duration_days} Days)</span>
            </div>
            {selectedApp.rejection_reason && (
              <div className="col-12 text-danger">
                <small className="d-block fw-bold">Rejection Reason:</small>
                <span>{selectedApp.rejection_reason}</span>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Reject Modal */}
      <Modal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        title="Reject Application"
        footerButtons={
          <>
            <button className="btn btn-secondary" onClick={() => setShowRejectModal(false)}>Cancel</button>
            <button className="btn btn-danger" onClick={handleRejectSubmit} disabled={actionLoading}>
              {actionLoading ? 'Rejecting...' : 'Confirm Rejection'}
            </button>
          </>
        }
      >
        <div className="py-2">
          <p className="text-muted">Please specify the official reason for rejecting Application <strong>{selectedApp?.application_id}</strong>:</p>
          <textarea 
            className="form-control" 
            rows="3" 
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            required
            placeholder="e.g. Invalid document proof provided or address out of city coverage..."
          ></textarea>
        </div>
      </Modal>
    </div>
  );
};

export default AdminApplications;
