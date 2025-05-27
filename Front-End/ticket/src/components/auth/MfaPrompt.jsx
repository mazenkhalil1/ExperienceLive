import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ROUTES } from '../../constants/routes';
import axiosInstance from '../../services/axiosConfig'; // axios instance
import axios from 'axios'; // for direct send-otp request
import { toast } from 'react-toastify';

const MfaPrompt = () => {
  const [inputCode, setInputCode] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId');

  // Send OTP when component mounts
  useEffect(() => {
    const sendOtp = async () => {
      if (!userId) return;

      try {
        await axios.post('/auth/send-otp', { userId });
        setMessage('OTP sent to your email.');
      } catch (err) {
        console.error('Failed to send OTP:', err);
        setMessage('Failed to send OTP. Try again.');
      }
    };

    sendOtp();
  }, [userId]);

  const handleInputChange = (e) => {
    setInputCode(e.target.value);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!userId) {
      const msg = 'User ID not found. Try logging in again.';
      setError(msg);
      toast.error(msg);
      setIsLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post('/auth/verify-otp', {
        userId,
        otp: inputCode,
      });

      if (response.data.success) {
        toast.success('MFA verified!');
        localStorage.removeItem('userId');
        navigate(ROUTES.HOME);
      } else {
        setError(response.data.message || 'Invalid code.');
        toast.error(response.data.message || 'Invalid code.');
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError(err.response?.data?.message || 'Verification failed.');
      toast.error(err.response?.data?.message || 'Verification failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900"
    >
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-sm text-center">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Enter MFA Code</h2>
        {message && <p className="text-green-600 dark:text-green-400 mb-4 text-sm">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            id="mfaCode"
            name="mfaCode"
            maxLength="6"
            value={inputCode}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Enter 6-digit code"
            required
          />
          {error && <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-700 dark:hover:bg-blue-600 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Verifying...' : 'Verify Code'}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default MfaPrompt;
