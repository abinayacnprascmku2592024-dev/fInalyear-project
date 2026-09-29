import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBus, FaIdCard, FaRoute, FaSearch, FaRedo, FaUserShield } from 'react-icons/fa';

const Navbar = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <nav className="navbar navbar-expand-lg main-navbar sticky-top">
      <div className="container-fluid px-4">
        <Link className="navbar-brand d-flex align-items-center gap-2 text-white font-heading fw-bold" to="/">
          <div className="bg-primary p-2 rounded-3 text-white d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
            <FaBus size={22} />
          </div>
          <span className="fs-4 tracking-tight">PassGo<span className="text-primary">.Bus</span></span>
        </Link>

        <button 
          className="navbar-toggler text-white border-secondary" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 gap-1 align-items-center">
            <li className="nav-item">
              <Link className={`nav-link nav-link-custom ${location.pathname === '/' ? 'active' : ''}`} to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link nav-link-custom ${location.pathname === '/apply' ? 'active' : ''}`} to="/apply">
                <FaIdCard className="me-1" /> Apply Pass
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link nav-link-custom ${location.pathname === '/application-status' ? 'active' : ''}`} to="/application-status">
                <FaSearch className="me-1" /> Check Status
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link nav-link-custom ${location.pathname === '/view-pass' ? 'active' : ''}`} to="/view-pass">
                <FaIdCard className="me-1" /> View Pass
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link nav-link-custom ${location.pathname === '/renew-pass' ? 'active' : ''}`} to="/renew-pass">
                <FaRedo className="me-1" /> Renew Pass
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link nav-link-custom ${location.pathname === '/routes' ? 'active' : ''}`} to="/routes">
                <FaRoute className="me-1" /> Routes
              </Link>
            </li>
            <li className="nav-item ms-lg-3">
              <Link to="/admin" className="btn btn-primary-custom d-flex align-items-center gap-2 py-2">
                <FaUserShield /> Admin Panel
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
