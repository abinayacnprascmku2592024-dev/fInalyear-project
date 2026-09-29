import React from 'react';
import { Link } from 'react-router-dom';
import { Bus, Mail, Phone, MapPin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-5 pb-4 mt-auto">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="bg-primary text-white p-2 rounded-3">
                <Bus size={22} />
              </div>
              <span className="fs-4 fw-bold">MetroPassPro</span>
            </div>
            <p className="text-secondary small mb-3">
              Modern Online Bus Pass Management System providing seamless online pass applications, instant verification, route lookups, and renewal processing.
            </p>
            <p className="text-secondary small">
              &copy; {new Date().getFullYear()} MetroPassPro Inc. All rights reserved.
            </p>
          </div>

          <div className="col-lg-2 col-md-6">
            <h6 className="fw-bold mb-3 text-uppercase text-primary fs-7">Quick Links</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li><Link to="/apply" className="text-secondary text-decoration-none hover-white">Apply for Pass</Link></li>
              <li><Link to="/application-status" className="text-secondary text-decoration-none hover-white">Check Application Status</Link></li>
              <li><Link to="/view-pass" className="text-secondary text-decoration-none hover-white">Digital Pass View</Link></li>
              <li><Link to="/renew-pass" className="text-secondary text-decoration-none hover-white">Renew Bus Pass</Link></li>
              <li><Link to="/routes" className="text-secondary text-decoration-none hover-white">Bus Routes & Stops</Link></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="fw-bold mb-3 text-uppercase text-primary fs-7">Support & Contact</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small text-secondary">
              <li className="d-flex align-items-center gap-2">
                <MapPin size={16} className="text-primary" />
                <span>100 Transportation Plaza, City Center</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <Phone size={16} className="text-primary" />
                <span>+1 (800) 555-BUSPASS</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <Mail size={16} className="text-primary" />
                <span>support@metropasspro.org</span>
              </li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="fw-bold mb-3 text-uppercase text-primary fs-7">System Info</h6>
            <div className="bg-secondary bg-opacity-25 p-3 rounded-3 border border-secondary text-secondary small">
              <p className="mb-1"><strong>Status:</strong> System Operational</p>
              <p className="mb-0"><strong>Authentication Mode:</strong> Public Access Enabled (No Login Required)</p>
            </div>
          </div>
        </div>

        <hr className="my-4 border-secondary opacity-25" />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center small text-secondary">
          <span>Designed with high precision & modern React + Django REST API architecture.</span>
          <span className="d-flex align-items-center gap-1 mt-2 mt-md-0">
            Powered by Python & MySQL
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
