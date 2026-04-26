import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
export const MEDIA_URL = import.meta.env.VITE_MEDIA_URL || 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  config.headers = config.headers || {};
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  // Let axios set Content-Type automatically for FormData (includes boundary)
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
});

// Auto-logout on 401 — but NOT for payment endpoints (Khalti returns 401 for invalid key)
api.interceptors.response.use(
  res => res,
  err => {
    const url = err.config?.url || '';
    const isPaymentEndpoint = url.includes('/payments/');
    const isPublicEndpoint = url.startsWith('/tours/') || url === '/tours/';
    const isAuthEndpoint = url.includes('/accounts/login/') || url.includes('/accounts/register/');
    const isOnLoginPage = window.location.pathname === '/login';
    if (err.response?.status === 401 && !isPaymentEndpoint && !isPublicEndpoint && !isAuthEndpoint && !isOnLoginPage) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  register: (userData) => api.post('/accounts/register/', userData),
  login: (credentials) => api.post('/accounts/login/', credentials),
  getProfile: () => api.get('/accounts/profile/'),
  updateProfile: (data) => api.patch('/accounts/profile/update/', data),
};

export const tours = {
  getAll: () => api.get('/tours/'),
  getOne: (id) => api.get(`/tours/${id}/`),
  create: (data) => api.post('/tours/', data),
  update: (id, data) => api.patch(`/tours/${id}/`, data),
  delete: (id) => api.delete(`/tours/${id}/`),
  addReview: (tourId, data) => api.post(`/tours/${tourId}/reviews/`, data),
  getVendorTours: () => api.get('/tours/vendor/my-tours/'),
};

export const bookingAPI = {
  create: (data) => api.post('/bookings/create/', data),
  getMyBookings: () => api.get('/bookings/my-bookings/'),
  getVendorBookings: () => api.get('/bookings/vendor/bookings/'),
  getAllBookings: () => api.get('/bookings/admin/all/'),
  updateStatus: (id, data) => api.patch(`/bookings/admin/status/${id}/`, data),
  updatePaymentStatus: (id, data) => api.patch(`/bookings/admin/payment-status/${id}/`, data),
  deleteBooking: (id) => api.delete(`/bookings/${id}/delete/`),
};

export const accountsAPI = {
  getAllUsers: () => api.get('/accounts/users/'),
  updateUserRole: (id, role) => api.patch(`/accounts/users/${id}/role/`, { role }),
  deleteUser: (id) => api.delete(`/accounts/users/${id}/delete/`),
};
export const paymentsAPI = {
  createCheckoutSession: (bookingId) => api.post(`/payments/create-checkout-session/${bookingId}/`),
  khaltiInitiate: (bookingId) => api.post(`/payments/khalti/initiate/${bookingId}/`),
  khaltiVerify: (bookingId, pidx) => api.post(`/payments/khalti/verify/${bookingId}/`, { pidx }),
};

export const supportAPI = {
  createTicket: (data) => api.post('/support/create/', data),
  getMyTickets: () => api.get('/support/my-tickets/'),
  getAllTickets: (role) => api.get(`/support/admin/all/${role ? `?role=${role}` : ''}`),
  getVendorTickets: () => api.get('/support/vendor/tickets/'),
  respondTicket: (id, data) => api.patch(`/support/${id}/respond/`, data),
  deleteTicket: (id) => api.delete(`/support/${id}/delete/`),
};

export default api;