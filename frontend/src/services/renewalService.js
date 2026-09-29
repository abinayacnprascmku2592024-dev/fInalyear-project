import api from './api';

export const renewalService = {
  getAll: (params) => api.get('/renewals/', { params }),
  getById: (id) => api.get(`/renewals/${id}/`),
  create: (data) => api.post('/renewals/', data),
  approve: (id) => api.post(`/renewals/${id}/approve/`),
  reject: (id, remarks) => api.post(`/renewals/${id}/reject/`, { remarks }),
};
