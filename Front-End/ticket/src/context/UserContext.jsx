import React, { createContext, useContext, useState, useEffect } from 'react';
import { isAuthenticated, getToken, clearAuth } from '../services/axiosConfig';
import axiosInstance from '../services/axiosConfig';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    if (isAuthenticated()) {
      try {
        const response = await axiosInstance.get('/profile');
        setUser(response.data.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        clearAuth();
        setUser(null);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    clearAuth();
    setUser(null);
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    refreshUser: fetchUser
  };

  return (
    <UserContext.Provider value={value}>
      {!isLoading && children}
    </UserContext.Provider>
  );
};

export default UserContext; 