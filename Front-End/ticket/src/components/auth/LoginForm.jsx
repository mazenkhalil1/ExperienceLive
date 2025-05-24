import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import axiosInstance from '../../services/axiosConfig';
import { toast } from 'react-toastify';
import { useTheme } from '../../context/ThemeContext';

function LoginForm({ closeModal, openRegisterModal }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login } = useUser();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      // Perform the login authentication
      const response = await axiosInstance.post('/login', { email, password });

      // Extract user data from the response
      const userData = response.data.user; // Assuming user data is in response.data.user
      const token = response.data.token; // Assuming token is in response.data.token

      // Pass the complete user data and token to the login function from UserContext
      login(userData, token);

      toast.success('Login successful!');
      closeModal();
      navigate('/');

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login');
      toast.error(err.response?.data?.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={`mt-1 block w-full px-3 py-2 border ${isDarkMode ? 'border-gray-600 dark:bg-gray-700 dark:text-white' : 'border-gray-300 bg-white text-black'} rounded-md shadow-sm focus:outline-none ${isDarkMode ? 'focus:ring-blue-500 focus:border-blue-500' : 'focus:ring-yellow-500 focus:border-yellow-500'}`}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={`mt-1 block w-full px-3 py-2 border ${isDarkMode ? 'border-gray-600 dark:bg-gray-700 dark:text-white' : 'border-gray-300 bg-white text-black'} rounded-md shadow-sm focus:outline-none ${isDarkMode ? 'focus:ring-blue-500 focus:border-blue-500' : 'focus:ring-yellow-500 focus:border-yellow-500'}`}
          />
        </div>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200`}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </div>
        <div className="text-center">
          <button type="button" onClick={openRegisterModal} className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300">Don't have an account? Register</button>
        </div>
        <div className="text-center">
          <Link to="/forget-password" onClick={closeModal} className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300">Forgot Password?</Link>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
