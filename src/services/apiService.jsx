import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
});

export const accidentsAPI = {

  // 🔥 ADICIONE ESTE ENDPOINT:
  getMappings: () => apiClient.get('/mappings'),

  getStats: () => apiClient.get('/api/accidents/stats'),
  getByState: () => apiClient.get('/api/accidents/by-state'),
  getByType: () => apiClient.get('/api/accidents/by-type'),
  getByWeather: () => apiClient.get('/api/accidents/by-weather'),
  getByHour: () => apiClient.get('/api/accidents/by-hour'),
  getByDayWeek: () => apiClient.get('/api/accidents/by-day-week'),
  getHeatmapData: (limit = 10000) =>
    apiClient.get('/api/accidents/heatmap', { params: { limit } }),
  getTopMunicipalities: (limit = 20) =>
    apiClient.get('/api/accidents/top-municipalities', { params: { limit } }),
  search: (filters) =>
    apiClient.get('/api/accidents/search', { params: filters }),
  getYearStats: (year) =>
    apiClient.get(`/api/accidents/year-stats/${year}`),
};

export default apiClient;
