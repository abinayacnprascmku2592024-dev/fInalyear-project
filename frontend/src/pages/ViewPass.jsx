import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, AlertCircle, ShieldCheck } from 'lucide-react';
import { passService } from '../services/passService';
import DigitalPassCard from '../components/DigitalPassCard';
import LoadingSpinner from '../components/LoadingSpinner';

const ViewPass = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [passNumber, setPassNumber] = useState(searchParams.get('pass_number') || '');
  const [passData, setPassData] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchPass = async (numToQuery) => {
    if (!numToQuery || !numToQuery.trim()) return;
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await passService.verifyPass(numToQuery.trim());
      if (res.data?.success) {
        setVerificationResult(res.data.data);
        setPassData(res.data.data.pass);
      } else {
        setPassData(null);
        setErrorMsg('Pass not found or invalid.');
      }
    } catch (err) {
      setPassData(null);
      setErrorMsg(err.message || `No active bus pass found for Pass Number '${numToQuery}'.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialNum = searchParams.get('pass_number');
    if (initialNum) {
      setPassNumber(initialNum);
      fetchPass(initialNum);
    }
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (passNumber.trim()) {
      setSearchParams({ pass_number: passNumber.trim() });
      fetchPass(passNumber.trim());
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="text-center mb-4">
            <h2 className="fw-bold text-dark">Digital Bus Pass Portal</h2>
            <p className="text-muted">Enter your Pass Number (e.g. PASS-123456) to display digital card & verify authenticity.</p>
          </div>

          {/* Search Bar */}
          <div className="custom-card p-4 mb-5 shadow-sm">
            <form onSubmit={handleSearch} className="d-flex gap-2">
              <div className="input-group input-group-lg">
                <span className="input-group-text bg-light text-muted border-end-0">
                  <ShieldCheck size={20} />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 font-monospace text-uppercase fw-semibold"
                  placeholder="Enter Pass Number (PASS-XXXXXX)"
                  value={passNumber}
                  onChange={(e) => setPassNumber(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary px-4 fw-semibold rounded-3 d-flex align-items-center gap-2">
                <Search size={18} />
                <span>Search</span>
              </button>
            </form>
          </div>

          {loading && <LoadingSpinner text="Verifying pass credentials..." />}

          {errorMsg && (
            <div className="alert alert-danger d-flex align-items-center gap-2 shadow-sm mb-4">
              <AlertCircle size={20} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Pass Preview */}
          {passData && !loading && (
            <div>
              {verificationResult && (
                <div className={`alert ${verificationResult.is_valid ? 'alert-success' : 'alert-warning'} d-flex align-items-center justify-content-between mb-4 shadow-sm`}>
                  <div>
                    <strong>Verification Status:</strong> {verificationResult.verification_status}
                  </div>
                  <small className="text-muted">QR Code Identifier Validated</small>
                </div>
              )}
              <DigitalPassCard passData={passData} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewPass;
