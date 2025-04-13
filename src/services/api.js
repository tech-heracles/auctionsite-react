import axios from 'axios';

const API_URL = 'https://auctionsitebackend.azurewebsites.net//api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      console.log('Request URL:', config.url);
      console.log('Request Method:', config.method);
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;