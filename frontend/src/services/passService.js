import api from './api';

export const passService = {
  getAll: (params) => api.get('/passes/', { params }),
  getById: (id) => api.get(`/passes/${id}/`),
  create: (data) => api.post('/passes/', data),
  update: (id, data) => api.put(`/passes/${id}/`, data),
  delete: (id) => api.delete(`/passes/${id}/`),
  lookup: (passNumber) => api.get('/passes/lookup/', { params: { pass_number: passNumber } }),
  verify: (passNumber) => api.get(`/passes/verify/${passNumber}/`),
};
