import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaSearch, FaIdCard, FaExclamationCircle, FaShieldAlt, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { passService } from '../../services/passService';
import DigitalBusPass from '../../components/pass/DigitalBusPass';

const ViewPass = () => {
  const [searchParams] = useSearchParams();
  const initialPassNum = searchParams.get('pass_number') || 'PASS-200001';

  const [passNumInput, setPassNumInput] = useState(initialPassNum);
  const [busPass, setBusPass] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);

  useEffect(() => {
    if (initialPassNum) {
      handleSearch(initialPassNum);
    }
  }, [initialPassNum]);

  const handleSearch = async (numToSearch) => {
    const targetNum = numToSearch || passNumInput.trim();
    if (!targetNum) return;

    setLoading(true);
    setErrorMsg('');
    setBusPass(null);
    setVerificationResult(null);

    try {
      const res = await passService.lookup(targetNum);
      if (res.data.success) {
        setBusPass(res.data.data);
      } else {
        setErrorMsg(res.data.message || 'Pass not found');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || `No bus pass found matching number "${targetNum}"`);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!passNumInput.trim()) return;
    try {
      const res = await passService.verify(passNumInput.trim());
      setVerificationResult(res.data);
    } catch (err) {
      setVerificationResult(err.response?.data || { valid: false, message: 'Verification failed' });
    }
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
    handleSearch(passNumInput);
  };

  return (
    <div className="container py-5">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-4">
          <span className="badge bg-primary-light text-primary font-heading fw-bold px-3 py-2 rounded-pill mb-2">
            Digital Transit Card
          </span>
          <h2 className="font-heading fw-bold text-dark mb-1">View & Print Bus Pass</h2>
          <p className="text-muted">Enter your Pass Number (e.g. PASS-200001) to view digital pass card.</p>
        </div>

        {/* Pass Lookup Input */}
        <div className="app-card p-4 shadow-sm mb-4">
          <form onSubmit={onFormSubmit} className="row g-2">
            <div className="col">
              <div className="input-group input-group-lg">
                <span className="input-group-text bg-white text-muted"><FaIdCard /></span>
                <input 
                  type="text" 
                  className="form-control font-mono fs-6" 
                  placeholder="Enter Pass Number (e.g. PASS-200001)..."
                  value={passNumInput}
                  onChange={(e) => setPassNumInput(e.target.value)}
                  required 
                />
              </div>
            </div>
            <div className="col-auto d-flex gap-2">
              <button type="submit" className="btn btn-primary-custom btn-lg px-4 h-100" disabled={loading}>
                {loading ? 'Retrieving...' : 'View Pass'}
              </button>
              <button type="button" className="btn btn-outline-success btn-lg px-3 h-100 d-flex align-items-center gap-1" onClick={handleVerify}>
                <FaShieldAlt /> Verify
              </button>
            </div>
          </form>

          {/* Verification Banner */}
          {verificationResult && (
            <div className={`alert mt-3 mb-0 d-flex align-items-center gap-2 ${verificationResult.valid ? 'alert-success' : 'alert-danger'}`}>
              {verificationResult.valid ? <FaCheckCircle size={20} /> : <FaTimesCircle size={20} />}
              <div>
                <strong>{verificationResult.message}</strong> — Pass Status: <span className="text-uppercase fw-bold">{verificationResult.status || 'INVALID'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Error State */}
        {errorMsg && (
          <div className="alert alert-warning text-center p-4 shadow-sm rounded-3">
            <FaExclamationCircle size={36} className="mb-2 text-warning" />
            <h5 className="font-heading fw-bold mb-1">Pass Record Not Found</h5>
            <p className="mb-0 text-muted">{errorMsg}</p>
          </div>
        )}

        {/* Digital Bus Pass Card View */}
        {busPass && (
          <div className="py-3">
            <DigitalBusPass busPass={busPass} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewPass;
