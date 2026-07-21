import axiosClient from './axiosClient';

const productService = {
  getAll: (params) => axiosClient.get('/products', { params }),

  getById: (id) => axiosClient.get(`/products/${id}`),

  create: (payload) => {
    const isFormData = payload instanceof FormData;
    return axiosClient.post('/products', payload, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    });
  },

  update: (id, payload) => {
    const isFormData = payload instanceof FormData;
    return axiosClient.put(`/products/${id}`, payload, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    });
  },

  remove: (id) => axiosClient.delete(`/products/${id}`),

  updateStatus: (id, isActive) =>
    axiosClient.patch(`/products/${id}/status`, { isActive }),
};

export default productService;
