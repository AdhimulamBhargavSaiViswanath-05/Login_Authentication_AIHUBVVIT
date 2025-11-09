import axios from 'axios';

const API_URL = '/api';

// Configure axios to include credentials (cookies) with requests
axios.defaults.withCredentials = true;

export const authService = {
  async login(email, password, remember = false) {
    const response = await axios.post('/auth/login', { email, password, remember });
    return response.data;
  },

  async signup(name, email, password) {
    const response = await axios.post('/auth/signup', { name, email, password });
    return response.data;
  },

  async logout() {
    const response = await axios.get('/auth/logout');
    return response.data;
  },

  async getCurrentUser() {
    const response = await axios.get(`${API_URL}/user`);
    return response.data;
  },

  async forgotPassword(email) {
    const response = await axios.post('/auth/forgot-password', { email });
    return response.data;
  },

  async resetPassword(token, password, confirmPassword) {
    const response = await axios.post(`/auth/reset-password/${token}`, {
      password,
      confirmPassword
    });
    return response.data;
  },

  async verifyEmail(token) {
    const response = await axios.get(`/auth/verify-email/${token}`);
    return response.data;
  },

  getGoogleAuthUrl() {
    return '/auth/google';
  }
};
