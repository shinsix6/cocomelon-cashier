import axiosClient from './axiosClient';

const categoryService = {
  getAll: (params) => axiosClient.get('/categories', { params }),

  getById: (id) => axiosClient.get(`/categories/${id}`),

  create: (payload) => axiosClient.post('/categories', payload),

  update: (id, payload) => axiosClient.put(`/categories/${id}`, payload),

  remove: (id) => axiosClient.delete(`/categories/${id}`),
};

export default categoryService;
