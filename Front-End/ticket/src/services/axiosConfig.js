import axios from 'axios';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // If token exists, add it to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      // Clear all auth data
      clearAuth();
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
      
      // Only redirect if not already on login page and not trying to logout
      const isLoginPage = window.location.pathname === '/login';
      const isLogoutRequest = error.config.url === '/logOut';
      
      if (!isLoginPage && !isLogoutRequest) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Function to check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  return !!(token && user);
};

// Function to get the current token
export const getToken = () => {
  return localStorage.getItem('token');
};

// Function to clear authentication
export const clearAuth = () => {
  localStorage.removeItem('token');
};

export default axiosInstance; 