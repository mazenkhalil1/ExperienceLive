import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Configure axios defaults
axios.defaults.withCredentials = true;

// Add request interceptor to include token in headers
axios.interceptors.request.use(
  (config) => {
    // Debug: Log all cookies
    console.log('🍪 All cookies:', document.cookie);
    
    // Get token from cookies
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];

    console.log('🔑 Extracted token:', token ? 'exists' : 'not found');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('📤 Setting Authorization header:', config.headers.Authorization);
    } else {
      console.log('⚠️ No token found in cookies');
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Axios interceptor error:', error);
    return Promise.reject(error);
  }
);

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchUser = async () => {
    try {
      console.log('🔄 Fetching user profile...');
      const res = await axios.get('http://localhost:5000/api/v1/users/profile');
      
      console.log('✅ Profile response:', res.data);
      
      // Update to match the backend response structure
      setUser(res.data.data);
      setIsAuthenticated(true);
      setError(null);
    } catch (err) {
      console.error('❌ Profile fetch error:', {
        status: err.response?.status,
        message: err.response?.data?.message || err.message,
        headers: err.config?.headers
      });
      setUser(null);
      setIsAuthenticated(false);
      setError(err.response?.data?.message || 'Error fetching user data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated,
    logout,
    refreshUser: fetchUser
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 