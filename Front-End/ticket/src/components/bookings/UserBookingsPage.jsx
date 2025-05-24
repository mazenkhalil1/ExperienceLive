import React, { useState, useEffect } from 'react';
import axiosInstance from '../../services/axiosConfig';
import { showToast } from '../shared/Toast';
import Loader from '../shared/Loader';

const UserBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = async () => {
    try {
      const response = await axiosInstance.get('/users/bookings');
      // The backend returns the bookings array directly
      setBookings(response.data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError(error.response?.data?.message || 'Failed to fetch bookings');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    try {
      await axiosInstance.delete(`/bookings/${bookingId}`);
      showToast.success('Booking cancelled successfully');
      // Refresh bookings list
      fetchBookings();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      showToast.error(error.response?.data?.message || 'Failed to cancel booking');
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md">
        {error}
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold text-gray-600">
          You haven't made any bookings yet
        </h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
      <div className="space-y-4">
        {bookings.map((booking) => (
          <div
            key={booking._id}
            className="bg-white shadow-md rounded-lg p-6 border border-gray-200"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {booking.event?.title || 'Event Title Not Available'}
                </h3>
                <p className="text-gray-600 mt-2">
                  Quantity: {booking.quantity} tickets
                </p>
                <p className="text-gray-600">
                  Total Price: ${booking.totalPrice?.toFixed(2) || 'N/A'}
                </p>
                <p className="text-gray-600">
                  Status: <span className="font-medium">{booking.status}</span>
                </p>
                {booking.event?.date && (
                  <p className="text-gray-600">
                    Date: {new Date(booking.event.date).toLocaleDateString()}
                  </p>
                )}
                {booking.event?.location && (
                  <p className="text-gray-600">
                    Location: {booking.event.location}
                  </p>
                )}
              </div>
              {booking.status === 'active' && (
                <button
                  onClick={() => handleCancelBooking(booking._id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Cancel Booking
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserBookingsPage; 