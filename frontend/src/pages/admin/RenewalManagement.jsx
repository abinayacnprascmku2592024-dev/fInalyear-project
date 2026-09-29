import React, { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle, XCircle, Search, Filter } from 'lucide-react';
import { renewalService } from '../../services/renewalService';
import StatusBadge from '../../components/StatusBadge';
import { formatDate, formatCurrency } from '../../utils/helpers';
import LoadingSpinner from '../../components/LoadingSpinner';

const RenewalManagement = () => {
  const [renewals, setRenewals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchRenewals = async () => {
    setLoading(true);
    try {
      const res = await renewalService.getAll({
        search: search,
        status: statusFilter !== 'All' ? statusFilter : undefined,
      });
      setRenewals(res.data?.data || []);
    } catch (err) {
      setErrorMsg('Failed to load renewals list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRenewals();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchRenewals();
  };

  const handleApprove = async (id) => {
    setActionLoading(true);
    try {
      const res = await renewalService.approve(id);
      setSuccessMsg(res.data?.message || 'Renewal approved successfully.');
      fetchRenewals();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to approve renewal.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt('Enter rejection remarks for this renewal request:');
    if (reason === null) return;

    setActionLoading(true);
    try {
      const res = await renewalService.reject(id, reason);
      setSuccessMsg(res.data?.message || 'Renewal request rejected.');
      fetchRenewals();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to reject renewal.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-1">Pass Renewal Requests</h3>
          <p className="text-muted mb-0">Approve or reject bus pass validity extension requests.</p>
        </div>
      </div>

      {successMsg && <div className="alert alert-success">{successMsg}</div>}
      {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

      <div className="custom-card p-3 mb-4 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="row g-2 align-items-center">
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-light text-muted">
                <Search size={18} />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search renewal ID, pass number, applicant name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="col-md-4">
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Renewal Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="col-md-2">
            <button type="submit" className="btn btn-primary w-100 fw-semibold">Search</button>
          </div>
        </form>
      </div>

      <div className="custom-card shadow-sm overflow-hidden">
        {loading ? (
          <LoadingSpinner text="Loading renewal requests..." />
        ) : renewals.length === 0 ? (
          <div className="text-center py-5 text-muted">No renewal requests found matching criteria.</div>
        ) : (
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
                {renewals.map((ren) => (
                  <tr key={ren.id}>
                    <td><strong className="text-warning font-monospace">{ren.renewal_id}</strong></td>
                    <td><span className="font-monospace text-primary fw-semibold">{ren.pass_number}</span></td>
                    <td>{ren.applicant_name}</td>
                    <td>{formatDate(ren.current_expiry)}</td>
                    <td><span className="badge bg-primary bg-opacity-10 text-primary">{ren.requested_duration} Days</span></td>
                    <td><strong className="text-success">{formatCurrency(ren.renewal_fee)}</strong></td>
                    <td>{formatDate(ren.request_date)}</td>
                    <td><StatusBadge status={ren.status} /></td>
                    <td className="text-end">
                      {ren.status === 'Pending' && (
                        <div className="d-flex justify-content-end gap-1">
                          <button
                            className="btn btn-sm btn-success d-flex align-items-center gap-1"
                            disabled={actionLoading}
                            onClick={() => handleApprove(ren.id)}
                          >
                            <CheckCircle size={15} />
                            <span>Approve</span>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            disabled={actionLoading}
                            onClick={() => handleReject(ren.id)}
                          >
                            <XCircle size={15} />
                            <span>Reject</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RenewalManagement;
