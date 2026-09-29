import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaIdCard, FaCopy, FaCheckCircle, FaExclamationTriangle, FaArrowRight } from 'react-icons/fa';
import { passTypeService } from '../../services/passTypeService';
import { routeService } from '../../services/routeService';
import { applicationService } from '../../services/applicationService';
import Modal from '../../components/common/Modal';

const ApplyPass = () => {
  const navigate = useNavigate();

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
    pass_type: '',
    route: '',
    source_stop: '',
    destination_stop: '',
    start_date: new Date().toISOString().split('T')[0],
    duration_days: 30,
    remarks: '',
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [idProofFile, setIdProofFile] = useState(null);

  const [passTypes, setPassTypes] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [stops, setStops] = useState([]);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [createdAppId, setCreatedAppId] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [ptRes, rRes] = await Promise.all([
          passTypeService.getAll(),
          routeService.getAll()
        ]);
        const pts = ptRes.data.results || ptRes.data || [];
        const rts = rRes.data.results || rRes.data || [];
        setPassTypes(pts);
        setRoutes(rts);

        if (pts.length > 0) {
          setFormData(prev => ({ ...prev, pass_type: pts[0].id, duration_days: pts[0].duration_days }));
        }
        if (rts.length > 0) {
          setFormData(prev => ({ ...prev, route: rts[0].id }));
          fetchStopsForRoute(rts[0].id);
        }
      } catch (err) {
        console.error('Error fetching initial options:', err);
      }
    };
    fetchDropdowns();
  }, []);

  const fetchStopsForRoute = async (routeId) => {
    try {
      const res = await routeService.getStops({ route_id: routeId });
      const stList = res.data.results || res.data || [];
      setStops(stList);
      if (stList.length >= 2) {
        setFormData(prev => ({
          ...prev,
          source_stop: stList[0].id,
          destination_stop: stList[stList.length - 1].id
        }));
      } else if (stList.length === 1) {
        setFormData(prev => ({
          ...prev,
          source_stop: stList[0].id,
          destination_stop: stList[0].id
        }));
      }
    } catch (err) {
      console.error('Error fetching stops for route:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'route') {
      fetchStopsForRoute(value);
    }
    if (name === 'pass_type') {
      const selectedPt = passTypes.find(p => String(p.id) === String(value));
      if (selectedPt) {
        setFormData(prev => ({ ...prev, duration_days: selectedPt.duration_days }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });

      if (photoFile) data.append('photo', photoFile);
      if (idProofFile) data.append('id_proof', idProofFile);

      const res = await applicationService.create(data);
      const appId = res.data.application_id || res.data.data?.application_id;
      setCreatedAppId(appId);
      setShowSuccessModal(true);
    } catch (err) {
      const errRes = err.response?.data;
      if (errRes && errRes.errors) {
        const firstErrKey = Object.keys(errRes.errors)[0];
        setErrorMsg(`${firstErrKey}: ${JSON.stringify(errRes.errors[firstErrKey])}`);
      } else {
        setErrorMsg(errRes?.message || 'Failed to submit application. Please check form entries.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(createdAppId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container py-5">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-4">
          <span className="badge bg-primary-light text-primary font-heading fw-bold px-3 py-2 rounded-pill mb-2">
            Online Pass Portal
          </span>
          <h2 className="font-heading fw-bold text-dark mb-1">Apply for Bus Pass</h2>
          <p className="text-muted">Fill out the official application form below to request your transit pass.</p>
        </div>

        {errorMsg && (
          <div className="alert alert-danger d-flex align-items-center gap-2 mb-4" role="alert">
            <FaExclamationTriangle className="flex-shrink-0" />
            <div>{errorMsg}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="app-card p-4 p-md-5 shadow-md">
          {/* Section 1: Personal Details */}
          <h5 className="font-heading fw-bold text-primary mb-3 pb-2 border-bottom">1. Personal Information</h5>
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Full Name *</label>
              <input 
                type="text" 
                className="form-control" 
                name="name" 
                value={formData.name} 
                onChange={handleInputChange} 
                required 
                placeholder="e.g. Aarav Sharma" 
              />
            </div>
            <div className="col-md-3">
              <label className="form-label fw-semibold">Date of Birth *</label>
              <input 
                type="date" 
                className="form-control" 
                name="date_of_birth" 
                value={formData.date_of_birth} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            <div className="col-md-3">
              <label className="form-label fw-semibold">Gender *</label>
              <select className="form-select" name="gender" value={formData.gender} onChange={handleInputChange}>
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
                onChange={handleInputChange} 
                required 
                placeholder="aarav@example.com" 
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Phone Number *</label>
              <input 
                type="tel" 
                className="form-control" 
                name="phone" 
                value={formData.phone} 
                onChange={handleInputChange} 
                required 
                placeholder="9876543210" 
              />
            </div>
          </div>

          {/* Section 2: Residential Address */}
          <h5 className="font-heading fw-bold text-primary mb-3 pb-2 border-bottom">2. Address & Organization</h5>
          <div className="row g-3 mb-4">
            <div className="col-12">
              <label className="form-label fw-semibold">Residential Address *</label>
              <input 
                type="text" 
                className="form-control" 
                name="address" 
                value={formData.address} 
                onChange={handleInputChange} 
                required 
                placeholder="Flat / Building / Street Address" 
              />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold">City *</label>
              <input type="text" className="form-control" name="city" value={formData.city} onChange={handleInputChange} required placeholder="Pune" />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold">State *</label>
              <input type="text" className="form-control" name="state" value={formData.state} onChange={handleInputChange} required placeholder="Maharashtra" />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold">Pincode *</label>
              <input type="text" className="form-control" name="pincode" value={formData.pincode} onChange={handleInputChange} required placeholder="411001" />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">College / School / Company Name *</label>
              <input type="text" className="form-control" name="organization" value={formData.organization} onChange={handleInputChange} required placeholder="e.g. MIT World Peace Univ" />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">ID Card / Roll Number *</label>
              <input type="text" className="form-control" name="id_number" value={formData.id_number} onChange={handleInputChange} required placeholder="e.g. STU-9921" />
            </div>
          </div>

          {/* Section 3: Pass & Route Selection */}
          <h5 className="font-heading fw-bold text-primary mb-3 pb-2 border-bottom">3. Pass & Route Details</h5>
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Pass Type Category *</label>
              <select className="form-select" name="pass_type" value={formData.pass_type} onChange={handleInputChange} required>
                {passTypes.map(pt => (
                  <option key={pt.id} value={pt.id}>
                    {pt.name} — ₹{pt.price} ({pt.duration_days} Days)
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Select Bus Route *</label>
              <select className="form-select" name="route" value={formData.route} onChange={handleInputChange} required>
                {routes.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.route_number}: {r.starting_point} &rarr; {r.destination}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Source Bus Stop *</label>
              <select className="form-select" name="source_stop" value={formData.source_stop} onChange={handleInputChange} required>
                {stops.map(s => (
                  <option key={s.id} value={s.id}>{s.stop_name}</option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Destination Bus Stop *</label>
              <select className="form-select" name="destination_stop" value={formData.destination_stop} onChange={handleInputChange} required>
                {stops.map(s => (
                  <option key={s.id} value={s.id}>{s.stop_name}</option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Requested Start Date *</label>
              <input type="date" className="form-control" name="start_date" value={formData.start_date} onChange={handleInputChange} required />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Duration (Days)</label>
              <input type="number" className="form-control" name="duration_days" value={formData.duration_days} onChange={handleInputChange} readOnly />
            </div>
          </div>

          {/* Section 4: Document Uploads & Remarks */}
          <h5 className="font-heading fw-bold text-primary mb-3 pb-2 border-bottom">4. Documents & Remarks</h5>
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Applicant Profile Photo</label>
              <input type="file" className="form-control" accept="image/*" onChange={(e) => setPhotoFile(e.target.files[0])} />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Govt / Student ID Proof</label>
              <input type="file" className="form-control" accept="image/*,application/pdf" onChange={(e) => setIdProofFile(e.target.files[0])} />
            </div>
            <div className="col-12">
              <label className="form-label fw-semibold">Remarks / Additional Notes</label>
              <textarea className="form-control" name="remarks" rows="2" value={formData.remarks} onChange={handleInputChange} placeholder="Optional notes for admin approval..."></textarea>
            </div>
          </div>

          <div className="text-end border-top pt-4">
            <button type="submit" className="btn btn-primary-custom btn-lg px-5" disabled={loading}>
              {loading ? 'Submitting Application...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Application Submitted Successfully"
        footerButtons={
          <>
            <button className="btn btn-outline-secondary" onClick={() => setShowSuccessModal(false)}>Close</button>
            <Link to={`/application-status?app_id=${createdAppId}`} className="btn btn-primary-custom">
              Track Application Status <FaArrowRight />
            </Link>
          </>
        }
      >
        <div className="text-center py-3">
          <div className="bg-success-light text-success p-3 rounded-circle d-inline-flex mb-3">
            <FaCheckCircle size={48} />
          </div>
          <h4 className="font-heading fw-bold text-dark mb-2">Application Submitted Successfully</h4>
          <p className="text-muted">Your application has been received by the Transit Department for verification.</p>
          
          <div className="bg-light p-3 rounded-3 border border-secondary my-3 text-center">
            <small className="text-muted text-uppercase d-block mb-1 font-heading">Your Application ID</small>
            <div className="d-flex align-items-center justify-content-center gap-2">
              <h3 className="font-mono text-primary fw-bold mb-0">{createdAppId}</h3>
              <button className="btn btn-sm btn-outline-primary ms-2" onClick={handleCopyId}>
                <FaCopy /> {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
          <small className="text-muted">Please save this Application ID to check your pass status or collect your pass.</small>
        </div>
      </Modal>
    </div>
  );
};

export default ApplyPass;
