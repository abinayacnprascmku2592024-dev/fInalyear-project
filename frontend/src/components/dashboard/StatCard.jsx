import React from 'react';

const StatCard = ({ title, value, icon, color = 'primary', subtitle }) => {
  return (
    <div className="app-card p-3 h-100 border-0 shadow-sm" style={{ borderLeft: `4px solid var(--bs-${color}, #2563eb)` }}>
      <div className="d-flex align-items-center justify-content-between">
        <div>
          <small className="text-muted text-uppercase fw-semibold fs-8">{title}</small>
          <h3 className="font-heading fw-bold my-1 text-dark">{value}</h3>
          {subtitle && <small className="text-secondary fs-8">{subtitle}</small>}
        </div>
        <div className={`p-3 rounded-circle bg-${color}-light text-${color} d-flex align-items-center justify-content-center`} style={{ width: 50, height: 50 }}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
