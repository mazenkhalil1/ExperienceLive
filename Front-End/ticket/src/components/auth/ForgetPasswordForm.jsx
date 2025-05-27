import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import axiosInstance from '../../services/axiosConfig';

function ForgetPasswordForm() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1); // 1: Email entry, 2: OTP verification
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await axiosInstance.put('/api/v1/forgetPassword', { email });
      setMessage('OTP sent successfully. Please check your email and enter the OTP below.');
      setStep(2);
      console.log('OTP request success:', res.data);
    } catch (err) {
      console.error('OTP request error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      const res = await axiosInstance.put('/api/v1/resetPassword', {
        email,
        otp,
        newPassword
      });
      
      setMessage('Password reset successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error('Password reset error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
    }
  };

  return (
    <div className="max-w-sm mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">Reset Password</h2>
      
      {message && (
        <div className="p-3 mb-4 bg-green-100 text-green-800 rounded-md">
          {message}
        </div>
      )}

      {error && (
        <div className="p-3 mb-4 bg-red-100 text-red-800 rounded-md">
          {error}
        </div>
      )}

      {step === 1 ? (
        <form onSubmit={handleRequestOTP} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={`mt-1 block w-full px-3 py-2 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-black'} rounded-md shadow-sm focus:outline-none ${isDarkMode ? 'focus:ring-blue-500 focus:border-blue-500' : 'focus:ring-yellow-500 focus:border-yellow-500'}`}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200`}
          >
            {loading ? 'Requesting...' : 'Request OTP'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className="space-y-6">
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Enter OTP</label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              placeholder="Enter the 6-digit OTP"
              className={`mt-1 block w-full px-3 py-2 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-black'} rounded-md shadow-sm focus:outline-none ${isDarkMode ? 'focus:ring-blue-500 focus:border-blue-500' : 'focus:ring-yellow-500 focus:border-yellow-500'}`}
            />
          </div>
          
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              placeholder="Enter new password (min. 6 characters)"
              className={`mt-1 block w-full px-3 py-2 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-black'} rounded-md shadow-sm focus:outline-none ${isDarkMode ? 'focus:ring-blue-500 focus:border-blue-500' : 'focus:ring-yellow-500 focus:border-yellow-500'}`}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200`}
          >
            Reset Password
          </button>
        </form>
      )}
      
      <div className="mt-6 text-center">
        <button 
          onClick={() => navigate('/login')} 
          className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}

export default ForgetPasswordForm;
