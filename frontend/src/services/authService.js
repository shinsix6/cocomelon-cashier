import axiosClient from './axiosClient';

const authService = {
  login: (payload) => axiosClient.post('/auth/login', payload),

  logout: () => axiosClient.post('/auth/logout'),

  getProfile: () => axiosClient.get('/auth/profile'),

  updateProfile: (payload) => axiosClient.put('/auth/profile', payload),

  changePassword: (payload) => axiosClient.put('/auth/change-password', payload),

  // Admin: kelola akun kasir
  getCashiers: () => axiosClient.get('/auth/users'),
  createCashier: (payload) => axiosClient.post('/auth/users', payload),
  updateCashier: (id, payload) => axiosClient.put(`/auth/users/${id}`, payload),
  deleteCashier: (id) => axiosClient.delete(`/auth/users/${id}`),
};

export default authService;
