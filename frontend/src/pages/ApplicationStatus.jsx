import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, AlertCircle, Clock, MapPin, User, Calendar, Shield, CreditCard } from 'lucide-react';
import { applicationService } from '../services/applicationService';
import StatusBadge from '../components/StatusBadge';
import { formatDate } from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';

const ApplicationStatus = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [appId, setAppId] = useState(searchParams.get('app_id') || '');
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [searched, setSearched] = useState(false);

  const fetchStatus = async (idToQuery) => {
    if (!idToQuery || !idToQuery.trim()) return;
    setLoading(true);
    setErrorMsg('');
    setSearched(true);

    try {
      const res = await applicationService.getByAppId(idToQuery.trim());
      const apps = res.data?.data || [];
      if (apps.length > 0) {
        setApplication(apps[0]);
      } else {
        setApplication(null);
        setErrorMsg(`No application found for Application ID '${idToQuery}'. Please check the ID and try again.`);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to fetch application status.');
      setApplication(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialId = searchParams.get('app_id');
    if (initialId) {
      setAppId(initialId);
      fetchStatus(initialId);
    }
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (appId.trim()) {
      setSearchParams({ app_id: appId.trim() });
      fetchStatus(appId.trim());
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="text-center mb-4">
            <h2 className="fw-bold text-dark">Check Application Status</h2>
            <p className="text-muted">Enter your Application ID (e.g. APP-123456) to check review and issuance status.</p>
          </div>

          {/* Search Form */}
          <div className="custom-card p-4 mb-4 shadow-sm">
            <form onSubmit={handleSearch} className="d-flex gap-2">
              <div className="input-group input-group-lg">
                <span className="input-group-text bg-light text-muted border-end-0">
                  <Search size={20} />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 font-monospace text-uppercase fw-semibold"
                  placeholder="Enter Application ID (APP-XXXXXX)"
                  value={appId}
                  onChange={(e) => setAppId(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary px-4 fw-semibold rounded-3 d-flex align-items-center gap-2">
                <span>Check</span>
              </button>
            </form>
          </div>

          {loading && <LoadingSpinner text="Fetching application status..." />}

          {errorMsg && (
            <div className="alert alert-danger d-flex align-items-center gap-2 shadow-sm">
              <AlertCircle size={20} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Result Card */}
          {application && !loading && (
            <div className="custom-card p-4 p-md-5 shadow-lg border-start border-primary border-4">
              <div className="d-flex justify-content-between align-items-start border-bottom pb-3 mb-4 flex-wrap gap-2">
                <div>
                  <span className="text-muted small">Application ID</span>
                  <h3 className="fw-bold text-primary font-monospace mb-0">{application.application_id}</h3>
                </div>
                <div className="text-end">
                  <span className="text-muted small d-block mb-1">Current Status</span>
                  <StatusBadge status={application.status} />
                </div>
              </div>

              {/* Status Banner */}
              {application.status === 'Approved' && (
                <div className="alert alert-info d-flex align-items-center justify-content-between mb-4">
                  <div className="d-flex align-items-center gap-2">
                    <Clock size={20} />
                    <span>Application approved! Bus pass will be issued by system admin shortly.</span>
                  </div>
                </div>
              )}

              {application.status === 'Issued' && application.bus_pass && (
                <div className="alert alert-success d-flex align-items-center justify-content-between mb-4">
                  <div className="d-flex align-items-center gap-2">
                    <Shield size={20} />
                    <span>Bus Pass Issued! Pass Number: <strong>{application.bus_pass.pass_number}</strong></span>
                  </div>
                  <Link to={`/view-pass?pass_number=${application.bus_pass.pass_number}`} className="btn btn-sm btn-success rounded-pill px-3">
                    View Bus Pass
                  </Link>
                </div>
              )}

              {application.status === 'Rejected' && application.rejection_reason && (
                <div className="alert alert-danger mb-4">
                  <h6 className="fw-bold mb-1">Application Rejected</h6>
                  <p className="mb-0 small"><strong>Reason:</strong> {application.rejection_reason}</p>
                </div>
              )}

              {/* Details Grid */}
              <div className="row g-4">
                <div className="col-md-6">
                  <div className="d-flex gap-3 align-items-start">
                    <div className="bg-light p-2 rounded-3 text-primary">
                      <User size={20} />
                    </div>
                    <div>
                      <small className="text-muted d-block">Applicant Name</small>
                      <strong className="text-dark fs-6">{application.applicant_name}</strong>
                      <small className="d-block text-muted">{application.applicant_email} | {application.applicant_phone}</small>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="d-flex gap-3 align-items-start">
                    <div className="bg-light p-2 rounded-3 text-primary">
                      <CreditCard size={20} />
                    </div>
                    <div>
                      <small className="text-muted d-block">Pass Type & Price</small>
                      <strong className="text-dark fs-6">{application.pass_type_name}</strong>
                      <small className="d-block text-muted">${application.pass_type_price} ({application.duration_days} Days validity)</small>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="d-flex gap-3 align-items-start">
                    <div className="bg-light p-2 rounded-3 text-primary">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <small className="text-muted d-block">Route Information</small>
                      <strong className="text-dark fs-6">Route #{application.route_number}: {application.route_name}</strong>
                      <small className="d-block text-muted">{application.source_stop_name || 'Terminal'} ➔ {application.destination_stop_name || 'Terminal'}</small>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="d-flex gap-3 align-items-start">
                    <div className="bg-light p-2 rounded-3 text-primary">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <small className="text-muted d-block">Dates</small>
                      <strong className="text-dark fs-6">Requested Start: {formatDate(application.start_date)}</strong>
                      <small className="d-block text-muted">Applied On: {formatDate(application.application_date)}</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationStatus;
