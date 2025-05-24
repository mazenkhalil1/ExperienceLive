import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { showToast } from '../shared/Toast';
import Loader from '../shared/Loader';
import axiosInstance from '../../services/axiosConfig';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';

const RegisterForm = ({ closeModal, openLoginModal }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user'
  });
  const [errors, setErrors] = useState({});
  const { isDarkMode } = useTheme();

  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters long';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast.error('Please fix the errors in the form');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosInstance.post('/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });

      if (response.data) {
        showToast.success('Registration successful! Please login.');
        closeModal();
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      showToast.error(errorMessage);
      
      // Handle specific error cases
      if (error.response?.status === 409) {
        setErrors(prev => ({
          ...prev,
          email: 'Email already exists'
        }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <Loader type="spinner" text="Creating your account..." />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="transition-colors duration-200">
      <div className={`max-w-md w-full space-y-8 p-10 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg z-10 transition-colors duration-200`}>
        <h2 className={`mt-6 text-center text-3xl font-extrabold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>
          Create an Account
        </h2>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="name" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1 transition-colors duration-200`}>
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={isLoading}
              className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${errors.name ? 'border-red-500' : isDarkMode ? 'border-gray-600 placeholder-gray-500 text-white bg-gray-700' : 'border-gray-300 placeholder-gray-500 text-gray-900 bg-white'} focus:outline-none ${isDarkMode ? 'focus:ring-blue-500 focus:border-blue-500' : 'focus:ring-yellow-500 focus:border-yellow-500'} focus:z-10 sm:text-sm transition-colors duration-200`}
              placeholder="Enter your name"
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1 transition-colors duration-200`}>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isLoading}
              className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${errors.email ? 'border-red-500' : isDarkMode ? 'border-gray-600 placeholder-gray-500 text-white bg-gray-700' : 'border-gray-300 placeholder-gray-500 text-gray-900 bg-white'} focus:outline-none ${isDarkMode ? 'focus:ring-blue-500 focus:border-blue-500' : 'focus:ring-yellow-500 focus:border-yellow-500'} focus:z-10 sm:text-sm transition-colors duration-200`}
              placeholder="Enter your email"
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1 transition-colors duration-200`}>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isLoading}
              className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${errors.password ? 'border-red-500' : isDarkMode ? 'border-gray-600 placeholder-gray-500 text-white bg-gray-700' : 'border-gray-300 placeholder-gray-500 text-gray-900 bg-white'} focus:outline-none ${isDarkMode ? 'focus:ring-blue-500 focus:border-blue-500' : 'focus:ring-yellow-500 focus:border-yellow-500'} focus:z-10 sm:text-sm transition-colors duration-200`}
              placeholder="Enter your password"
            />
            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
          </div>

          <div>
            <label htmlFor="confirmPassword" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1 transition-colors duration-200`}>
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={isLoading}
              className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${errors.confirmPassword ? 'border-red-500' : isDarkMode ? 'border-gray-600 placeholder-gray-500 text-white bg-gray-700' : 'border-gray-300 placeholder-gray-500 text-gray-900 bg-white'} focus:outline-none ${isDarkMode ? 'focus:ring-blue-500 focus:border-blue-500' : 'focus:ring-yellow-500 focus:border-yellow-500'} focus:z-10 sm:text-sm transition-colors duration-200`}
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
          </div>

          <div>
            <label htmlFor="role" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1 transition-colors duration-200`}>
              Register as
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              disabled={isLoading}
              className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${isDarkMode ? 'border-gray-600 placeholder-gray-500 text-white bg-gray-700' : 'border-gray-300 placeholder-gray-500 text-gray-900 bg-white'} focus:outline-none ${isDarkMode ? 'focus:ring-blue-500 focus:border-blue-500' : 'focus:ring-yellow-500 focus:border-yellow-500'} focus:z-10 sm:text-sm transition-colors duration-200`}
            >
              <option value="user">User</option>
              <option value="organizer">Organizer</option>
            </select>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-full text-white ${isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}`}
            >
              {isLoading ? 'Creating Account...' : 'Register'}
            </button>
          </div>
        </form>

        <div className={`text-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-6 transition-colors duration-200`}>
          Already have an account?{' '}
          <button
            onClick={() => {
              closeModal();
              openLoginModal();
            }}
            className={`font-medium ${isDarkMode ? 'text-blue-600 hover:text-blue-500' : 'text-blue-600 hover:text-blue-800'} transition-colors duration-200`}
          >
            Login here
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default RegisterForm;
