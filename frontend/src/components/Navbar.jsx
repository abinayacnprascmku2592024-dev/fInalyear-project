import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bus, CreditCard, Search, RefreshCw, MapPin, Shield, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active fw-bold border-bottom border-primary border-2' : '';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm py-3">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold text-primary fs-4" to="/">
          <div className="bg-primary text-white p-2 rounded-3 d-flex align-items-center justify-content-center">
            <Bus size={24} />
          </div>
          <span>MetroPass<span className="text-white">Pro</span></span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
            <li className="nav-item">
              <Link className={`nav-link px-3 ${isActive('/')}`} to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link px-3 ${isActive('/apply')}`} to="/apply">
                <CreditCard size={18} className="me-1" /> Apply Pass
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link px-3 ${isActive('/application-status')}`} to="/application-status">
                <Search size={18} className="me-1" /> Check Status
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link px-3 ${isActive('/view-pass')}`} to="/view-pass">
                <Shield size={18} className="me-1" /> View Pass
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link px-3 ${isActive('/renew-pass')}`} to="/renew-pass">
                <RefreshCw size={18} className="me-1" /> Renew Pass
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link px-3 ${isActive('/routes')}`} to="/routes">
                <MapPin size={18} className="me-1" /> Routes
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link px-3 ${isActive('/pass-types')}`} to="/pass-types">
                Pass Types
              </Link>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-2">
            <Link to="/admin" className="btn btn-outline-light d-flex align-items-center gap-2 px-3 py-2 rounded-pill">
              <LayoutDashboard size={18} />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
