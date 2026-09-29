import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CreditCard,
  Search,
  ShieldCheck,
  RefreshCw,
  Bus,
  MapPin,
  CheckCircle2,
  Clock,
  ArrowRight,
  Zap,
  Users
} from 'lucide-react';
import { passTypeService } from '../services/passService';
import { routeService } from '../services/routeService';
import { formatCurrency } from '../utils/helpers';

const Home = () => {
  const [passTypes, setPassTypes] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ptRes, rRes] = await Promise.all([
          passTypeService.getAll(),
          routeService.getAllRoutes(),
        ]);
        setPassTypes(ptRes.data?.data || []);
        setRoutes(rRes.data?.data || []);
      } catch (err) {
        console.error('Failed to load home page data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section text-center text-md-start">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <span className="badge bg-primary bg-opacity-25 text-primary border border-primary px-3 py-2 rounded-pill fw-semibold mb-3">
                <Zap size={14} className="me-1" /> Next-Gen Metro Commuting
              </span>
              <h1 className="display-4 fw-extrabold text-white mb-3">
                Online Bus Pass Management System
              </h1>
              <p className="lead text-white-50 mb-4">
                Apply, renew, verify, and print digital bus passes seamlessly. Fast approval, interactive QR verification, and real-time route tracking.
              </p>
              <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-md-start">
                <Link to="/apply" className="btn btn-primary btn-lg px-4 py-3 rounded-pill fw-semibold shadow-lg d-flex align-items-center gap-2">
                  <CreditCard size={20} />
                  <span>Apply Now</span>
                </Link>
                <Link to="/application-status" className="btn btn-outline-light btn-lg px-4 py-3 rounded-pill fw-semibold d-flex align-items-center gap-2">
                  <Search size={20} />
                  <span>Check Status</span>
                </Link>
              </div>
            </div>
            <div className="col-lg-6 text-center">
              <div className="bg-white bg-opacity-10 backdrop-blur p-4 rounded-4 border border-white border-opacity-10 shadow-lg">
                <div className="row g-3">
                  <div className="col-6">
                    <div className="bg-primary bg-opacity-25 p-3 rounded-3 text-start">
                      <Bus className="text-primary mb-2" size={32} />
                      <h4 className="fw-bold text-white mb-0">50+</h4>
                      <small className="text-white-50">City Bus Routes</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="bg-success bg-opacity-25 p-3 rounded-3 text-start">
                      <Users className="text-success mb-2" size={32} />
                      <h4 className="fw-bold text-white mb-0">10k+</h4>
                      <small className="text-white-50">Active Commuters</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="bg-warning bg-opacity-25 p-3 rounded-3 text-start">
                      <Clock className="text-warning mb-2" size={32} />
                      <h4 className="fw-bold text-white mb-0">&lt; 24 Hrs</h4>
                      <small className="text-white-50">Fast Approval</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="bg-info bg-opacity-25 p-3 rounded-3 text-start">
                      <ShieldCheck className="text-info mb-2" size={32} />
                      <h4 className="fw-bold text-white mb-0">100%</h4>
                      <small className="text-white-50">QR Verified</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Action Portals */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-3">
              <div className="custom-card p-4 text-center h-100">
                <div className="bg-primary text-white p-3 rounded-circle d-inline-flex mb-3">
                  <CreditCard size={28} />
                </div>
                <h5 className="fw-bold">Apply Pass</h5>
                <p className="text-muted small">Submit new pass application with photo and ID proof.</p>
                <Link to="/apply" className="btn btn-sm btn-outline-primary rounded-pill fw-semibold">Apply Online</Link>
              </div>
            </div>

            <div className="col-md-3">
              <div className="custom-card p-4 text-center h-100">
                <div className="bg-success text-white p-3 rounded-circle d-inline-flex mb-3">
                  <Search size={28} />
                </div>
                <h5 className="fw-bold">Check Status</h5>
                <p className="text-muted small">Track application progress using your APP ID.</p>
                <Link to="/application-status" className="btn btn-sm btn-outline-success rounded-pill fw-semibold">Track Status</Link>
              </div>
            </div>

            <div className="col-md-3">
              <div className="custom-card p-4 text-center h-100">
                <div className="bg-info text-white p-3 rounded-circle d-inline-flex mb-3">
                  <ShieldCheck size={28} />
                </div>
                <h5 className="fw-bold">View Pass</h5>
                <p className="text-muted small">Access digital pass card, scan QR code & print.</p>
                <Link to="/view-pass" className="btn btn-sm btn-outline-info rounded-pill fw-semibold">View & Print</Link>
              </div>
            </div>

            <div className="col-md-3">
              <div className="custom-card p-4 text-center h-100">
                <div className="bg-warning text-dark p-3 rounded-circle d-inline-flex mb-3">
                  <RefreshCw size={28} />
                </div>
                <h5 className="fw-bold">Renew Pass</h5>
                <p className="text-muted small">Extend validity of your existing bus pass instantly.</p>
                <Link to="/renew-pass" className="btn btn-sm btn-outline-warning text-dark rounded-pill fw-semibold">Renew Pass</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Available Pass Types */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold text-dark">Available Bus Pass Options</h2>
            <p className="text-muted">Flexible commute plans designed for students, employees, and daily commuters.</p>
          </div>

          <div className="row g-4">
            {passTypes.slice(0, 6).map((pt) => (
              <div key={pt.id} className="col-md-4">
                <div className="custom-card p-4 h-100 d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-1 rounded-pill">{pt.duration_days} Days</span>
                    <h3 className="fw-extrabold text-primary mb-0">{formatCurrency(pt.price)}</h3>
                  </div>
                  <h5 className="fw-bold mb-2">{pt.name}</h5>
                  <p className="text-muted small flex-grow-1">{pt.description}</p>
                  <Link to={`/apply?pass_type=${pt.id}`} className="btn btn-primary w-100 rounded-pill mt-3 d-flex align-items-center justify-content-center gap-2">
                    <span>Apply for {pt.name}</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Bus Routes */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <h2 className="fw-bold text-dark">Popular Bus Routes</h2>
              <p className="text-muted mb-0">High frequency transit routes connecting major hubs.</p>
            </div>
            <Link to="/routes" className="btn btn-outline-primary rounded-pill">View All Routes</Link>
          </div>

          <div className="row g-4">
            {routes.slice(0, 4).map((r) => (
              <div key={r.id} className="col-md-6">
                <div className="custom-card p-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="badge bg-dark text-white font-monospace fs-7">Route #{r.route_number}</span>
                    <span className="text-muted small d-flex align-items-center gap-1">
                      <Clock size={14} /> {r.estimated_time} ({r.distance} km)
                    </span>
                  </div>
                  <h5 className="fw-bold text-dark mb-2">{r.route_name}</h5>
                  <div className="d-flex align-items-center gap-2 text-muted small bg-light p-2 rounded-3">
                    <MapPin size={16} className="text-danger" />
                    <span>{r.starting_point}</span>
                    <span className="fw-bold text-primary">➔</span>
                    <MapPin size={16} className="text-success" />
                    <span>{r.destination}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-5 bg-dark text-white">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">How It Works</h2>
            <p className="text-white-50">Four simple steps to get your digital bus pass</p>
          </div>

          <div className="row g-4 text-center">
            <div className="col-md-3">
              <div className="bg-white bg-opacity-10 p-4 rounded-4 h-100">
                <div className="bg-primary text-white fs-4 fw-bold rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '50px', height: '50px' }}>1</div>
                <h5 className="fw-bold">Fill Form</h5>
                <p className="text-white-50 small mb-0">Enter your details, select route and pass type.</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="bg-white bg-opacity-10 p-4 rounded-4 h-100">
                <div className="bg-primary text-white fs-4 fw-bold rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '50px', height: '50px' }}>2</div>
                <h5 className="fw-bold">Get APP ID</h5>
                <p className="text-white-50 small mb-0">Receive a unique Application ID (e.g. APP-XXXXXX).</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="bg-white bg-opacity-10 p-4 rounded-4 h-100">
                <div className="bg-primary text-white fs-4 fw-bold rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '50px', height: '50px' }}>3</div>
                <h5 className="fw-bold">Verification</h5>
                <p className="text-white-50 small mb-0">Admin approves application and issues pass.</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="bg-white bg-opacity-10 p-4 rounded-4 h-100">
                <div className="bg-primary text-white fs-4 fw-bold rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '50px', height: '50px' }}>4</div>
                <h5 className="fw-bold">Download Pass</h5>
                <p className="text-white-50 small mb-0">View digital card, scan QR code or print for travel.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
