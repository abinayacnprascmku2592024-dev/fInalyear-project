import React from 'react';
import { getStatusBadgeClass } from '../../utils/formatters';

const StatusBadge = ({ status }) => {
  const badgeClass = getStatusBadgeClass(status);
  return (
    <span className={`badge-status ${badgeClass}`}>
      {status || 'Unknown'}
    </span>
  );
};

export default StatusBadge;
