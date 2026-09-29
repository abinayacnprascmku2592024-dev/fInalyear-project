import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FaSearch, FaIdCard, FaCheckCircle, FaExclamationCircle, FaPrint } from 'react-icons/fa';
import { applicationService } from '../../services/applicationService';
import StatusBadge from '../../components/common/StatusBadge';
import { formatDate } from '../../utils/formatters';

const ApplicationStatus = () => {
  const [searchParams] = useSearchParams();
  const initialAppId = searchParams.get('app_id') || '';

  const [appIdInput, setAppIdInput] = useState(initialAppId);
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (initialAppId) {
      handleSearch(initialAppId);
    }
  }, [initialAppId]);

  const handleSearch = async (idToSearch) => {
    const targetId = idToSearch || appIdInput.trim();
    if (!targetId) return;

    setLoading(true);
    setErrorMsg('');
    setSearched(true);
    setApplication(null);

    try {
      const res = await applicationService.checkStatus(targetId);
      if (res.data.success) {
        setApplication(res.data.data);
      } else {
        setErrorMsg(res.data.message || 'No application found');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || `No application found matching ID "${targetId}"`);
    } finally {
      setLoading(false);
    }
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
    handleSearch(appIdInput);
  };

  return (
    <div className="container py-5">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-4">
          <span className="badge bg-primary-light text-primary font-heading fw-bold px-3 py-2 rounded-pill mb-2">
            Status Tracker
          </span>
          <h2 className="font-heading fw-bold text-dark mb-1">Check Application Status</h2>
          <p className="text-muted">Enter your unique Application ID (e.g. APP-100001) to view status.</p>
        </div>

        {/* Search Bar */}
        <div className="app-card p-4 shadow-sm mb-4">
          <form onSubmit={onFormSubmit} className="row g-2">
            <div className="col">
              <div className="input-group input-group-lg">
                <span className="input-group-text bg-white text-muted"><FaSearch /></span>
                <input 
                  type="text" 
                  className="form-control font-mono fs-6" 
                  placeholder="Enter Application ID (e.g. APP-100001)..."
                  value={appIdInput}
                  onChange={(e) => setAppIdInput(e.target.value)}
                  required 
                />
              </div>
            </div>
            <div className="col-auto">
              <button type="submit" className="btn btn-primary-custom btn-lg px-4 h-100" disabled={loading}>
                {loading ? 'Searching...' : 'Check Status'}
              </button>
            </div>
          </form>
        </div>

        {/* Error State */}
        {errorMsg && (
          <div className="alert alert-warning text-center p-4 shadow-sm rounded-3">
            <FaExclamationCircle size={36} className="mb-2 text-warning" />
            <h5 className="font-heading fw-bold mb-1">Application Not Found</h5>
            <p className="mb-0 text-muted">{errorMsg}</p>
          </div>
        )}

        {/* Application Details Card */}
        {application && (
          <div className="app-card p-4 p-md-5 shadow-lg border-primary position-relative overflow-hidden">
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center border-bottom pb-3 mb-4 gap-2">
              <div>
                <small className="text-muted text-uppercase fw-bold font-mono">Application Reference</small>
                <h3 className="font-mono fw-bold text-primary mb-0">{application.application_id}</h3>
              </div>
              <div>
                <StatusBadge status={application.status} />
              </div>
            </div>

            {/* Rejection Alert if applicable */}
            {application.status === 'Rejected' && application.rejection_reason && (
              <div className="alert alert-danger mb-4 p-3 rounded-3">
                <h6 className="font-heading fw-bold text-danger mb-1">Rejection Reason:</h6>
                <p className="mb-0 small">{application.rejection_reason}</p>
              </div>
            )}

            {/* Details Grid */}
            <div className="row g-3 text-secondary">
              <div className="col-md-6">
                <small className="text-muted d-block">Applicant Name</small>
                <strong className="text-dark fs-6">{application.applicant?.name}</strong>
              </div>

              <div className="col-md-6">
                <small className="text-muted d-block">Application Date</small>
                <strong className="text-dark fs-6">{formatDate(application.application_date || application.created_at)}</strong>
              </div>

              <div className="col-md-6">
                <small className="text-muted d-block">Pass Category</small>
                <strong className="text-dark fs-6">{application.pass_type?.name}</strong>
              </div>

              <div className="col-md-6">
                <small className="text-muted d-block">Bus Route</small>
                <strong className="text-dark fs-6">{application.route?.route_number} — {application.route?.route_name}</strong>
              </div>

              <div className="col-md-6">
                <small className="text-muted d-block">Source Bus Stop</small>
                <strong className="text-dark fs-6">{application.source_stop?.stop_name}</strong>
              </div>

              <div className="col-md-6">
                <small className="text-muted d-block">Destination Bus Stop</small>
                <strong className="text-dark fs-6">{application.destination_stop?.stop_name}</strong>
              </div>

              <div className="col-md-6">
                <small className="text-muted d-block">Requested Start Date</small>
                <strong className="text-dark fs-6">{formatDate(application.start_date)}</strong>
              </div>

              <div className="col-md-6">
                <small className="text-muted d-block">Validity Duration</small>
                <strong className="text-dark fs-6">{application.duration_days} Days</strong>
              </div>
            </div>

            {/* Footer Action if Pass Issued */}
            {application.status === 'Issued' && (
              <div className="bg-success-light p-3 rounded-3 border border-success mt-4 d-flex flex-column flex-sm-row align-items-center justify-content-between gap-3">
                <div className="d-flex align-items-center gap-2 text-success">
                  <FaCheckCircle size={24} />
                  <div>
                    <strong className="d-block">Bus Pass Issued & Ready</strong>
                    <small className="text-muted">You can view and print your digital bus pass now.</small>
                  </div>
                </div>
                <Link to="/view-pass" className="btn btn-success fw-bold px-4 py-2 text-nowrap">
                  View Digital Pass &rarr;
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationStatus;
