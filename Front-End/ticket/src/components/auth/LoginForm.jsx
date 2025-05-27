import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import axiosInstance from '../../services/axiosConfig';
import { toast } from 'react-toastify';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';
import { ROUTES } from '../../constants/routes';

function LoginForm({ openRegisterModal }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login } = useUser();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // Add effect to handle Escape key press
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        navigate(-1); // Navigate back on Escape key press
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [navigate]); // Add navigate to dependencies

  // Read email from location state and pre-fill if available
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location.state?.email]); // Add location.state?.email to dependencies

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      // Perform the login authentication
      console.log('Attempting login...');
      const response = await axiosInstance.post('/login', { email, password });

      console.log('Login successful:', response.data);
      
      // Check if MFA is required
      if (response.data.mfaRequired) {
        console.log('MFA is required. Redirecting to MFA prompt.');
        // Store userId for MFA verification step
        localStorage.setItem('userId', response.data.userId);
        toast.info('MFA required. Please enter the code sent to your email.');
        navigate(ROUTES.MFA_PROMPT);
      } else {
        // Standard login successful
        console.log('Standard login successful.');
        // Extract user data and token from the response
        const userData = response.data.user; // Assuming user data is in response.data.user
        const token = response.data.token; // Assuming token is in response.data.token

        // Pass the complete user data and token to the login function from UserContext
        login(userData, token);

        // Clear any previous errors on success
        setError(null);

        toast.success('Login successful!');
        
        // Redirect to the home page
        navigate(ROUTES.HOME);
      }

    } catch (err) {
      console.error('Login failed:', err);
      setError(err.response?.data?.message || 'Failed to login');
      toast.error(err.response?.data?.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 flex items-center justify-center z-50"
    >
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
      <div className={`relative max-w-md w-full mx-4 p-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl z-10`}>
        <h2 className={`text-2xl font-bold mb-6 text-center ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={`mt-1 block w-full px-3 py-2 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-black'} rounded-lg shadow-sm focus:outline-none ${isDarkMode ? 'focus:ring-blue-500 focus:border-blue-500' : 'focus:ring-yellow-500 focus:border-yellow-500'} transition-colors duration-200`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={`mt-1 block w-full px-3 py-2 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-black'} rounded-lg shadow-sm focus:outline-none ${isDarkMode ? 'focus:ring-blue-500 focus:border-blue-500' : 'focus:ring-yellow-500 focus:border-yellow-500'} transition-colors duration-200`}
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200`}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </div>
          <div className="text-center">
            <Link 
              to="/register"
              className={`text-sm ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'} transition-colors duration-200`}
            >
              Don't have an account? Register
            </Link>
          </div>
          <div className="text-center">
            <Link 
              to="/forget-password" 
              className={`text-sm ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'} transition-colors duration-200`}
            >
              Forgot Password?
            </Link>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

export default LoginForm;
