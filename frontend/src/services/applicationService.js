import api from './api';

export const applicationService = {
  getAll: (params) => api.get('/applications/', { params }),
  getById: (id) => api.get(`/applications/${id}/`),
  create: (formData) => {
    // Check if multipart form data needed for file uploads
    const isMultipart = formData instanceof FormData;
    return api.post('/applications/', formData, {
      headers: isMultipart ? { 'Content-Type': 'multipart/form-data' } : {}
    });
  },
  update: (id, data) => api.put(`/applications/${id}/`, data),
  delete: (id) => api.delete(`/applications/${id}/`),
  approve: (id) => api.post(`/applications/${id}/approve/`),
  reject: (id, rejection_reason) => api.post(`/applications/${id}/reject/`, { rejection_reason }),
  issuePass: (id) => api.post(`/applications/${id}/issue-pass/`),
  checkStatus: (appId) => api.get('/applications/status-check/', { params: { app_id: appId } }),
};
