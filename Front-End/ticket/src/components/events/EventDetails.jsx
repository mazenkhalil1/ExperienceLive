import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../services/axiosConfig';
import { showToast } from '../shared/Toast';
import Loader from '../shared/Loader';
import { useUser } from '../../context/UserContext';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useUser();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      const response = await axiosInstance.get(`/events/${id}`);
      if (response.data.success) {
        setEvent(response.data.data);
      } else {
        throw new Error('Failed to fetch event details');
      }
    } catch (err) {
      console.error('Error fetching event details:', err);
      setError(err.response?.data?.message || 'Failed to load event details');
      showToast.error('Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className="text-center text-red-500 py-8">{error}</div>;
  if (!event) return <div className="text-center py-8">Event not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Event Image */}
        <div className="relative h-96">
          <img
            src={event.image || 'https://via.placeholder.com/1200x400'}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Event Details */}
        <div className="p-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
              <p className="text-gray-600 text-lg mb-6">{event.description}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-600 mb-2">
                EGP {event.price}
              </div>
              {event.remainingTickets > 0 ? (
                <div className="text-sm text-gray-500">
                  {event.remainingTickets} tickets remaining
                </div>
              ) : (
                <div className="text-sm text-red-500">Sold Out</div>
              )}
            </div>
          </div>

          {/* Event Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Event Details</h2>
              <div className="space-y-4">
                <div>
                  <span className="font-medium">Date & Time:</span>
                  <div className="text-gray-600">
                    {new Date(event.date).toLocaleString()}
                  </div>
                </div>
                <div>
                  <span className="font-medium">Location:</span>
                  <div className="text-gray-600">{event.location}</div>
                </div>
                <div>
                  <span className="font-medium">Category:</span>
                  <div className="text-gray-600">{event.category}</div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Organizer</h2>
              <div className="space-y-4">
                <div>
                  <span className="font-medium">Organized by:</span>
                  <div className="text-gray-600">{event.organizer?.name}</div>
                </div>
                <div>
                  <span className="font-medium">Contact:</span>
                  <div className="text-gray-600">{event.organizer?.email}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-end gap-4">
            {isAuthenticated ? (
              <>
                {event.remainingTickets > 0 && (
                  <button
                    onClick={() => navigate(`/booking/${event._id}`)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Book Now
                  </button>
                )}
              </>
            ) : (
              <button
                onClick={() => navigate('/login', { state: { from: `/events/${id}` } })}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Login to Book
              </button>
          )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails; 