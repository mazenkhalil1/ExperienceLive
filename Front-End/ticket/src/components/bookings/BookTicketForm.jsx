import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axiosInstance from '../../services/axiosConfig';
import { showToast } from '../shared/Toast';

const BookTicketForm = ({ event, onBookingComplete }) => {
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const totalPrice = event.price * quantity;
  const maxTickets = event.remainingTickets || 0;

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= maxTickets) {
      setQuantity(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axiosInstance.post('/bookings', {
        eventId: event._id,
        quantity: quantity
      });

      showToast.success('Booking successful!');
      if (onBookingComplete) {
        onBookingComplete(response.data);
      }
      navigate('/bookings');
    } catch (error) {
      console.error('Booking error:', error);
      showToast.error(error.response?.data?.message || 'Failed to book tickets');
    } finally {
      setIsLoading(false);
    }
  };

  if (maxTickets === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg shadow-md"
      >
        Sold Out
      </motion.div>
    );
  }

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Number of Tickets
          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
            (Available: {maxTickets})
          </span>
        </label>
        <div className="relative">
          <input
            type="number"
            min="1"
            max={maxTickets}
            value={quantity}
            onChange={handleQuantityChange}
            className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 
                     dark:bg-gray-700 dark:text-white shadow-sm 
                     focus:border-blue-500 focus:ring-blue-500 
                     dark:focus:border-blue-400 dark:focus:ring-blue-400
                     transition-colors duration-200"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <svg className="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
        </div>
      </div>

      <motion.div 
        className="text-lg font-semibold text-gray-800 dark:text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Total Price: <span className="text-green-600 dark:text-green-400">${totalPrice.toFixed(2)}</span>
      </motion.div>

      <motion.button
        type="submit"
        disabled={isLoading || quantity > maxTickets}
        className={`w-full py-3 px-4 rounded-lg text-white font-medium shadow-lg
          transition-all duration-200
          ${isLoading || quantity > maxTickets 
            ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed' 
            : 'bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600'}`}
        whileHover={!isLoading && quantity <= maxTickets ? { scale: 1.02 } : {}}
        whileTap={!isLoading && quantity <= maxTickets ? { scale: 0.98 } : {}}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <motion.div
              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <span className="ml-2">Booking...</span>
          </div>
        ) : (
          'Book Tickets'
        )}
      </motion.button>
    </motion.form>
  );
};

export default BookTicketForm; 