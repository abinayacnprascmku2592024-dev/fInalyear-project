import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { FaBus, FaPrint, FaDownload, FaCheckCircle, FaShieldAlt } from 'react-icons/fa';
import { formatDate } from '../../utils/formatters';
import StatusBadge from '../common/StatusBadge';

const DigitalBusPass = ({ busPass, onPrint }) => {
  const cardRef = useRef(null);

  if (!busPass) return null;

  const applicant = busPass.application?.applicant || {};
  const passType = busPass.pass_type || {};
  const route = busPass.route || {};
  const source = busPass.source_stop || {};
  const destination = busPass.destination_stop || {};

  const photoUrl = applicant.photo_url || applicant.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';
  const qrValue = `VERIFY-PASS:${busPass.pass_number}:${busPass.qr_identifier || 'VALID'}`;

  const handlePrintClick = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  return (
    <div className="w-100">
      <div ref={cardRef} className="bus-pass-card printable-area mx-auto my-3">
        {/* Pass Header */}
        <div className="bus-pass-header">
          <div className="d-flex align-items-center gap-2">
            <div className="bg-white text-primary p-2 rounded-circle d-flex align-items-center justify-content-center" style={{ width: 36, height: 36 }}>
              <FaBus size={20} />
            </div>
            <div>
              <h6 className="mb-0 text-white font-heading fw-bold tracking-tight">METRO TRANSPORT AUTHORITY</h6>
              <small className="text-blue-200 opacity-85 fs-8 text-uppercase">Official Digital Transit Pass</small>
            </div>
          </div>
          <div className="text-end">
            <span className="badge bg-white text-dark font-mono fw-bold fs-7 px-2 py-1 shadow-sm">
              {busPass.pass_number}
            </span>
          </div>
        </div>

        {/* Pass Body */}
        <div className="bus-pass-body position-relative">
          {/* Subtle Watermark */}
          <div className="position-absolute top-50 start-50 translate-middle opacity-10 text-white pointer-events-none">
            <FaBus size={180} />
          </div>

          <div className="row g-3 position-relative z-1 align-items-center">
            {/* Photo Column */}
            <div className="col-4 text-center">
              <img 
                src={photoUrl} 
                alt={applicant.name || 'Applicant'} 
                className="pass-photo-frame shadow-sm mb-2"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80';
                }}
              />
              <div className="d-block mt-1">
                <StatusBadge status={busPass.status} />
              </div>
            </div>

            {/* Details Column */}
            <div className="col-8">
              <div className="mb-2">
                <small className="text-muted text-uppercase fs-8 fw-semibold">Commuter Name</small>
                <h5 className="font-heading fw-bold text-white mb-0 text-truncate">{applicant.name || 'N/A'}</h5>
                <small className="text-info fs-8">{applicant.organization || 'Public Commuter'}</small>
              </div>

              <div className="row g-2 mb-2 bg-slate-800 p-2 rounded-3 border border-slate-700" style={{ backgroundColor: 'rgba(30, 41, 59, 0.7)' }}>
                <div className="col-6">
                  <small className="text-muted d-block fs-8">Route No.</small>
                  <span className="fw-bold text-warning fs-7">{route.route_number || 'N/A'}</span>
                </div>
                <div className="col-6">
                  <small className="text-muted d-block fs-8">Pass Category</small>
                  <span className="fw-bold text-white fs-7">{passType.name || 'Standard'}</span>
                </div>
                <div className="col-12">
                  <small className="text-muted d-block fs-8">Coverage Segment</small>
                  <span className="fw-semibold text-light fs-8 text-truncate d-block">
                    {source.stop_name || 'Origin'} &rarr; {destination.stop_name || 'Destination'}
                  </span>
                </div>
              </div>

              <div className="d-flex justify-content-between text-muted fs-8">
                <div>
                  <span>Issued: </span>
                  <strong className="text-white">{formatDate(busPass.issue_date)}</strong>
                </div>
                <div>
                  <span>Expires: </span>
                  <strong className="text-danger">{formatDate(busPass.expiry_date)}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Footer QR Section */}
          <div className="mt-3 pt-3 border-top border-slate-700 d-flex align-items-center justify-content-between" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
            <div className="d-flex align-items-center gap-2 text-success small">
              <FaShieldAlt size={16} />
              <span className="fs-8">Cryptographically Verified Digital Pass</span>
            </div>

            <div className="bg-white p-1 rounded-2 shadow-sm">
              <QRCodeSVG value={qrValue} size={64} level="M" />
            </div>
          </div>
        </div>
      </div>

      {/* Action Controls */}
      <div className="text-center mt-3 no-print">
        <button 
          className="btn btn-primary-custom px-4 me-2 d-inline-flex align-items-center gap-2"
          onClick={handlePrintClick}
        >
          <FaPrint /> Print Bus Pass
        </button>
        <button 
          className="btn btn-outline-custom px-4 d-inline-flex align-items-center gap-2"
          onClick={handlePrintClick}
        >
          <FaDownload /> Save / PDF
        </button>
      </div>
    </div>
  );
};

export default DigitalBusPass;
