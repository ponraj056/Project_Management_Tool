import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
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
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getMe: () => api.get('/auth/me'),
};

// Projects API
export const projectsAPI = {
    getAll: () => api.get('/projects'),
    getById: (id) => api.get(`/projects/${id}`),
    create: (data) => api.post('/projects', data),
    update: (id, data) => api.put(`/projects/${id}`, data),
    delete: (id) => api.delete(`/projects/${id}`),
    getAnalytics: (id) => api.get(`/projects/${id}/analytics`),
};

// Tasks API
export const tasksAPI = {
    getByProject: (projectId) => api.get(`/tasks/projects/${projectId}/tasks`),
    getById: (id) => api.get(`/tasks/${id}`),
    create: (projectId, data) => api.post(`/tasks/projects/${projectId}/tasks`, data),
    update: (id, data) => api.put(`/tasks/${id}`, data),
    updateStatus: (id, status) => api.patch(`/tasks/${id}/status`, { status }),
    assign: (id, userId) => api.patch(`/tasks/${id}/assign`, { userId }),
    delete: (id) => api.delete(`/tasks/${id}`),
};

// Comments API
export const commentsAPI = {
    getByTask: (taskId) => api.get(`/comments/tasks/${taskId}/comments`),
    create: (taskId, message) => api.post(`/comments/tasks/${taskId}/comments`, { message }),
    update: (id, message) => api.put(`/comments/${id}`, { message }),
    delete: (id) => api.delete(`/comments/${id}`),
};

export default api;
