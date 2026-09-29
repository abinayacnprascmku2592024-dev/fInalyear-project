export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (e) {
    return dateString;
  }
};

export const formatCurrency = (amount) => {
  const num = parseFloat(amount || 0);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  }).format(num);
};

export const getStatusBadgeClass = (status) => {
  switch (status?.toLowerCase()) {
    case 'pending': return 'badge-pending';
    case 'approved': return 'badge-approved';
    case 'issued':
    case 'active': return 'badge-active';
    case 'rejected':
    case 'cancelled':
    case 'expired': return 'badge-expired';
    case 'maintenance': return 'badge-maintenance';
    default: return 'badge-pending';
  }
};
