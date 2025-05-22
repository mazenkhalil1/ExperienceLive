import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ticketCount, setTicketCount] = useState(1);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchEventDetails = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/v1/events/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('token') && {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          })
        }
      });

      if (!response.data || !response.data.data) {
        throw new Error('Event not found');
      }

      setEvent(response.data.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching event details:', err);
      setError(err.response?.data?.message || 'Failed to fetch event details');
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

    try {
      await axios.post('http://localhost:5000/api/v1/bookings', {
        eventId: id,
        ticketCount,
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      navigate('/profile/bookings');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book tickets');
    }
  };

  if (loading) return <div className="text-center py-4">Loading event details...</div>;
  if (error) return <div className="text-center text-red-500 py-4">{error}</div>;
  if (!event) return <div className="text-center py-4">Event not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{event.title}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Event Information */}
          <div className="space-y-4">
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
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-gray-600">{event.description}</p>
            </div>
          </div>

          {/* Booking Form */}
          {isAuthenticated && event.availableTickets > 0 && (
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Book Tickets</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Number of Tickets</label>
                  <input
                    type="number"
                    min="1"
                    max={event.availableTickets}
                    value={ticketCount}
                    onChange={(e) => setTicketCount(Math.min(parseInt(e.target.value), event.availableTickets))}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div className="text-gray-600">
                  Total Price: ${(event.price * ticketCount).toFixed(2)}
                </div>
                <button
                  onClick={handleBooking}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Book Now
                </button>
              </div>
            </div>
          )}

          {!isAuthenticated && (
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-600 mb-4">Please log in to book tickets for this event.</p>
              <button
                onClick={() => navigate('/login', { state: { redirect: `/events/${id}` } })}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Log In to Book
              </button>
            </div>
          )}

          {event.availableTickets === 0 && (
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-red-600 font-semibold">Sorry, this event is sold out!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetails; 