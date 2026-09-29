import React from 'react';

const StatusBadge = ({ status }) => {
  const getBadgeClass = (st) => {
    switch (st?.toLowerCase()) {
      case 'approved':
      case 'active':
      case 'issued':
        return 'bg-success text-white';
      case 'pending':
        return 'bg-warning text-dark';
      case 'rejected':
      case 'cancelled':
      case 'expired':
      case 'inactive':
        return 'bg-danger text-white';
      case 'maintenance':
        return 'bg-secondary text-white';
      default:
        return 'bg-secondary text-white';
    }
  };

  return (
    <span className={`badge px-2 py-1 fs-7 fw-semibold rounded-pill ${getBadgeClass(status)}`}>
      {status || 'Unknown'}
    </span>
  );
};

export default StatusBadge;
