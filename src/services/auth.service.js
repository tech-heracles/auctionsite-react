import api from './api';
import { jwtDecode } from 'jwt-decode';

const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  };
  
  const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      
      const decoded = jwtDecode(response.data.token);
      const user = {
        id: decoded.id || decoded.nameid,
        username: decoded.unique_name,
        email: decoded.email
      };
      localStorage.setItem('user', JSON.stringify(user));
    }
    return response.data;
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };
  
  const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
  };
  
  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };
  
  export default {
    register,
    login,
    logout,
    getCurrentUser,
    isAuthenticated
  };