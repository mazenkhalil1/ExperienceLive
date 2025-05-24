import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../services/axiosConfig';
import { showToast } from '../shared/Toast';
import Loader from '../shared/Loader';

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await axiosInstance.get(`/bookings/${id}`);
        setBooking(response.data.data);
      } catch (error) {
        console.error('Error fetching booking details:', error);
        setError(error.response?.data?.message || 'Failed to fetch booking details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingDetails();
  }, [id]);

  const handleCancelBooking = async () => {
    try {
      await axiosInstance.delete(`/bookings/${id}`);
      showToast.success('Booking cancelled successfully');
      navigate('/bookings');
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

  if (!booking) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold text-gray-600">
          Booking not found
        </h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Booking Details
          </h1>

          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {booking.event.title}
              </h2>
              <p className="text-gray-600">
                Date: {new Date(booking.event.date).toLocaleDateString()}
              </p>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-semibold mb-2">Booking Information</h3>
              <p className="text-gray-600">Booking ID: {booking._id}</p>
              <p className="text-gray-600">Status: {booking.status}</p>
              <p className="text-gray-600">Quantity: {booking.quantity} tickets</p>
              <p className="text-gray-600">
                Total Price: ${(booking.quantity * booking.event.price).toFixed(2)}
              </p>
              <p className="text-gray-600">
                Booked on: {new Date(booking.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-semibold mb-2">Event Details</h3>
              <p className="text-gray-600">Venue: {booking.event.venue}</p>
              <p className="text-gray-600">
                Time: {new Date(booking.event.date).toLocaleTimeString()}
              </p>
              <p className="text-gray-600">
                Price per ticket: ${booking.event.price}
              </p>
            </div>

            {booking.status === 'Confirmed' && (
              <div className="border-t border-gray-200 pt-4">
                <button
                  onClick={handleCancelBooking}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Cancel Booking
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails; 