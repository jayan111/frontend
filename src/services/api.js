import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/',
  withCredentials: true,
});

export const authAPI = {
  signup: (data) => api.post('/signup', data),
  login: (data) => api.post('/login', data),
  logout: () => api.post('/logout'),
};

export const profileAPI = {
  get: () => api.get('/profile'),
  edit: (data) => api.patch('/profile/edit', data),
};

export const feedAPI = {
  get: () => api.get('/feed'),
};

export const requestAPI = {
  send: (status, toUserId) => api.post(`/request/send/${status}/${toUserId}`),
  review: (status, requestId) => api.post(`/request/review/${status}/${requestId}`),
};

export const paymentAPI = {
  createOrder: (data) => api.post('/payment/create-order', data),
  verify: (data) => api.post('/payment/verify', data),
  getMembership: () => api.get('/payment/membership'),
};

export const userAPI = {
  getConnections: () => api.get('/user/connections'),
  getReceivedRequests: () => api.get('/user/requests/received'),
};

export const chatAPI = {
  getHistory: (targetUserId, page = 1, limit = 50) =>
    api.get(`/chat/${targetUserId}`, { params: { page, limit } }),
};

export default api;
