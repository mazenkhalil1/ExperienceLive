import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../services/axiosConfig';
import { showToast } from '../shared/Toast';
import Loader from '../shared/Loader';

const EventForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: '',
    price: '',
    totalTickets: '',
    image: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [imagePreview, setImagePreview] = useState('');

  const validateForm = () => {
    const errors = {};
    const now = new Date();
    const eventDate = new Date(formData.date + 'T' + formData.time);

    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.date) errors.date = 'Date is required';
    if (!formData.time) errors.time = 'Time is required';
    if (eventDate <= now) errors.date = 'Event date must be in the future';
    if (!formData.location.trim()) errors.location = 'Location is required';
    if (!formData.category) errors.category = 'Category is required';
    if (!formData.price || formData.price < 0) errors.price = 'Valid price is required';
    if (!formData.totalTickets || formData.totalTickets < 1) {
      errors.totalTickets = 'Minimum 1 ticket required';
    }
    if (!formData.image.trim()) errors.image = 'Image URL is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const fetchEventDetails = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    try {
      const response = await axiosInstance.get(`/events/${id}`);
      const eventData = response.data.data;
      
      // Format date and time from ISO string
      const dateTime = new Date(eventData.date);
      const formattedDate = dateTime.toISOString().split('T')[0];
      const formattedTime = eventData.time || dateTime.toTimeString().slice(0, 5);

      setFormData({
        title: eventData.title,
        description: eventData.description,
        date: formattedDate,
        time: formattedTime,
        location: eventData.location,
        category: eventData.category,
        price: eventData.price,
        totalTickets: eventData.totalTickets,
        image: eventData.image
      });
      setImagePreview(eventData.image);
    } catch (err) {
      console.error('Error fetching event:', err);
      setError(err.response?.data?.message || 'Failed to fetch event details');
      showToast.error(err.response?.data?.message || 'Failed to fetch event details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEventDetails();
  }, [fetchEventDetails]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Update image preview for image URL
    if (name === 'image') {
      setImagePreview(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast.error('Please fix the errors in the form');
      return;
    }

    setSubmitting(true);
    try {
      const url = id ? `/events/${id}` : '/events';
      const method = id ? 'put' : 'post';

      // Combine date and time into a single ISO string
      const dateTime = new Date(formData.date + 'T' + formData.time);
      
      let eventData;
      
      if (id) {
        // For updates, only send the fields that backend allows organizers to update
        eventData = {
          date: dateTime.toISOString(),
          location: formData.location,
          ticketsAvailable: parseInt(formData.totalTickets)
        };
      } else {
        // For new events, send all required fields
        eventData = {
          title: formData.title,
          description: formData.description,
          date: dateTime.toISOString(),
          location: formData.location,
          category: formData.category,
          price: parseFloat(formData.price),
          totalTickets: parseInt(formData.totalTickets),
          image: formData.image
        };
      }

      const response = await axiosInstance[method](url, eventData);
      
      if (!response.data || !response.data.success) {
        throw new Error('Failed to save event');
      }

      showToast.success(id ? 'Event updated successfully!' : 'Event created successfully!');
      
      // Add a small delay before navigation to ensure the events list is updated
      setTimeout(() => {
        navigate('/organizer/events');
      }, 1000);
    } catch (err) {
      console.error('Error saving event:', err);
      showToast.error(err.response?.data?.message || 'Failed to save event');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Loader />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {id ? 'Edit Event' : 'Create New Event'}
          </h2>
          <button
            onClick={() => navigate('/organizer/events')}
            className="text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow p-6">
          <div>
            <label className="block text-gray-700 mb-2">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              disabled={!!id}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formErrors.title ? 'border-red-500' : 'border-gray-300'
              } ${id ? 'bg-gray-100' : ''}`}
              placeholder="Enter event title"
            />
            {formErrors.title && (
              <p className="mt-1 text-sm text-red-500">{formErrors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              disabled={!!id}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formErrors.description ? 'border-red-500' : 'border-gray-300'
              } ${id ? 'bg-gray-100' : ''}`}
              rows="4"
              placeholder="Enter event description"
            />
            {formErrors.description && (
              <p className="mt-1 text-sm text-red-500">{formErrors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Date *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formErrors.date ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {formErrors.date && (
                <p className="mt-1 text-sm text-red-500">{formErrors.date}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Time *</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formErrors.time ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {formErrors.time && (
                <p className="mt-1 text-sm text-red-500">{formErrors.time}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Location *</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formErrors.location ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter event location"
            />
            {formErrors.location && (
              <p className="mt-1 text-sm text-red-500">{formErrors.location}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              disabled={!!id}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formErrors.category ? 'border-red-500' : 'border-gray-300'
              } ${id ? 'bg-gray-100' : ''}`}
            >
              <option value="">Select a category</option>
              <option value="music">Music</option>
              <option value="sports">Sports</option>
              <option value="theater">Theater</option>
              <option value="conference">Conference</option>
              <option value="workshop">Workshop</option>
              <option value="exhibition">Exhibition</option>
              <option value="other">Other</option>
            </select>
            {formErrors.category && (
              <p className="mt-1 text-sm text-red-500">{formErrors.category}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Ticket Price ($) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                disabled={!!id}
                min="0"
                step="0.01"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formErrors.price ? 'border-red-500' : 'border-gray-300'
                } ${id ? 'bg-gray-100' : ''}`}
                placeholder="0.00"
              />
              {formErrors.price && (
                <p className="mt-1 text-sm text-red-500">{formErrors.price}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Total Tickets *</label>
              <input
                type="number"
                name="totalTickets"
                value={formData.totalTickets}
                onChange={handleChange}
                min="1"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formErrors.totalTickets ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter total available tickets"
              />
              {formErrors.totalTickets && (
                <p className="mt-1 text-sm text-red-500">{formErrors.totalTickets}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Image URL *</label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              disabled={!!id}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formErrors.image ? 'border-red-500' : 'border-gray-300'
              } ${id ? 'bg-gray-100' : ''}`}
              placeholder="Enter image URL"
            />
            {formErrors.image && (
              <p className="mt-1 text-sm text-red-500">{formErrors.image}</p>
            )}
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Event preview"
                  className="w-full h-48 object-cover rounded-lg"
                  onError={() => setImagePreview('')}
                />
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/organizer/events')}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors
                ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {submitting ? 'Saving...' : id ? 'Update Event' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm; 