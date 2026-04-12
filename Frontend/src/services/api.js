import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  config.headers = config.headers || {};
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (userData) => api.post('/accounts/register/', userData),
  login: (credentials) => api.post('/accounts/login/', credentials),
  getProfile: () => api.get('/accounts/profile/'),
};

export const tours = {
  getAll: () => api.get('/tours/'),
  getOne: (id) => api.get(`/tours/${id}/`),
  create: (data) => api.post('/tours/', data),
  update: (id, data) => api.put(`/tours/${id}/`, data),
  delete: (id) => api.delete(`/tours/${id}/`),
  addReview: (tourId, data) => api.post(`/tours/${tourId}/reviews/`, data),
};

export const bookingAPI = {
  create: (data) => api.post('/bookings/create/', data),
  getMyBookings: () => api.get('/bookings/my-bookings/'),
  getAllBookings: () => api.get('/bookings/admin/all/'),
  updateStatus: (id, data) => api.patch(`/bookings/admin/status/${id}/`, data),
  
};

export default api;