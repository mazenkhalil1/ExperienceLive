import React, { createContext, useContext, useState, useEffect } from 'react';
import { isAuthenticated, getToken, clearAuth } from '../services/axiosConfig';
import axiosInstance from '../services/axiosConfig';
import { showToast } from '../components/shared/Toast';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Initialize user from localStorage if available
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    if (isAuthenticated()) {
      try {
        const response = await axiosInstance.get('/users/profile');
        const userData = response.data.data;
        
        // Preserve the role from localStorage if it exists
        const savedRole = localStorage.getItem('userRole');
        const updatedUser = {
          ...userData,
          role: savedRole || userData.role
        };
        
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } catch (error) {
        console.error('Error fetching user profile:', error);
        await handleLogout();
      }
    } else {
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = (userData) => {
    // Store complete user data including role
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('userRole', userData.role);
  };

  const handleLogout = async () => {
    try {
      // Call the backend logout endpoint
      await axiosInstance.get('/logOut', { withCredentials: true });
      
      // Clear all auth-related data
      clearAuth(); // Clears token
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
      
      showToast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      showToast.error('Error during logout. Please try again.');
      
      // Still clear local data even if API call fails
      clearAuth();
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout: handleLogout,
    refreshUser: fetchUser,
    userRole: user?.role || localStorage.getItem('userRole')
  };

  return (
    <UserContext.Provider value={value}>
      {!isLoading && children}
    </UserContext.Provider>
  );
};

export default UserContext; 