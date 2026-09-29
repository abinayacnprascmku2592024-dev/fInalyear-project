import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaBus, FaIdCard, FaSearch, FaRedo, FaRoute, 
  FaCheckCircle, FaQrcode, FaShieldAlt, FaClock, FaArrowRight 
} from 'react-icons/fa';
import { passTypeService } from '../../services/passTypeService';
import { routeService } from '../../services/routeService';
import { formatCurrency } from '../../utils/formatters';

const Home = () => {
  const [passTypes, setPassTypes] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ptRes, rRes] = await Promise.all([
          passTypeService.getAll(),
          routeService.getAll()
        ]);
        setPassTypes(ptRes.data.results || ptRes.data || []);
        setRoutes((rRes.data.results || rRes.data || []).slice(0, 4));
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      {/* Hero Banner */}
      <section className="hero-gradient">
        <div className="container position-relative z-1">
          <div className="row align-items-center g-5">
            <div className="col-lg-7 text-center text-lg-start">
              <span className="badge bg-primary-subtle text-primary fw-bold px-3 py-2 rounded-pill mb-3 border border-primary-subtle">
                Fast & Digital Transit Passes
              </span>
              <h1 className="display-4 font-heading fw-extrabold mb-3 tracking-tight">
                Get Your Online Bus Pass <br />
                <span className="text-warning">In Just 2 Minutes.</span>
              </h1>
              <p className="lead text-light opacity-90 mb-4 me-lg-4">
                Skip ticket queues! Apply online for student, daily, monthly, or corporate transit passes, track real-time application status, and carry your digital QR pass anywhere.
              </p>
              
              <div className="d-flex flex-wrap justify-content-center justify-content-lg-start gap-3">
                <Link to="/apply" className="btn btn-primary-custom btn-lg d-flex align-items-center gap-2 px-4 py-3 fs-6">
                  <FaIdCard /> Apply For Bus Pass
                </Link>
                <Link to="/application-status" className="btn btn-outline-light btn-lg d-flex align-items-center gap-2 px-4 py-3 fs-6">
                  <FaSearch /> Track Status
                </Link>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="glass-card p-4 text-dark shadow-lg">
                <h4 className="font-heading fw-bold mb-3 d-flex align-items-center gap-2 text-primary">
                  <FaBus /> Quick Actions
                </h4>
                <div className="list-group gap-2">
                  <Link to="/apply" className="list-group-item list-group-item-action d-flex align-items-center justify-content-between p-3 rounded-3 border-0 bg-light">
                    <div className="d-flex align-items-center gap-3">
                      <div className="bg-primary text-white p-2 rounded-circle">
                        <FaIdCard />
                      </div>
                      <div>
                        <strong className="d-block text-dark">New Application</strong>
                        <small className="text-muted">Apply for fresh bus pass</small>
                      </div>
                    </div>
                    <FaArrowRight className="text-primary" />
                  </Link>

                  <Link to="/view-pass" className="list-group-item list-group-item-action d-flex align-items-center justify-content-between p-3 rounded-3 border-0 bg-light">
                    <div className="d-flex align-items-center gap-3">
                      <div className="bg-success text-white p-2 rounded-circle">
                        <FaQrcode />
                      </div>
                      <div>
                        <strong className="d-block text-dark">View / Print Pass</strong>
                        <small className="text-muted">Retrieve active digital bus pass</small>
                      </div>
                    </div>
                    <FaArrowRight className="text-success" />
                  </Link>

                  <Link to="/renew-pass" className="list-group-item list-group-item-action d-flex align-items-center justify-content-between p-3 rounded-3 border-0 bg-light">
                    <div className="d-flex align-items-center gap-3">
                      <div className="bg-warning text-dark p-2 rounded-circle">
                        <FaRedo />
                      </div>
                      <div>
                        <strong className="d-block text-dark">Renew Pass</strong>
                        <small className="text-muted">Extend validity of current pass</small>
                      </div>
                    </div>
                    <FaArrowRight className="text-warning" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-5">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-5">
            <h2 className="font-heading fw-bold">Why Choose Digital Bus Pass?</h2>
            <p className="text-muted">Experience hassle-free commuting with our full-stack online pass management system.</p>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="app-card p-4 text-center h-100">
                <div className="bg-primary-light text-primary rounded-circle p-3 d-inline-flex mb-3">
                  <FaQrcode size={32} />
                </div>
                <h5 className="font-heading fw-bold">QR Code Verification</h5>
                <p className="text-muted small">Every issued pass contains a unique QR code for instant conductor verification on buses.</p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="app-card p-4 text-center h-100">
                <div className="bg-success-light text-success rounded-circle p-3 d-inline-flex mb-3">
                  <FaClock size={32} />
                </div>
                <h5 className="font-heading fw-bold">Instant Status Updates</h5>
                <p className="text-muted small">Check your application processing in real time using your unique Application ID.</p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="app-card p-4 text-center h-100">
                <div className="bg-warning-light text-warning rounded-circle p-3 d-inline-flex mb-3">
                  <FaShieldAlt size={32} />
                </div>
                <h5 className="font-heading fw-bold">Seamless Renewals</h5>
                <p className="text-muted small">Renew expired or upcoming passes effortlessly without visiting physical offices.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Available Pass Types */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <h2 className="font-heading fw-bold mb-1">Available Pass Categories</h2>
              <p className="text-muted mb-0">Select the pass category that fits your travel requirements.</p>
            </div>
            <Link to="/pass-types" className="btn btn-outline-custom btn-sm">View All Pass Types &rarr;</Link>
          </div>

          <div className="row g-4">
            {passTypes.slice(0, 3).map((pt) => (
              <div key={pt.id} className="col-md-4">
                <div className="app-card p-4 h-100 d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="badge bg-primary-light text-primary font-heading fw-bold">{pt.duration_days} Days Validity</span>
                    <h3 className="font-heading fw-bold text-primary mb-0">{formatCurrency(pt.price)}</h3>
                  </div>
                  <h4 className="font-heading fw-bold">{pt.name}</h4>
                  <p className="text-muted small flex-grow-1">{pt.description}</p>
                  <Link to="/apply" className="btn btn-primary-custom w-100 mt-3 text-center">Apply Now</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Routes */}
      <section className="py-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <h2 className="font-heading fw-bold mb-1">Popular Bus Routes</h2>
              <p className="text-muted mb-0">Explore active city transport corridors and bus stop networks.</p>
            </div>
            <Link to="/routes" className="btn btn-outline-custom btn-sm">View All Routes &rarr;</Link>
          </div>

          <div className="row g-4">
            {routes.map((r) => (
              <div key={r.id} className="col-md-6 col-lg-3">
                <div className="app-card p-3 h-100">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <span className="badge bg-dark text-white font-mono fw-bold">{r.route_number}</span>
                    <span className="badge bg-success-light text-success fs-8">Active</span>
                  </div>
                  <h6 className="font-heading fw-bold text-dark mb-2">{r.route_name}</h6>
                  <p className="small text-muted mb-2">
                    <strong>{r.starting_point}</strong> &rarr; <strong>{r.destination}</strong>
                  </p>
                  <div className="d-flex justify-content-between small text-secondary border-top pt-2 mt-2">
                    <span>Dist: {r.distance}</span>
                    <span>Time: {r.estimated_time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-5 bg-dark text-white">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-5">
            <h2 className="font-heading fw-bold">How It Works</h2>
            <p className="text-muted">4 simple steps to get your digital transit pass.</p>
          </div>

          <div className="row g-4 text-center">
            <div className="col-md-3">
              <div className="p-3">
                <div className="bg-primary text-white rounded-circle fs-3 fw-bold mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: 60, height: 60 }}>1</div>
                <h5 className="font-heading fw-bold">Fill Application</h5>
                <p className="text-muted small">Enter commuter details, pick route, source & destination stops.</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="p-3">
                <div className="bg-primary text-white rounded-circle fs-3 fw-bold mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: 60, height: 60 }}>2</div>
                <h5 className="font-heading fw-bold">Receive App ID</h5>
                <p className="text-muted small">Get unique APP-XXXXXX tracking number instantly.</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="p-3">
                <div className="bg-primary text-white rounded-circle fs-3 fw-bold mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: 60, height: 60 }}>3</div>
                <h5 className="font-heading fw-bold">Admin Approval</h5>
                <p className="text-muted small">Pass is reviewed and issued by the transport department.</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="p-3">
                <div className="bg-primary text-white rounded-circle fs-3 fw-bold mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: 60, height: 60 }}>4</div>
                <h5 className="font-heading fw-bold">Download / Print Pass</h5>
                <p className="text-muted small">View your pass with QR code and print/download anytime.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
