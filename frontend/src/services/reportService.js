import axiosClient from './axiosClient';

const reportService = {
  getDashboardSummary: () => axiosClient.get('/reports/dashboard'),

  getDaily: (params) => axiosClient.get('/reports/daily', { params }),

  getMonthly: (params) => axiosClient.get('/reports/monthly', { params }),

  getByRange: (params) => axiosClient.get('/reports', { params }),

  exportPdf: (params) =>
    axiosClient.get('/reports/export/pdf', { params, responseType: 'blob' }),

  exportExcel: (params) =>
    axiosClient.get('/reports/export/excel', { params, responseType: 'blob' }),
};

export default reportService;
