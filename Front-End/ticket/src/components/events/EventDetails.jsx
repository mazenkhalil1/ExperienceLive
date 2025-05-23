import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../services/axiosConfig';
import { showToast } from '../shared/Toast';
import Loader from '../shared/Loader';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ticketCount, setTicketCount] = useState(1);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchEventDetails = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`/events/${id}`);
      if (!response.data || !response.data.data) {
        throw new Error('Event not found');
      }
      setEvent(response.data.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching event details:', err);
      setError(err.response?.data?.message || 'Failed to fetch event details');
      showToast.error(err.response?.data?.message || 'Failed to fetch event details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const checkAuthStatus = useCallback(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  useEffect(() => {
    fetchEventDetails();
    checkAuthStatus();
  }, [fetchEventDetails, checkAuthStatus]);

  const handleBooking = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { redirect: `/events/${id}` } });
      return;
    }

    if (ticketCount < 1 || ticketCount > event.availableTickets) {
      showToast.error('Invalid ticket count');
      return;
    }

    setBookingLoading(true);
    try {
      const response = await axiosInstance.post(`/events/${id}/book`, {
        numberOfTickets: ticketCount
      });

      showToast.success('Tickets booked successfully!');
      // Update the event details to reflect the new available tickets
      setEvent(prev => ({
        ...prev,
        availableTickets: prev.availableTickets - ticketCount
      }));
      
      // Reset ticket count after successful booking
      setTicketCount(1);
      
      // Navigate to bookings page after successful booking
      navigate('/bookings');
    } catch (err) {
      console.error('Error booking tickets:', err);
      showToast.error(err.response?.data?.message || 'Failed to book tickets');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Loader />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || 'Event not found'}
        </div>
        <button
          onClick={() => navigate('/events')}
          className="mt-4 text-blue-600 hover:text-blue-800"
        >
          ← Back to Events
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/events')}
        className="mb-6 text-blue-600 hover:text-blue-800 flex items-center"
      >
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Events
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {event.image && (
          <div className="w-full h-64 md:h-96 bg-gray-200">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Event Information */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Event Details</h2>
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>${event.price} per ticket</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                    <span>{event.availableTickets} tickets available</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span className="capitalize">{event.category}</span>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <p className="text-gray-600 whitespace-pre-line">{event.description}</p>
              </div>
            </div>

            {/* Booking Form */}
            {isAuthenticated && event.availableTickets > 0 && (
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Book Tickets</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Number of Tickets</label>
                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={() => setTicketCount(prev => Math.max(1, prev - 1))}
                        className="bg-gray-200 text-gray-600 hover:bg-gray-300 px-3 py-2 rounded-l"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        max={event.availableTickets}
                        value={ticketCount}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (!isNaN(value)) {
                            setTicketCount(Math.min(Math.max(1, value), event.availableTickets));
                          }
                        }}
                        className="w-20 text-center p-2 border-t border-b"
                      />
                      <button
                        type="button"
                        onClick={() => setTicketCount(prev => Math.min(event.availableTickets, prev + 1))}
                        className="bg-gray-200 text-gray-600 hover:bg-gray-300 px-3 py-2 rounded-r"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="text-gray-600">
                    Total Price: ${(event.price * ticketCount).toFixed(2)}
                  </div>
                  <button
                    onClick={handleBooking}
                    disabled={bookingLoading || ticketCount < 1 || ticketCount > event.availableTickets}
                    className={`w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors
                      ${(bookingLoading || ticketCount < 1 || ticketCount > event.availableTickets) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {bookingLoading ? 'Booking...' : 'Book Now'}
                  </button>
                </div>
              </div>
            )}

            {/* Not authenticated message */}
            {!isAuthenticated && (
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Want to Book?</h2>
                <p className="text-gray-600 mb-4">Please log in to book tickets for this event.</p>
                <button
                  onClick={() => navigate('/login', { state: { redirect: `/events/${id}` } })}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Log In to Book
                </button>
              </div>
            )}

            {/* Sold out message */}
            {isAuthenticated && event.availableTickets === 0 && (
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-red-600 mb-4">Sold Out</h2>
                <p className="text-gray-600">
                  Sorry, all tickets for this event have been sold. Please check back later or explore other events.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails; 