export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount || 0);
};

export const getStatusBadgeColor = (status) => {
  switch (status?.toLowerCase()) {
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
