import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
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

export default api;
