import React, { useState, useEffect } from 'react';
import {
  Search,
  CheckCircle,
  XCircle,
  ShieldCheck,
  Eye,
  Trash2,
  AlertCircle,
  Filter,
  User,
  Calendar,
  CreditCard,
  MapPin,
  FileText
} from 'lucide-react';
import { applicationService } from '../../services/applicationService';
import StatusBadge from '../../components/StatusBadge';
import { formatDate } from '../../utils/helpers';
import LoadingSpinner from '../../components/LoadingSpinner';

const ApplicationManagement = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modals
  const [selectedApp, setSelectedApp] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const fetchApplications = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await applicationService.getAll({
        search: search,
        status: statusFilter !== 'All' ? statusFilter : undefined,
      });
      setApplications(res.data?.data || []);
    } catch (err) {
      setErrorMsg('Failed to load applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchApplications();
  };

  const handleApprove = async (id) => {
    setActionLoading(true);
    try {
      const res = await applicationService.approve(id);
      setSuccessMsg(`Application approved successfully.`);
      fetchApplications();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to approve application.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenRejectModal = (app) => {
    setSelectedApp(app);
    setRejectionReason('');
    setShowRejectModal(true);
  };

  const handleConfirmReject = async () => {
    if (!rejectionReason.trim()) return;
    setActionLoading(true);
    try {
      await applicationService.reject(selectedApp.id, rejectionReason.trim());
      setSuccessMsg(`Application ${selectedApp.application_id} rejected.`);
      setShowRejectModal(false);
      fetchApplications();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to reject application.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleIssuePass = async (id) => {
    setActionLoading(true);
    try {
      const res = await applicationService.issuePass(id);
      setSuccessMsg(`Bus pass ${res.data?.data?.pass_number} issued successfully!`);
      fetchApplications();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to issue bus pass.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this application record?')) return;
    try {
      await applicationService.delete(id);
      setSuccessMsg('Application deleted successfully.');
      fetchApplications();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to delete application.');
    }
  };

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = applications.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(applications.length / recordsPerPage);

  return (
    <div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-1">Application Management</h3>
          <p className="text-muted mb-0">Review applicant submissions, approve/reject requests, and issue digital bus passes.</p>
        </div>
      </div>

      {successMsg && (
        <div className="alert alert-success alert-dismissible fade show shadow-sm mb-4" role="alert">
          {successMsg}
          <button type="button" className="btn-close" onClick={() => setSuccessMsg('')}></button>
        </div>
      )}

      {errorMsg && (
        <div className="alert alert-danger alert-dismissible fade show shadow-sm mb-4" role="alert">
          {errorMsg}
          <button type="button" className="btn-close" onClick={() => setErrorMsg('')}></button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="custom-card p-3 mb-4 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="row g-2 align-items-center">
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-light text-muted border-end-0">
                <Search size={18} />
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search by APP ID, applicant name, phone, or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="col-md-4">
            <div className="input-group">
              <span className="input-group-text bg-light text-muted">
                <Filter size={18} />
              </span>
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Issued">Issued</option>
                <option value="Rejected">Rejected</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="col-md-2">
            <button type="submit" className="btn btn-primary w-100 fw-semibold">
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Data Table */}
      <div className="custom-card shadow-sm overflow-hidden mb-4">
        {loading ? (
          <LoadingSpinner text="Loading applications..." />
        ) : currentRecords.length === 0 ? (
          <div className="text-center py-5 text-muted">No application records found matching filters.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th>Application ID</th>
                  <th>Applicant</th>
                  <th>Phone</th>
                  <th>Pass Type</th>
                  <th>Route</th>
                  <th>Applied On</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.map((app) => (
                  <tr key={app.id}>
                    <td>
                      <span className="fw-bold font-monospace text-primary">{app.application_id}</span>
                    </td>
                    <td>
                      <div className="fw-semibold text-dark">{app.applicant_name}</div>
                      <small className="text-muted">{app.applicant_email}</small>
                    </td>
                    <td>{app.applicant_phone}</td>
                    <td>
                      <span className="badge bg-light text-dark border">{app.pass_type_name}</span>
                    </td>
                    <td>
                      <span className="small">Route #{app.route_number}</span>
                    </td>
                    <td>{formatDate(app.application_date)}</td>
                    <td>
                      <StatusBadge status={app.status} />
                    </td>
                    <td>
                      <div className="d-flex justify-content-end gap-1">
                        {/* View Action */}
                        <button
                          className="btn btn-sm btn-outline-info"
                          title="View Details"
                          onClick={() => {
                            setSelectedApp(app);
                            setShowViewModal(true);
                          }}
                        >
                          <Eye size={16} />
                        </button>

                        {/* Approve Action */}
                        {app.status === 'Pending' && (
                          <button
                            className="btn btn-sm btn-success d-flex align-items-center gap-1"
                            title="Approve Application"
                            disabled={actionLoading}
                            onClick={() => handleApprove(app.id)}
                          >
                            <CheckCircle size={15} />
                            <span>Approve</span>
                          </button>
                        )}

                        {/* Issue Pass Action */}
                        {app.status === 'Approved' && (
                          <button
                            className="btn btn-sm btn-primary d-flex align-items-center gap-1"
                            title="Issue Bus Pass"
                            disabled={actionLoading}
                            onClick={() => handleIssuePass(app.id)}
                          >
                            <ShieldCheck size={15} />
                            <span>Issue Pass</span>
                          </button>
                        )}

                        {/* Reject Action */}
                        {(app.status === 'Pending' || app.status === 'Approved') && (
                          <button
                            className="btn btn-sm btn-outline-danger"
                            title="Reject Application"
                            onClick={() => handleOpenRejectModal(app)}
                          >
                            <XCircle size={16} />
                          </button>
                        )}

                        {/* Delete Action */}
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          title="Delete Record"
                          onClick={() => handleDelete(app.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-between align-items-center p-3 border-top bg-light">
            <span className="small text-muted">
              Showing page {currentPage} of {totalPages} ({applications.length} records total)
            </span>
            <div className="d-flex gap-1">
              <button
                className="btn btn-sm btn-outline-secondary"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                <button
                  key={pg}
                  className={`btn btn-sm ${pg === currentPage ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setCurrentPage(pg)}
                >
                  {pg}
                </button>
              ))}
              <button
                className="btn btn-sm btn-outline-secondary"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* View Details Modal */}
      {showViewModal && selectedApp && (
        <div className="modal show d-block backdrop-blur bg-dark bg-opacity-50" tabIndex="-1">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content shadow-lg border-0">
              <div className="modal-header bg-dark text-white">
                <h5 className="modal-title fw-bold">Application #{selectedApp.application_id}</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowViewModal(false)}></button>
              </div>
              <div className="modal-body p-4">
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <span className="text-muted small d-block">Applicant Name</span>
                    <strong className="text-dark fs-5">{selectedApp.applicant_name}</strong>
                  </div>
                  <div className="col-md-6 text-md-end">
                    <span className="text-muted small d-block mb-1">Status</span>
                    <StatusBadge status={selectedApp.status} />
                  </div>

                  <div className="col-md-6">
                    <span className="text-muted small d-block">Email</span>
                    <span>{selectedApp.applicant_email}</span>
                  </div>
                  <div className="col-md-6">
                    <span className="text-muted small d-block">Phone</span>
                    <span>{selectedApp.applicant_phone}</span>
                  </div>

                  <div className="col-md-6">
                    <span className="text-muted small d-block">Organization / College</span>
                    <span>{selectedApp.applicant_details?.organization}</span>
                  </div>
                  <div className="col-md-6">
                    <span className="text-muted small d-block">ID Roll Number</span>
                    <span>{selectedApp.applicant_details?.id_number}</span>
                  </div>

                  <div className="col-md-6">
                    <span className="text-muted small d-block">Pass Type Selected</span>
                    <strong className="text-primary">{selectedApp.pass_type_name} (${selectedApp.pass_type_price})</strong>
                  </div>
                  <div className="col-md-6">
                    <span className="text-muted small d-block">Bus Route</span>
                    <span>Route #{selectedApp.route_number}: {selectedApp.route_name}</span>
                  </div>

                  <div className="col-md-6">
                    <span className="text-muted small d-block">Source & Destination</span>
                    <span>{selectedApp.source_stop_name || 'Terminal'} ➔ {selectedApp.destination_stop_name || 'Terminal'}</span>
                  </div>
                  <div className="col-md-6">
                    <span className="text-muted small d-block">Start Date Requested</span>
                    <span>{formatDate(selectedApp.start_date)}</span>
                  </div>

                  {selectedApp.rejection_reason && (
                    <div className="col-12">
                      <div className="alert alert-danger mb-0">
                        <strong>Rejection Reason:</strong> {selectedApp.rejection_reason}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary rounded-pill" onClick={() => setShowViewModal(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedApp && (
        <div className="modal show d-block backdrop-blur bg-dark bg-opacity-50" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow-lg border-0">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title fw-bold">Reject Application #{selectedApp.application_id}</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowRejectModal(false)}></button>
              </div>
              <div className="modal-body p-4">
                <p className="text-muted">Please provide a valid rejection reason to notify the applicant.</p>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Rejection Reason *</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="e.g. Invalid student ID document provided."
                    required
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary rounded-pill" onClick={() => setShowRejectModal(false)}>Cancel</button>
                <button
                  type="button"
                  className="btn btn-danger rounded-pill px-4"
                  disabled={!rejectionReason.trim() || actionLoading}
                  onClick={handleConfirmReject}
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationManagement;
