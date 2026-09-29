import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaRedo, FaSearch, FaCheckCircle, FaExclamationTriangle, FaCopy, FaArrowRight } from 'react-icons/fa';
import { passService } from '../../services/passService';
import { renewalService } from '../../services/renewalService';
import { formatDate, formatCurrency } from '../../utils/formatters';
import Modal from '../../components/common/Modal';

const RenewPass = () => {
  const [passNumberInput, setPassNumberInput] = useState('');
  const [passData, setPassData] = useState(null);
  const [loadingPass, setLoadingPass] = useState(false);
  const [passError, setPassError] = useState('');

  const [requestedDuration, setRequestedDuration] = useState(30);
  const [remarks, setRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const [createdRenewalId, setCreatedRenewalId] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleLookup = async (e) => {
    e.preventDefault();
    if (!passNumberInput.trim()) return;

    setLoadingPass(true);
    setPassError('');
    setPassData(null);

    try {
      const res = await passService.lookup(passNumberInput.trim());
      if (res.data.success) {
        setPassData(res.data.data);
      } else {
        setPassError(res.data.message || 'Pass not found');
      }
    } catch (err) {
      setPassError(err.response?.data?.message || `No bus pass found matching "${passNumberInput}"`);
    } finally {
      setLoadingPass(false);
    }
  };

  const calculateFee = () => {
    if (!passData || !passData.pass_type) return 0;
    const basePrice = parseFloat(passData.pass_type.price || 0);
    const baseDays = parseInt(passData.pass_type.duration_days || 30);
    const ratio = requestedDuration / baseDays;
    return Math.round(basePrice * ratio);
  };

  const handleRenewalSubmit = async (e) => {
    e.preventDefault();
    if (!passData) return;

    setSubmitting(true);
    setSubmitError('');

    try {
      const payload = {
        bus_pass: passData.id,
        pass_number: passData.pass_number,
        requested_duration: parseInt(requestedDuration),
        renewal_fee: calculateFee(),
        remarks: remarks || 'Pass renewal request'
      };

      const res = await renewalService.create(payload);
      setCreatedRenewalId(res.data.renewal_id || res.data.data?.renewal_id || 'REN-SUCCESS');
      setShowSuccessModal(true);
    } catch (err) {
      const errRes = err.response?.data;
      setSubmitError(errRes?.message || 'Failed to submit renewal request.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(createdRenewalId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container py-5">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-4">
          <span className="badge bg-warning-light text-warning font-heading fw-bold px-3 py-2 rounded-pill mb-2">
            Validity Extension
          </span>
          <h2 className="font-heading fw-bold text-dark mb-1">Renew Bus Pass</h2>
          <p className="text-muted">Enter your existing Pass Number (e.g. PASS-200001) to submit a renewal request.</p>
        </div>

        {/* Step 1: Lookup Pass */}
        <div className="app-card p-4 shadow-sm mb-4">
          <h5 className="font-heading fw-bold text-primary mb-3">1. Retrieve Existing Pass</h5>
          <form onSubmit={handleLookup} className="row g-2">
            <div className="col">
              <div className="input-group input-group-lg">
                <span className="input-group-text bg-white text-muted"><FaSearch /></span>
                <input 
                  type="text" 
                  className="form-control font-mono fs-6" 
                  placeholder="Enter Existing Pass Number (e.g. PASS-200001)..."
                  value={passNumberInput}
                  onChange={(e) => setPassNumberInput(e.target.value)}
                  required 
                />
              </div>
            </div>
            <div className="col-auto">
              <button type="submit" className="btn btn-primary-custom btn-lg px-4 h-100" disabled={loadingPass}>
                {loadingPass ? 'Searching...' : 'Find Pass'}
              </button>
            </div>
          </form>

          {passError && (
            <div className="alert alert-danger mt-3 mb-0 p-3 rounded-3">
              <FaExclamationTriangle className="me-2" /> {passError}
            </div>
          )}
        </div>

        {/* Step 2: Renewal Form */}
        {passData && (
          <form onSubmit={handleRenewalSubmit} className="app-card p-4 p-md-5 shadow-lg border-primary">
            <h5 className="font-heading fw-bold text-primary mb-4 pb-2 border-bottom">
              2. Confirm Pass & Select Renewal Duration
            </h5>

            {submitError && (
              <div className="alert alert-danger mb-4 p-3 rounded-3">
                <FaExclamationTriangle className="me-2" /> {submitError}
              </div>
            )}

            <div className="row g-3 mb-4 bg-light p-3 rounded-3 border">
              <div className="col-md-6">
                <small className="text-muted d-block">Applicant Name</small>
                <strong className="text-dark fs-6">{passData.application?.applicant?.name}</strong>
              </div>

              <div className="col-md-6">
                <small className="text-muted d-block">Existing Pass Number</small>
                <strong className="text-primary font-mono fs-6">{passData.pass_number}</strong>
              </div>

              <div className="col-md-6">
                <small className="text-muted d-block">Current Pass Type</small>
                <strong className="text-dark fs-6">{passData.pass_type?.name}</strong>
              </div>

              <div className="col-md-6">
                <small className="text-muted d-block">Route</small>
                <strong className="text-dark fs-6">{passData.route?.route_number} ({passData.route?.starting_point} &rarr; {passData.route?.destination})</strong>
              </div>

              <div className="col-md-6">
                <small className="text-muted d-block">Current Expiry Date</small>
                <strong className="text-danger fs-6">{formatDate(passData.expiry_date)}</strong>
              </div>

              <div className="col-md-6">
                <small className="text-muted d-block">Current Pass Status</small>
                <span className={`badge ${passData.status === 'Active' ? 'bg-success' : 'bg-danger'}`}>{passData.status}</span>
              </div>
            </div>

            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Select Renewal Duration *</label>
                <select 
                  className="form-select"
                  value={requestedDuration}
                  onChange={(e) => setRequestedDuration(Number(e.target.value))}
                >
                  <option value={7}>7 Days (Weekly)</option>
                  <option value={30}>30 Days (Monthly)</option>
                  <option value={90}>90 Days (Quarterly)</option>
                  <option value={365}>365 Days (Annual)</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Calculated Renewal Fee</label>
                <div className="form-control bg-light font-heading fw-bold fs-5 text-success">
                  {formatCurrency(calculateFee())}
                </div>
              </div>

              <div className="col-12">
                <label className="form-label fw-semibold">Remarks / Additional Notes</label>
                <textarea 
                  className="form-control" 
                  rows="2" 
                  placeholder="Optional note for admin..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                ></textarea>
              </div>
            </div>

            <div className="text-end border-top pt-3">
              <button type="submit" className="btn btn-warning btn-lg fw-bold px-5 text-dark" disabled={submitting}>
                {submitting ? 'Submitting Renewal...' : 'Submit Renewal Request'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Renewal Request Submitted"
        footerButtons={
          <>
            <button className="btn btn-outline-secondary" onClick={() => setShowSuccessModal(false)}>Close</button>
            <Link to="/admin/renewals" className="btn btn-primary-custom">
              View Admin Renewals Panel <FaArrowRight />
            </Link>
          </>
        }
      >
        <div className="text-center py-3">
          <div className="bg-warning-light text-warning p-3 rounded-circle d-inline-flex mb-3">
            <FaCheckCircle size={48} />
          </div>
          <h4 className="font-heading fw-bold text-dark mb-2">Renewal Request Generated</h4>
          <p className="text-muted">Your renewal request has been registered with status <span className="badge bg-warning text-dark">Pending</span>.</p>

          <div className="bg-light p-3 rounded-3 border my-3 text-center">
            <small className="text-muted text-uppercase d-block mb-1 font-heading">Renewal Reference ID</small>
            <div className="d-flex align-items-center justify-content-center gap-2">
              <h3 className="font-mono text-warning fw-bold mb-0">{createdRenewalId}</h3>
              <button className="btn btn-sm btn-outline-warning text-dark ms-2" onClick={handleCopy}>
                <FaCopy /> {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
          <small className="text-muted">Once approved by administration, your pass validity date will automatically update.</small>
        </div>
      </Modal>
    </div>
  );
};

export default RenewPass;
