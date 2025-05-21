import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Loader from '../Loader';
import BookTicketForm from './BookTicketForm';

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/events/${id}`);
      setEvent(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch event details');
      console.error('Error fetching event details:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    if (!isAuthenticated) {
      toast.info('Please login to book tickets');
      navigate('/login', { state: { from: `/events/${id}` } });
      return;
    }
    setShowBookingForm(true);
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  if (!event) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Event Header */}
      <div className="relative h-96 rounded-lg overflow-hidden mb-8">
        <img
          src={event.image || 'https://via.placeholder.com/1200x400'}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
            <div className="flex items-center space-x-4 text-sm">
              <span>{new Date(event.date).toLocaleDateString()}</span>
              <span>•</span>
              <span>{event.location}</span>
              <span>•</span>
              <span>{event.category}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Event Details */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">About This Event</h2>
            <p className="text-gray-600 whitespace-pre-line">{event.description}</p>

            {/* Event Details Grid */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Date & Time</h3>
                <p className="text-gray-600">
                  {new Date(event.date).toLocaleString()}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Location</h3>
                <p className="text-gray-600">{event.location}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Category</h3>
                <p className="text-gray-600">{event.category}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Price</h3>
                <p className="text-gray-600">
                  {event.price === 0 ? 'Free' : `$${event.price.toFixed(2)}`}
                </p>
              </div>
            </div>

            {/* Organizer Info */}
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">Organizer</h3>
              <div className="flex items-center">
                <img
                  src={event.organizer.avatar || 'https://via.placeholder.com/64'}
                  alt={event.organizer.name}
                  className="h-16 w-16 rounded-full"
                />
                <div className="ml-4">
                  <p className="text-lg font-medium">{event.organizer.name}</p>
                  <p className="text-gray-600">{event.organizer.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
            {showBookingForm ? (
              <BookTicketForm
                event={event}
                onCancel={() => setShowBookingForm(false)}
              />
            ) : (
              <div>
                <div className="mb-4">
                  <p className="text-2xl font-bold text-gray-900">
                    {event.price === 0 ? 'Free' : `$${event.price.toFixed(2)}`}
                  </p>
                  <p className="text-sm text-gray-600">
                    {event.remainingTickets} tickets remaining
                  </p>
                </div>
                <button
                  onClick={handleBookNow}
                  className="w-full btn-primary"
                  disabled={event.remainingTickets === 0}
                >
                  {event.remainingTickets === 0 ? 'Sold Out' : 'Book Now'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 