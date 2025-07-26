import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

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
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
            refreshToken,
          });

          const { accessToken, refreshToken: newRefreshToken } = response.data.data;
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),
  
  register: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
  }) => api.post('/auth/register', userData),
  
  getProfile: () => api.get('/auth/profile'),
  
  updateProfile: (data: FormData) => api.put('/auth/profile', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  
  changePassword: (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => api.post('/auth/change-password', data),
  
  logout: () => api.post('/auth/logout'),
};

// Products API
export const productsAPI = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    sort?: string;
    order?: string;
    search?: string;
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    featured?: boolean;
  }) => api.get('/products', { params }),
  
  getById: (id: string) => api.get(`/products/${id}`),
  
  getFeatured: (limit?: number) => api.get('/products/featured', {
    params: { limit }
  }),
  
  getByCategory: (categoryName: string, params?: {
    page?: number;
    limit?: number;
    sort?: string;
    order?: string;
  }) => api.get(`/products/${categoryName}`, { params }),
  
  search: (query: string, params?: {
    page?: number;
    limit?: number;
  }) => api.get('/products/search', { params: { q: query, ...params } }),
  
  create: (data: FormData) => api.post('/products', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  
  update: (id: string, data: FormData) => api.put(`/products/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  
  delete: (id: string) => api.delete(`/products/${id}`),
  
  getStats: () => api.get('/products/admin/stats'),
};

// Categories API
export const categoriesAPI = {
  getAll: (status?: string) => api.get('/categories', {
    params: { status }
  }),
  
  create: (data: { name: string; description?: string; image?: string }) =>
    api.post('/categories', data),
  
  update: (id: string, data: { name?: string; description?: string; image?: string; status?: string }) =>
    api.put(`/categories/${id}`, data),
  
  delete: (id: string) => api.delete(`/categories/${id}`),
  
  getStats: () => api.get('/categories/stats'),
};

// Cart API
export const cartAPI = {
  get: () => api.get('/cart'),
  
  add: (data: { productId: string; quantity: number }) =>
    api.post('/cart/add', data),
  
  update: (productId: string, data: { quantity: number }) =>
    api.put(`/cart/item/${productId}`, data),
  
  remove: (productId: string) => api.delete(`/cart/item/${productId}`),
  
  clear: () => api.delete('/cart/clear'),
};

// Orders API
export const ordersAPI = {
  create: (data: {
    items: { productId: string; quantity: number }[];
    shippingAddress: {
      firstName: string;
      lastName: string;
      address: string;
      city: string;
      postalCode: string;
      phone: string;
    };
    paymentMethod: string;
    notes?: string;
  }) => api.post('/orders', data),
  
  getMyOrders: (params?: {
    page?: number;
    limit?: number;
    orderStatus?: string;
  }) => api.get('/orders/my-orders', { params }),
  
  getById: (id: string) => api.get(`/orders/${id}`),
  
  getAll: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    orderStatus?: string;
    paymentStatus?: string;
    userId?: string;
  }) => api.get('/orders', { params }),
  
  updateStatus: (id: string, data: {
    orderStatus?: string;
    paymentStatus?: string;
  }) => api.put(`/orders/${id}/status`, data),
  
  getStats: () => api.get('/orders/admin/stats'),
};

// Users API (Admin only)
export const usersAPI = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    role?: string;
    status?: string;
    search?: string;
  }) => api.get('/users', { params }),
  
  getById: (id: string) => api.get(`/users/${id}`),
  
  updateStatus: (id: string, data: { status: string }) =>
    api.put(`/users/${id}/status`, data),
  
  getStats: () => api.get('/users/stats'),
};

// Contact API
export const contactAPI = {
  send: (data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) => api.post('/contact', data),
  
  getInfo: () => api.get('/contact/info'),
};

export default api;