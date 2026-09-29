import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  CreditCard,
  RefreshCw,
  Bus,
  MapPin,
  List,
  Layers,
  BarChart3,
  Settings,
  ArrowLeft,
  ShieldCheck
} from 'lucide-react';

const AdminSidebar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/applications', label: 'Applications', icon: FileText },
    { path: '/admin/bus-passes', label: 'Bus Passes', icon: CreditCard },
    { path: '/admin/renewals', label: 'Renewals', icon: RefreshCw },
    { path: '/admin/buses', label: 'Buses', icon: Bus },
    { path: '/admin/routes', label: 'Routes', icon: MapPin },
    { path: '/admin/bus-stops', label: 'Bus Stops', icon: List },
    { path: '/admin/pass-types', label: 'Pass Types', icon: Layers },
    { path: '/admin/reports', label: 'Reports', icon: BarChart3 },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="admin-sidebar d-flex flex-column py-3 shadow">
      <div className="px-3 mb-4">
        <Link to="/admin" className="d-flex align-items-center gap-2 text-white text-decoration-none fw-bold fs-5">
          <div className="bg-primary text-white p-2 rounded-3">
            <ShieldCheck size={22} />
          </div>
          <div>
            <div className="lh-1">Admin Portal</div>
            <span className="badge bg-success fs-8 mt-1">No Auth Mode</span>
          </div>
        </Link>
      </div>

      <nav className="nav flex-column gap-1 mb-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${active ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pt-3 border-top border-secondary border-opacity-25">
        <Link to="/" className="btn btn-outline-secondary text-white w-100 d-flex align-items-center justify-content-center gap-2 py-2">
          <ArrowLeft size={18} />
          <span>Public Portal</span>
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;
