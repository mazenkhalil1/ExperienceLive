import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
      <div className="p-4 bg-red-50 text-red-700 rounded-md">
        Sold Out
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Number of Tickets (Available: {maxTickets})
        </label>
        <input
          type="number"
          min="1"
          max={maxTickets}
          value={quantity}
          onChange={handleQuantityChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="text-lg font-semibold">
        Total Price: ${totalPrice.toFixed(2)}
      </div>

      <button
        type="submit"
        disabled={isLoading || quantity > maxTickets}
        className={`w-full py-2 px-4 rounded-md text-white font-medium 
          ${isLoading || quantity > maxTickets 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700'}`}
      >
        {isLoading ? 'Booking...' : 'Book Tickets'}
      </button>
    </form>
  );
};

export default BookTicketForm; 