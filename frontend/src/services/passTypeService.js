import api from './api';

export const passTypeService = {
  getAll: (params) => api.get('/pass-types/', { params }),
  getById: (id) => api.get(`/pass-types/${id}/`),
  create: (data) => api.post('/pass-types/', data),
  update: (id, data) => api.put(`/pass-types/${id}/`, data),
  delete: (id) => api.delete(`/pass-types/${id}/`),
};
