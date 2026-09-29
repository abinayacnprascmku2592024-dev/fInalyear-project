import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaTags, FaCheckCircle, FaCalendarAlt } from 'react-icons/fa';
import { passTypeService } from '../../services/passTypeService';
import { formatCurrency } from '../../utils/formatters';

const PassTypesList = () => {
  const [passTypes, setPassTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPassTypes();
  }, []);

  const fetchPassTypes = async () => {
    setLoading(true);
    try {
      const res = await passTypeService.getAll();
      setPassTypes(res.data.results || res.data || []);
    } catch (err) {
      console.error('Error fetching pass types:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="text-center max-w-2xl mx-auto mb-5">
        <span className="badge bg-primary-light text-primary font-heading fw-bold px-3 py-2 rounded-pill mb-2">
          Pass Categories & Pricing
        </span>
        <h2 className="font-heading fw-bold text-dark mb-1">Available Bus Pass Types</h2>
        <p className="text-muted">Choose the pass option tailored for daily, student, monthly, or quarterly travel.</p>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading pass types...</span>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {passTypes.map((pt) => (
            <div key={pt.id} className="col-md-6 col-lg-4">
              <div className="app-card p-4 h-100 d-flex flex-column shadow-sm border-0 position-relative">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="badge bg-primary-light text-primary font-heading fw-bold fs-7">
                    <FaCalendarAlt className="me-1" /> {pt.duration_days} Days Validity
                  </span>
                  <span className={`badge ${pt.status === 'Active' ? 'bg-success-light text-success' : 'bg-secondary'}`}>
                    {pt.status}
                  </span>
                </div>

                <h3 className="font-heading fw-bold text-dark mb-2">{pt.name}</h3>
                <p className="text-muted small flex-grow-1">{pt.description}</p>

                <div className="bg-light p-3 rounded-3 my-3 border d-flex align-items-center justify-content-between">
                  <span className="text-muted small">Subscription Fee:</span>
                  <h3 className="font-heading fw-bold text-primary mb-0">{formatCurrency(pt.price)}</h3>
                </div>

                <ul className="list-unstyled small text-secondary mb-4 space-y-2">
                  <li className="d-flex align-items-center gap-2 mb-2">
                    <FaCheckCircle className="text-success" /> Unlimited route travel during validity
                  </li>
                  <li className="d-flex align-items-center gap-2 mb-2">
                    <FaCheckCircle className="text-success" /> Digital QR Code Pass instant generation
                  </li>
                  <li className="d-flex align-items-center gap-2">
                    <FaCheckCircle className="text-success" /> Online renewal support before expiry
                  </li>
                </ul>

                <Link to={`/apply?pass_type=${pt.id}`} className="btn btn-primary-custom w-100 text-center py-2 mt-auto">
                  Apply For {pt.name}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PassTypesList;
