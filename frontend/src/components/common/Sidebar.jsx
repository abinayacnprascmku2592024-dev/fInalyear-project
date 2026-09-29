import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FaTachometerAlt, FaFileAlt, FaIdCard, FaRedo, 
  FaBus, FaRoute, FaMapMarkerAlt, FaTags, FaChartBar, FaGlobe
} from 'react-icons/fa';

const Sidebar = () => {
  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { path: '/admin/applications', label: 'Applications', icon: <FaFileAlt /> },
    { path: '/admin/passes', label: 'Bus Passes', icon: <FaIdCard /> },
    { path: '/admin/renewals', label: 'Renewals', icon: <FaRedo /> },
    { path: '/admin/buses', label: 'Buses', icon: <FaBus /> },
    { path: '/admin/routes', label: 'Routes', icon: <FaRoute /> },
    { path: '/admin/bus-stops', label: 'Bus Stops', icon: <FaMapMarkerAlt /> },
    { path: '/admin/pass-types', label: 'Pass Types', icon: <FaTags /> },
    { path: '/admin/reports', label: 'Reports', icon: <FaChartBar /> },
  ];

  return (
    <aside className="admin-sidebar py-3">
      <div className="px-4 mb-4 pb-3 border-bottom border-secondary">
        <h5 className="font-heading fw-bold text-white mb-0 d-flex align-items-center gap-2">
          <FaBus className="text-primary" /> Admin Portal
        </h5>
        <small className="text-muted fs-7">Online Bus Pass System</small>
      </div>

      <nav className="flex-grow-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/admin'}
            className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="fs-5">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-3 pt-3 mt-auto border-top border-secondary">
        <NavLink to="/" className="btn btn-outline-light w-100 btn-sm d-flex align-items-center justify-content-center gap-2">
          <FaGlobe /> Public Site
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
