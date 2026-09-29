import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, Copy, AlertCircle, FileText, ArrowRight } from 'lucide-react';
import { passTypeService } from '../services/passService';
import { routeService } from '../services/routeService';
import { applicationService } from '../services/applicationService';
import LoadingSpinner from '../components/LoadingSpinner';

const ApplyPass = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [passTypes, setPassTypes] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    date_of_birth: '',
    gender: 'Male',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    organization: '',
    id_number: '',
    pass_type: searchParams.get('pass_type') || '',
    route: '',
    source_stop: '',
    destination_stop: '',
    start_date: new Date().toISOString().split('T')[0],
    remarks: '',
  });

  const [photo, setPhoto] = useState(null);
  const [idProof, setIdProof] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successData, setSuccessData] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [ptRes, rRes] = await Promise.all([
          passTypeService.getAll({ status: 'Active' }),
          routeService.getAllRoutes({ status: 'Active' }),
        ]);
        setPassTypes(ptRes.data?.data || []);
        setRoutes(rRes.data?.data || []);
        if (ptRes.data?.data?.length > 0 && !formData.pass_type) {
          setFormData((prev) => ({ ...prev, pass_type: ptRes.data.data[0].id }));
        }
      } catch (err) {
        setErrorMsg('Failed to load routes and pass types. Please make sure backend is running.');
      } finally {
        setLoading(false);
      }
    };
    fetchDropdowns();
  }, []);

  // When route changes, fetch stops for that route
  useEffect(() => {
    if (!formData.route) {
      setStops([]);
      return;
    }
    const fetchStops = async () => {
      try {
        const res = await routeService.getAllStops({ route_id: formData.route });
        const fetchedStops = res.data?.data || [];
        setStops(fetchedStops);
        if (fetchedStops.length >= 2) {
          setFormData((prev) => ({
            ...prev,
            source_stop: fetchedStops[0].id,
            destination_stop: fetchedStops[fetchedStops.length - 1].id,
          }));
        }
      } catch (err) {
        console.error('Failed to load bus stops:', err);
      }
    };
    fetchStops();
  }, [formData.route]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      if (name === 'photo') setPhoto(files[0]);
      if (name === 'idProof') setIdProof(files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });
      if (photo) data.append('photo', photo);
      if (idProof) data.append('id_proof', idProof);

      const res = await applicationService.create(data);
      setSuccessData(res.data?.data);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit application. Please check input values.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyId = () => {
    if (successData?.application_id) {
      navigator.clipboard.writeText(successData.application_id);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  if (loading) return <LoadingSpinner text="Preparing Application Form..." />;

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          {successData ? (
            /* Success Screen */
            <div className="custom-card p-5 text-center shadow-lg border-success border-2">
              <div className="bg-success text-white p-3 rounded-circle d-inline-flex mb-3">
                <CheckCircle2 size={48} />
              </div>
              <h2 className="fw-bold text-dark mb-2">Application Submitted Successfully!</h2>
              <p className="text-muted">
                Your bus pass application has been submitted to the transit authority for review.
              </p>

              <div className="bg-light p-4 rounded-3 border my-4 d-inline-block text-start mw-100" style={{ width: '450px' }}>
                <span className="text-muted small d-block">Your Unique Application ID:</span>
                <div className="d-flex justify-content-between align-items-center mt-2">
                  <h3 className="fw-bold text-primary font-monospace mb-0">{successData.application_id}</h3>
                  <button
                    className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
                    onClick={handleCopyId}
                  >
                    <Copy size={16} />
                    <span>{copied ? 'Copied!' : 'Copy ID'}</span>
                  </button>
                </div>
              </div>

              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <Link to={`/application-status?app_id=${successData.application_id}`} className="btn btn-primary rounded-pill px-4 py-2 d-flex align-items-center gap-2">
                  <span>Track Status</span>
                  <ArrowRight size={16} />
                </Link>
                <button
                  className="btn btn-outline-secondary rounded-pill px-4 py-2"
                  onClick={() => {
                    setSuccessData(null);
                    setFormData((prev) => ({ ...prev, name: '', email: '', phone: '' }));
                  }}
                >
                  Submit Another Application
                </button>
              </div>
            </div>
          ) : (
            /* Application Form */
            <div className="custom-card p-4 p-md-5 shadow-lg">
              <div className="border-bottom pb-3 mb-4">
                <h2 className="fw-bold text-dark mb-1">Apply for Bus Pass</h2>
                <p className="text-muted mb-0">Fill in the required information to request a new digital bus pass.</p>
              </div>

              {errorMsg && (
                <div className="alert alert-danger d-flex align-items-center gap-2 mb-4">
                  <AlertCircle size={20} />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* 1. Personal Information */}
                <h5 className="fw-bold text-primary mb-3">1. Personal Details</h5>
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Applicant Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Full Name"
                      required
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-semibold">Date of Birth *</label>
                    <input
                      type="date"
                      className="form-control"
                      name="date_of_birth"
                      value={formData.date_of_birth}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-semibold">Gender *</label>
                    <select
                      className="form-select"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      required
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Email Address *</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@example.com"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Phone Number *</label>
                    <input
                      type="tel"
                      className="form-control"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold">Address *</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Street Address, Apartment/Suite"
                      required
                    ></textarea>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fw-semibold">City *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">State *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Pincode *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">College / School / Company Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="organization"
                      value={formData.organization}
                      onChange={handleChange}
                      placeholder="e.g. State University / TechCorp"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Student / Employee ID Number *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="id_number"
                      value={formData.id_number}
                      onChange={handleChange}
                      placeholder="e.g. STU-12345"
                      required
                    />
                  </div>
                </div>

                {/* 2. Route & Pass Type Details */}
                <h5 className="fw-bold text-primary mb-3">2. Route & Pass Selection</h5>
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Pass Type *</label>
                    <select
                      className="form-select"
                      name="pass_type"
                      value={formData.pass_type}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Pass Type</option>
                      {passTypes.map((pt) => (
                        <option key={pt.id} value={pt.id}>
                          {pt.name} - ${pt.price} ({pt.duration_days} Days)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Bus Route *</label>
                    <select
                      className="form-select"
                      name="route"
                      value={formData.route}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Bus Route</option>
                      {routes.map((r) => (
                        <option key={r.id} value={r.id}>
                          Route #{r.route_number}: {r.route_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {formData.route && stops.length > 0 && (
                    <>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Source Stop *</label>
                        <select
                          className="form-select"
                          name="source_stop"
                          value={formData.source_stop}
                          onChange={handleChange}
                          required
                        >
                          {stops.map((s) => (
                            <option key={s.id} value={s.id}>
                              Stop #{s.sequence_number}: {s.stop_name} ({s.location})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Destination Stop *</label>
                        <select
                          className="form-select"
                          name="destination_stop"
                          value={formData.destination_stop}
                          onChange={handleChange}
                          required
                        >
                          {stops.map((s) => (
                            <option key={s.id} value={s.id}>
                              Stop #{s.sequence_number}: {s.stop_name} ({s.location})
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Start Date *</label>
                    <input
                      type="date"
                      className="form-control"
                      name="start_date"
                      value={formData.start_date}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Remarks (Optional)</label>
                    <input
                      type="text"
                      className="form-control"
                      name="remarks"
                      value={formData.remarks}
                      onChange={handleChange}
                      placeholder="Special travel instructions"
                    />
                  </div>
                </div>

                {/* 3. Document Uploads */}
                <h5 className="fw-bold text-primary mb-3">3. Document Uploads</h5>
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Applicant Profile Photo</label>
                    <input
                      type="file"
                      className="form-control"
                      name="photo"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    <small className="text-muted">JPG or PNG format (Max 5MB)</small>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">ID Proof Copy</label>
                    <input
                      type="file"
                      className="form-control"
                      name="idProof"
                      accept="image/*,application/pdf"
                      onChange={handleFileChange}
                    />
                    <small className="text-muted">PDF or Image copy of College/Govt ID</small>
                  </div>
                </div>

                <div className="d-grid mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg rounded-pill fw-semibold py-3 d-flex align-items-center justify-content-center gap-2"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        <span>Submitting Application...</span>
                      </>
                    ) : (
                      <>
                        <FileText size={20} />
                        <span>Submit Application</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplyPass;
