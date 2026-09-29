import React from 'react';
import { Link } from 'react-router-dom';
import { FaBus, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-5 pb-4 mt-auto border-top border-secondary">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4 col-md-6">
            <h5 className="font-heading fw-bold d-flex align-items-center gap-2 mb-3">
              <FaBus className="text-primary" /> PassGo Bus System
            </h5>
            <p className="text-muted small">
              A modern digital solution for online bus pass applications, status tracking, instant verification, and automatic renewals.
            </p>
          </div>

          <div className="col-lg-2 col-md-6">
            <h6 className="font-heading text-white fw-bold mb-3">Quick Links</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2 text-muted">
              <li><Link to="/" className="text-muted text-decoration-none">Home</Link></li>
              <li><Link to="/apply" className="text-muted text-decoration-none">Apply for Pass</Link></li>
              <li><Link to="/application-status" className="text-muted text-decoration-none">Track Application</Link></li>
              <li><Link to="/view-pass" className="text-muted text-decoration-none">View Bus Pass</Link></li>
              <li><Link to="/renew-pass" className="text-muted text-decoration-none">Renew Pass</Link></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="font-heading text-white fw-bold mb-3">Pass Information</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2 text-muted">
              <li><Link to="/pass-types" className="text-muted text-decoration-none">Available Pass Types</Link></li>
              <li><Link to="/routes" className="text-muted text-decoration-none">Bus Routes & Stops</Link></li>
              <li><Link to="/admin" className="text-muted text-decoration-none">Admin Dashboard</Link></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="font-heading text-white fw-bold mb-3">Contact Helpline</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2 text-muted">
              <li className="d-flex align-items-center gap-2">
                <FaPhoneAlt className="text-primary" /> 1800-123-BUSPASS
              </li>
              <li className="d-flex align-items-center gap-2">
                <FaEnvelope className="text-primary" /> support@passgobus.gov.in
              </li>
              <li className="d-flex align-items-center gap-2">
                <FaMapMarkerAlt className="text-primary" /> Transport Transit Hub, Central Terminal
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-4 border-secondary" />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center small text-muted">
          <p className="mb-0">&copy; 2026 Online Bus Pass Management System. All Rights Reserved.</p>
          <span className="badge bg-secondary">No Authentication Mode</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
