import React, { useState } from 'react';
import { Search, RefreshCw, AlertCircle, CheckCircle2, Copy, Calendar, CreditCard, User } from 'lucide-react';
import { passService } from '../services/passService';
import { renewalService } from '../services/renewalService';
import { formatDate, formatCurrency } from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';

const RenewPass = () => {
  const [passNumber, setPassNumber] = useState('');
  const [passData, setPassData] = useState(null);
  const [loadingPass, setLoadingPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [remarks, setRemarks] = useState('');
  const [renewalSuccess, setRenewalSuccess] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleLookupPass = async (e) => {
    e.preventDefault();
    if (!passNumber.trim()) return;
    setLoadingPass(true);
    setErrorMsg('');
    setPassData(null);
    setRenewalSuccess(null);

    try {
      const res = await passService.getByPassNumber(passNumber.trim());
      const passes = res.data?.data || [];
      if (passes.length > 0) {
        setPassData(passes[0]);
      } else {
        setErrorMsg(`Pass Number '${passNumber}' not found. Please verify and try again.`);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Error looking up pass details.');
    } finally {
      setLoadingPass(false);
    }
  };

  const handleSubmitRenewal = async (e) => {
    e.preventDefault();
    if (!passData) return;
    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await renewalService.create({
        pass_number: passData.pass_number,
        requested_duration: passData.pass_type_details?.duration_days || 30,
        remarks: remarks,
      });

      setRenewalSuccess(res.data?.data);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit renewal request.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyRenId = () => {
    if (renewalSuccess?.renewal_id) {
      navigator.clipboard.writeText(renewalSuccess.renewal_id);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="text-center mb-4">
            <h2 className="fw-bold text-dark">Bus Pass Renewal</h2>
            <p className="text-muted">Enter your existing Pass Number to request an extension of your commute pass.</p>
          </div>

          {/* Lookup Form */}
          <div className="custom-card p-4 mb-4 shadow-sm">
            <form onSubmit={handleLookupPass} className="d-flex gap-2">
              <div className="input-group input-group-lg">
                <span className="input-group-text bg-light text-muted border-end-0">
                  <RefreshCw size={20} />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 font-monospace text-uppercase fw-semibold"
                  placeholder="Enter Existing Pass Number (PASS-XXXXXX)"
                  value={passNumber}
                  onChange={(e) => setPassNumber(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-warning px-4 fw-semibold text-dark rounded-3 d-flex align-items-center gap-2">
                <Search size={18} />
                <span>Lookup</span>
              </button>
            </form>
          </div>

          {loadingPass && <LoadingSpinner text="Fetching pass details..." />}

          {errorMsg && (
            <div className="alert alert-danger d-flex align-items-center gap-2 shadow-sm mb-4">
              <AlertCircle size={20} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Renewal Success Box */}
          {renewalSuccess ? (
            <div className="custom-card p-5 text-center shadow-lg border-success border-2">
              <div className="bg-success text-white p-3 rounded-circle d-inline-flex mb-3">
                <CheckCircle2 size={48} />
              </div>
              <h3 className="fw-bold text-dark mb-2">Renewal Request Submitted!</h3>
              <p className="text-muted">Your renewal request has been placed with status <strong>Pending</strong> for approval.</p>

              <div className="bg-light p-4 rounded-3 border my-4 d-inline-block text-start mw-100" style={{ width: '450px' }}>
                <span className="text-muted small d-block">Generated Renewal ID:</span>
                <div className="d-flex justify-content-between align-items-center mt-2">
                  <h4 className="fw-bold text-warning font-monospace mb-0">{renewalSuccess.renewal_id}</h4>
                  <button className="btn btn-outline-warning text-dark btn-sm d-flex align-items-center gap-1" onClick={handleCopyRenId}>
                    <Copy size={16} />
                    <span>{copied ? 'Copied!' : 'Copy Renewal ID'}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : passData && !loadingPass ? (
            /* Pass Details & Renewal Form */
            <div className="custom-card p-4 p-md-5 shadow-lg">
              <h4 className="fw-bold text-dark mb-3 border-bottom pb-2">Pass Renewal Summary</h4>

              <div className="row g-3 mb-4 bg-light p-3 rounded-3">
                <div className="col-md-6">
                  <span className="text-muted small d-block">Applicant Name</span>
                  <strong className="text-dark fs-6"><User size={16} className="me-1" />{passData.applicant_name}</strong>
                </div>
                <div className="col-md-6">
                  <span className="text-muted small d-block">Pass Number</span>
                  <strong className="text-warning font-monospace fs-6">{passData.pass_number}</strong>
                </div>
                <div className="col-md-6">
                  <span className="text-muted small d-block">Current Pass Type</span>
                  <strong className="text-dark"><CreditCard size={16} className="me-1" />{passData.pass_type_name}</strong>
                </div>
                <div className="col-md-6">
                  <span className="text-muted small d-block">Current Expiry Date</span>
                  <strong className="text-danger"><Calendar size={16} className="me-1" />{formatDate(passData.expiry_date)}</strong>
                </div>
                <div className="col-md-6">
                  <span className="text-muted small d-block">Renewal Extension Duration</span>
                  <span className="badge bg-primary text-white fs-7">{passData.pass_type_details?.duration_days || 30} Days</span>
                </div>
                <div className="col-md-6">
                  <span className="text-muted small d-block">Renewal Fee</span>
                  <strong className="text-success fs-5">{formatCurrency(passData.pass_type_details?.price || 50)}</strong>
                </div>
              </div>

              <form onSubmit={handleSubmitRenewal}>
                <div className="mb-4">
                  <label className="form-label fw-semibold">Remarks or Special Request (Optional)</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Enter any additional notes for renewal processing..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn btn-warning text-dark btn-lg w-100 rounded-pill fw-bold py-3 d-flex align-items-center justify-content-center gap-2 shadow"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      <span>Submitting Request...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw size={20} />
                      <span>Submit Renewal Request</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default RenewPass;
