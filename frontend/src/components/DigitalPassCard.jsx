import React, { useRef } from 'react';
import { Bus, Printer, Download, CheckCircle, AlertTriangle, QrCode } from 'lucide-react';
import { formatDate } from '../utils/helpers';
import StatusBadge from './StatusBadge';

const DigitalPassCard = ({ passData }) => {
  const cardRef = useRef();

  if (!passData) return null;

  const {
    pass_number,
    applicant_name,
    applicant_photo,
    organization,
    id_number,
    pass_type_name,
    route_number,
    route_name,
    source_stop_name,
    destination_stop_name,
    issue_date,
    expiry_date,
    status,
    qr_code_image,
    qr_identifier,
  } = passData;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadHTML = () => {
    const element = cardRef.current;
    if (!element) return;
    
    // Create printable HTML page in new window
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Bus Pass - ${pass_number}</title>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
          <style>
            body { font-family: sans-serif; background: #f8fafc; padding: 40px; }
            .pass-box { max-width: 500px; margin: 0 auto; background: #0f172a; color: white; border-radius: 16px; padding: 24px; }
          </style>
        </head>
        <body>
          <div class="pass-box">
            ${element.innerHTML}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const isExpired = new Date(expiry_date) < new Date();

  return (
    <div className="d-flex flex-column align-items-center gap-4">
      {/* Digital Bus Pass Preview */}
      <div className="printable-pass digital-pass-card shadow-lg position-relative" ref={cardRef}>
        <div className="digital-pass-header d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <div className="bg-primary text-white p-2 rounded-3">
              <Bus size={20} />
            </div>
            <div>
              <h6 className="fw-bold mb-0 text-white text-uppercase tracking-wide">Metro Transit Authority</h6>
              <small className="text-white-50">Official Commuter Pass</small>
            </div>
          </div>
          <StatusBadge status={isExpired ? 'Expired' : status} />
        </div>

        <div className="row g-3 align-items-center mb-3">
          <div className="col-4 text-center">
            {applicant_photo ? (
              <img
                src={applicant_photo}
                alt={applicant_name}
                className="digital-pass-photo shadow-sm"
              />
            ) : (
              <div className="digital-pass-photo d-flex align-items-center justify-content-center text-white-50 mx-auto">
                No Photo
              </div>
            )}
            <small className="d-block text-white-50 mt-1 fs-8 text-truncate">{id_number || 'ID: Standard'}</small>
          </div>

          <div className="col-8">
            <h5 className="fw-bold text-white mb-1 text-truncate">{applicant_name}</h5>
            <p className="text-white-50 small mb-2 text-truncate">{organization || 'Public Commuter'}</p>
            
            <div className="bg-dark bg-opacity-50 p-2 rounded-2 border border-secondary border-opacity-25 small mb-2">
              <div className="d-flex justify-content-between">
                <span className="text-white-50">Pass No:</span>
                <span className="fw-bold text-warning font-monospace">{pass_number}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-white-50">Type:</span>
                <span className="fw-semibold text-white">{pass_type_name}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Route details */}
        <div className="bg-dark bg-opacity-75 p-3 rounded-3 mb-3 border border-secondary border-opacity-25">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="badge bg-primary text-white fs-7">Route #{route_number}</span>
            <small className="text-white-50 text-truncate max-w-200">{route_name}</small>
          </div>
          <div className="row text-center fs-8 g-1">
            <div className="col-5 text-start text-truncate">
              <span className="text-white-50 d-block fs-8">From:</span>
              <strong className="text-white">{source_stop_name || 'Terminal'}</strong>
            </div>
            <div className="col-2 align-self-center text-primary fw-bold">➔</div>
            <div className="col-5 text-end text-truncate">
              <span className="text-white-50 d-block fs-8">To:</span>
              <strong className="text-white">{destination_stop_name || 'Terminal'}</strong>
            </div>
          </div>
        </div>

        {/* Dates & QR Code */}
        <div className="row g-2 align-items-center">
          <div className="col-7 small">
            <div className="d-flex justify-content-between mb-1">
              <span className="text-white-50 fs-8">Issue Date:</span>
              <span className="text-white fs-8">{formatDate(issue_date)}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span className="text-white-50 fs-8">Expiry Date:</span>
              <span className={`fs-8 fw-bold ${isExpired ? 'text-danger' : 'text-success'}`}>
                {formatDate(expiry_date)}
              </span>
            </div>
          </div>

          <div className="col-5 text-center">
            {qr_code_image ? (
              <img
                src={qr_code_image}
                alt="QR Code"
                className="bg-white p-1 rounded-2 shadow-sm"
                style={{ width: '80px', height: '80px' }}
              />
            ) : (
              <div className="bg-white text-dark p-2 rounded-2 d-inline-flex flex-column align-items-center fs-8">
                <QrCode size={40} />
                <span className="fs-8">Scan Code</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="d-flex gap-3 no-print">
        <button className="btn btn-primary d-flex align-items-center gap-2 px-4 py-2 rounded-pill shadow-sm" onClick={handlePrint}>
          <Printer size={18} />
          <span>Print Pass</span>
        </button>
        <button className="btn btn-outline-dark d-flex align-items-center gap-2 px-4 py-2 rounded-pill shadow-sm" onClick={handleDownloadHTML}>
          <Download size={18} />
          <span>Download Pass</span>
        </button>
      </div>
    </div>
  );
};

export default DigitalPassCard;
