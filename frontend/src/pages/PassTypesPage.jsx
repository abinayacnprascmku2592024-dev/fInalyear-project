import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, ArrowRight, CheckCircle2 } from 'lucide-react';
import { passTypeService } from '../services/passService';
import { formatCurrency } from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';

const PassTypesPage = () => {
  const [passTypes, setPassTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPassTypes = async () => {
      try {
        const res = await passTypeService.getAll({ status: 'Active' });
        setPassTypes(res.data?.data || []);
      } catch (err) {
        console.error('Failed to load pass types:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPassTypes();
  }, []);

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h2 className="fw-bold text-dark">Bus Pass Plans & Pricing</h2>
        <p className="text-muted">Choose from our daily, weekly, monthly, student, or corporate commute passes.</p>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading pass types..." />
      ) : (
        <div className="row g-4">
          {passTypes.map((pt) => (
            <div key={pt.id} className="col-lg-4 col-md-6">
              <div className="custom-card p-4 h-100 d-flex flex-column border-top border-primary border-4 shadow-sm">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-1 rounded-pill fw-semibold">
                    {pt.duration_days} Days Validity
                  </span>
                  <h3 className="fw-extrabold text-primary mb-0">{formatCurrency(pt.price)}</h3>
                </div>

                <h4 className="fw-bold text-dark mb-2">{pt.name}</h4>
                <p className="text-muted small mb-4 flex-grow-1">{pt.description}</p>

                <ul className="list-unstyled mb-4 small text-secondary d-flex flex-column gap-2">
                  <li className="d-flex align-items-center gap-2">
                    <CheckCircle2 size={16} className="text-success" />
                    <span>Unlimited travel on all active city routes</span>
                  </li>
                  <li className="d-flex align-items-center gap-2">
                    <CheckCircle2 size={16} className="text-success" />
                    <span>Instant QR code mobile pass generation</span>
                  </li>
                  <li className="d-flex align-items-center gap-2">
                    <CheckCircle2 size={16} className="text-success" />
                    <span>Easy online renewal & downloadable PDF pass</span>
                  </li>
                </ul>

                <Link
                  to={`/apply?pass_type=${pt.id}`}
                  className="btn btn-primary btn-lg rounded-pill w-100 d-flex align-items-center justify-content-center gap-2 fw-semibold"
                >
                  <CreditCard size={18} />
                  <span>Apply Now</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PassTypesPage;
