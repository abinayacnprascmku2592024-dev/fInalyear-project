import api from './api';

export const routeService = {
  getAll: (params) => api.get('/routes/', { params }),
  getById: (id) => api.get(`/routes/${id}/`),
  create: (data) => api.post('/routes/', data),
  update: (id, data) => api.put(`/routes/${id}/`, data),
  delete: (id) => api.delete(`/routes/${id}/`),
  getStops: (params) => api.get('/bus-stops/', { params }),
  createStop: (data) => api.post('/bus-stops/', data),
  updateStop: (id, data) => api.put(`/bus-stops/${id}/`, data),
  deleteStop: (id) => api.delete(`/bus-stops/${id}/`),
};
