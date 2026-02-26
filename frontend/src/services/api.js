import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
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
    (error) => Promise.reject(error)
);

// Response interceptor for error handling
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
    logout: () => api.post('/auth/logout'),
    getMe: () => api.get('/auth/me')
};

// Genre API
export const genreAPI = {
    getAll: () => api.get('/genres'),
    getById: (id) => api.get(`/genres/${id}`),
    create: (data) => api.post('/genres', data),
    update: (id, data) => api.put(`/genres/${id}`, data),
    delete: (id) => api.delete(`/genres/${id}`)
};

// Book API
export const bookAPI = {
    getAll: (params) => api.get('/books', { params }),
    getById: (id) => api.get(`/books/${id}`),
    getByGenre: (genreId) => api.get(`/books/genre/${genreId}`),
    getMyBooks: () => api.get('/books/writer/my-books'),
    create: (data) => api.post('/books', data),
    update: (id, data) => api.put(`/books/${id}`, data),
    delete: (id) => api.delete(`/books/${id}`),
    incrementView: (id) => api.post(`/books/${id}/view`)
};

// Chapter API
export const chapterAPI = {
    getByBook: (bookId) => api.get(`/chapters/book/${bookId}`),
    getById: (id) => api.get(`/chapters/${id}`),
    create: (data) => api.post('/chapters', data),
    update: (id, data) => api.put(`/chapters/${id}`, data),
    delete: (id) => api.delete(`/chapters/${id}`)
};

// Comment API
export const commentAPI = {
    getByBook: (bookId) => api.get(`/comments/book/${bookId}`),
    create: (data) => api.post('/comments', data),
    delete: (id) => api.delete(`/comments/${id}`),
    likeBook: (id) => api.post(`/comments/books/${id}/like`),
    unlikeBook: (id) => api.delete(`/comments/books/${id}/unlike`),
    getLikeStatus: (id) => api.get(`/comments/books/${id}/like-status`)
};

// Library API
export const libraryAPI = {
    getLibrary: () => api.get('/library'),
    checkInLibrary: (bookId) => api.get(`/library/check/${bookId}`),
    addToLibrary: (bookId) => api.post(`/library/${bookId}`),
    removeFromLibrary: (bookId) => api.delete(`/library/${bookId}`),
    updateProgress: (data) => api.post('/library/reading-progress', data),
    getProgress: (bookId) => api.get(`/library/reading-progress/${bookId}`)
};

// Admin API
export const adminAPI = {
    getUsers: () => api.get('/admin/users'),
    updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
    deleteUser: (id) => api.delete(`/admin/users/${id}`),
    getStats: () => api.get('/admin/stats')
};

export default api;
