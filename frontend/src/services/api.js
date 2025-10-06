import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
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
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
  changePassword: (passwordData) => api.put('/auth/change-password', passwordData),
  logout: () => api.post('/auth/logout'),
};

// Books API
export const booksAPI = {
  getBooks: (params) => api.get('/books', { params }),
  getBook: (id) => api.get(`/books/${id}`),
  getFeatured: () => api.get('/books/featured'),
  getBestsellers: () => api.get('/books/bestsellers'),
  getNewReleases: () => api.get('/books/new-releases'),
  getCategories: () => api.get('/books/categories'),
  getAuthors: () => api.get('/books/authors'),
  getFilterStats: () => api.get('/books/filter-stats'),
  search: (query, params) => api.get('/books/search', { params: { q: query, ...params } }),
  createBook: (bookData) => api.post('/books', bookData),
  updateBook: (id, bookData) => api.put(`/books/${id}`, bookData),
  deleteBook: (id) => api.delete(`/books/${id}`),
  getLowStockBooks: () => api.get('/books/low-stock'),
  // Legacy aliases for backward compatibility
  getAll: (params) => api.get('/books', { params }),
  getById: (id) => api.get(`/books/${id}`),
  create: (bookData) => api.post('/books', bookData),
  update: (id, bookData) => api.put(`/books/${id}`, bookData),
  delete: (id) => api.delete(`/books/${id}`),
};

// Cart API
export const cartAPI = {
  get: () => api.get('/users/cart'),
  addItem: (bookId, quantity) => api.post('/users/cart', { bookId, quantity }),
  updateItem: (bookId, quantity) => api.put(`/users/cart/${bookId}`, { quantity }),
  removeItem: (bookId) => api.delete(`/users/cart/${bookId}`),
  clear: () => api.delete('/users/cart'),
};

// Wishlist API
export const wishlistAPI = {
  get: () => api.get('/users/wishlist'),
  addItem: (bookId) => api.post('/users/wishlist', { bookId }),
  removeItem: (bookId) => api.delete(`/users/wishlist/${bookId}`),
};

// Orders API
export const ordersAPI = {
  createOrder: (orderData) => api.post('/orders', orderData),
  create: (orderData) => api.post('/orders', orderData),
  getMyOrders: (params) => api.get('/orders', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  cancel: (id) => api.put(`/orders/${id}/cancel`),
  getAll: (params) => api.get('/orders/admin/all', { params }),
  updateStatus: (id, statusData) => api.put(`/orders/${id}/status`, statusData),
  getStats: () => api.get('/admin/stats'),
  getRecentOrders: () => api.get('/admin/orders/recent'),
};

// Admin API
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getRecentOrders: () => api.get('/admin/orders/recent'),
  getLoginStats: () => api.get('/admin/login-stats'),
};

// Reviews API
export const reviewsAPI = {
  getBookReviews: (bookId, params) => api.get(`/reviews/${bookId}`, { params }),
  addReview: (bookId, reviewData) => api.post(`/reviews/${bookId}`, reviewData),
  updateReview: (bookId, reviewData) => api.put(`/reviews/${bookId}`, reviewData),
  deleteReview: (bookId) => api.delete(`/reviews/${bookId}`),
  getMyReviews: (params) => api.get('/reviews/user/my-reviews', { params }),
};

// Users API (Admin)
export const usersAPI = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  updateRole: (id, roleData) => api.put(`/users/${id}/role`, roleData),
  updateUserRole: (id, role) => api.put(`/users/${id}/role`, { role }),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

export default api; 