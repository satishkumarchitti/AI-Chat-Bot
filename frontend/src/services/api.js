import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// Document APIs
export const documentAPI = {
  getAll: (params) => api.get('/documents', { params }),
  getById: (id) => api.get(`/documents/${id}`),
  upload: (formData) => {
    return api.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  delete: (id) => api.delete(`/documents/${id}`),
  updateExtractedData: (id, data) => api.put(`/documents/${id}/extracted-data`, data),
  getExtractedData: (id) => api.get(`/documents/${id}/extracted-data`),
  exportData: (id, format) => api.get(`/documents/${id}/export/${format}`, {
    responseType: 'blob',
  }),
};

// Chat APIs
export const chatAPI = {
  getChatHistory: (documentId) => api.get(`/chat/history/${documentId}`),
  sendMessage: (documentId, message) => api.post('/chat/message', {
    document_id: documentId,
    message,
  }),
  clearHistory: (documentId) => api.delete(`/chat/history/${documentId}`),
};

export default api;
