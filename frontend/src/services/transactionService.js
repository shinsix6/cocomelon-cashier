import axiosClient from './axiosClient';

const transactionService = {
  getAll: (params) => axiosClient.get('/transactions', { params }),

  getById: (id) => axiosClient.get(`/transactions/${id}`),

  create: (payload) => axiosClient.post('/transactions', payload),

  getRecent: (limit = 5) =>
    axiosClient.get('/transactions', { params: { limit, sort: '-createdAt' } }),
};

export default transactionService;
