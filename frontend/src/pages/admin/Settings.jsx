import React from 'react';
import { Settings as SettingsIcon, ShieldCheck, Database, Server, Key } from 'lucide-react';

const Settings = () => {
  return (
    <div>
      <div className="mb-4">
        <h3 className="fw-bold text-dark mb-1">System Settings & Configuration</h3>
        <p className="text-muted mb-0">Overview of environment variables, database backend, and CORS policy.</p>
      </div>

      <div className="row g-4">
        <div className="col-lg-6">
          <div className="custom-card p-4 h-100">
            <div className="d-flex align-items-center gap-2 mb-3 text-primary">
              <ShieldCheck size={24} />
              <h5 className="fw-bold mb-0 text-dark">Authentication Mode</h5>
            </div>
            <div className="alert alert-info mb-3">
              <strong>Authentication Disabled:</strong> Per system specification, all endpoints and dashboard features are globally accessible without login or JWT tokens.
            </div>
            <ul className="list-unstyled text-muted small d-flex flex-column gap-2">
              <li>• Public Apply Page: Active</li>
              <li>• Public Check Status Page: Active</li>
              <li>• Public Pass Verification API: Active</li>
              <li>• Admin Portal Access: Direct Access Enabled</li>
            </ul>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="custom-card p-4 h-100">
            <div className="d-flex align-items-center gap-2 mb-3 text-primary">
              <Database size={24} />
              <h5 className="fw-bold mb-0 text-dark">Database Configuration</h5>
            </div>
            <div className="bg-light p-3 rounded-3 font-monospace small mb-3">
              <div>DB_NAME: bus_pass_db</div>
              <div>DB_USER: root</div>
              <div>DB_HOST: localhost:3306</div>
              <div>ENGINE: MySQL (with PyMySQL driver)</div>
            </div>
            <p className="text-muted small mb-0">
              Gracefully falls back to local SQLite standard database if MySQL service connection is offline.
            </p>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="custom-card p-4 h-100">
            <div className="d-flex align-items-center gap-2 mb-3 text-primary">
              <Server size={24} />
              <h5 className="fw-bold mb-0 text-dark">API & CORS Settings</h5>
            </div>
            <div className="bg-light p-3 rounded-3 font-monospace small mb-3">
              <div>FRONTEND_URL: http://localhost:5173</div>
              <div>BACKEND_API: http://localhost:8000/api</div>
              <div>CORS_ALLOW_ALL_ORIGINS: True</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
