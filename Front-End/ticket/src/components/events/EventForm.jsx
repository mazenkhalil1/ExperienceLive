import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../services/axiosConfig';
import { showToast } from '../shared/Toast';
import Loader from '../shared/Loader';
import { motion } from 'framer-motion';

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
    image: null,
    imageUrl: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [imagePreview, setImagePreview] = useState('');

  const validateForm = () => {
    const errors = {};
    const now = new Date();
    const eventDate = new Date(formData.date + 'T' + formData.time);

    if (!id) {
      // Validate all fields for new events
      if (!formData.title?.trim()) errors.title = 'Title is required';
      if (!formData.description?.trim()) errors.description = 'Description is required';
      if (!formData.category) errors.category = 'Category is required';
      if (!formData.price || parseFloat(formData.price) < 0) errors.price = 'Valid price is required';
      if (!formData.image) errors.image = 'Image is required';
    }

    // Always validate editable fields (for both new and edit)
    if (!formData.date) errors.date = 'Date is required';
    if (!formData.time) errors.time = 'Time is required';
    if (formData.date && formData.time && eventDate <= now) errors.date = 'Event date must be in the future';
    if (!formData.location?.trim()) errors.location = 'Location is required';
    if (!formData.totalTickets || parseInt(formData.totalTickets) < 1) {
      errors.totalTickets = 'Minimum 1 ticket required';
    }

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
        image: null,
        imageUrl: eventData.image
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
    const { name, value, type, files } = e.target;

    if (type === 'file') {
      const file = files[0];
      setFormData(prev => ({
        ...prev,
        [name]: file
      }));
      if (file) {
        setImagePreview(URL.createObjectURL(file));
      } else {
        setImagePreview(formData.imageUrl || '');
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when user starts typing or selects a file
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast.error('Please fix the errors in the form');
      return;
    }

    setSubmitting(true);
    
    const data = new FormData();
    // Append fields to FormData
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('date', new Date(formData.date + 'T' + formData.time).toISOString());
    data.append('location', formData.location);
    data.append('category', formData.category);
    data.append('price', parseFloat(formData.price));
    data.append('totalTickets', parseInt(formData.totalTickets));

    // Append image file if a new file is selected
    if (formData.image) {
      data.append('image', formData.image);
    } else if (id && formData.imageUrl) {
      // If editing and no new file selected, send existing image URL (backend should handle this)
      data.append('imageUrl', formData.imageUrl);
    }

    try {
      const url = id ? `/events/${id}` : '/events';
      const method = id ? 'put' : 'post';

      // axios automatically sets Content-Type to multipart/form-data with FormData
      const response = await axiosInstance[method](url, data);
      
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

  useEffect(() => {
    // Clean up the object URL when the component unmounts or imagePreview changes
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen-except-nav-footer flex items-center justify-center">
        <Loader type="spinner" size="large" text={id ? "Loading event for editing..." : "Loading form..."} />
      </div>
    );
  }

  return (
    <motion.div 
       initial={{ opacity: 0 }}
       animate={{ opacity: 1 }}
       className="container mx-auto px-4 py-8 min-h-screen-except-nav-footer"
    >
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {id ? 'Edit Event' : 'Create New Event'}
          </h2>
          <button
            onClick={() => navigate('/organizer/events')}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 transition-colors duration-200"
          >
            Cancel
          </button>
        </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

        <form onSubmit={handleSubmit} className="space-y-6">
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
              disabled={!!id}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 disabled:opacity-60 disabled:cursor-not-allowed ${
                formErrors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="Enter event title"
            />
            {formErrors.title && (
              <p className="mt-1 text-sm text-red-500 dark:text-red-400">{formErrors.title}</p>
            )}
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description <span className="text-red-500">*</span></label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
              disabled={!!id}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 disabled:opacity-60 disabled:cursor-not-allowed ${
                formErrors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
            rows="4"
              placeholder="Enter event description"
          />
            {formErrors.description && (
              <p className="mt-1 text-sm text-red-500 dark:text-red-400">{formErrors.description}</p>
            )}
        </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date <span className="text-red-500">*</span></label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${formErrors.date ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
              />
              {formErrors.date && (
                <p className="mt-1 text-sm text-red-500 dark:text-red-400">{formErrors.date}</p>
              )}
          </div>
          <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Time <span className="text-red-500">*</span></label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${formErrors.time ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
            />
              {formErrors.time && (
                <p className="mt-1 text-sm text-red-500 dark:text-red-400">{formErrors.time}</p>
              )}
            </div>
          </div>

        <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 ${formErrors.location ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
              placeholder="Enter event location"
            />
            {formErrors.location && (
              <p className="mt-1 text-sm text-red-500 dark:text-red-400">{formErrors.location}</p>
            )}
        </div>

        <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
              disabled={!!id}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 disabled:opacity-60 disabled:cursor-not-allowed ${formErrors.category ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
              placeholder="Enter event category"
            />
            {formErrors.category && (
              <p className="mt-1 text-sm text-red-500 dark:text-red-400">{formErrors.category}</p>
            )}
        </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Price <span className="text-red-500">*</span></label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
                disabled={!!id}
              min="0"
                step="0.01"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 disabled:opacity-60 disabled:cursor-not-allowed ${formErrors.price ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                placeholder="Enter price"
              />
              {formErrors.price && (
                <p className="mt-1 text-sm text-red-500 dark:text-red-400">{formErrors.price}</p>
              )}
          </div>
          <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Total Tickets <span className="text-red-500">*</span></label>
            <input
              type="number"
              name="totalTickets"
              value={formData.totalTickets}
              onChange={handleChange}
              min="1"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 ${formErrors.totalTickets ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                placeholder="Enter total tickets"
            />
              {formErrors.totalTickets && (
                <p className="mt-1 text-sm text-red-500 dark:text-red-400">{formErrors.totalTickets}</p>
              )}
            </div>
          </div>

        <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Event Image {id ? '' : <span className="text-red-500">*</span>}</label>
            {!id ? (
              <div>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className={`w-full text-sm text-gray-500 dark:text-gray-400
                             file:mr-4 file:py-2 file:px-4
                             file:rounded-full file:border-0
                             file:text-sm file:font-semibold
                             file:bg-blue-50 file:text-blue-700
                             hover:file:bg-blue-100
                             dark:file:bg-gray-700 dark:file:text-gray-300 dark:hover:file:bg-gray-600
                             ${formErrors.image ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                />
                {formErrors.image && (
                  <p className="mt-1 text-sm text-red-500 dark:text-red-400">{formErrors.image}</p>
                )}
              </div>
            ) : (
              <div>
                {formData.imageUrl && (
                  <img
                    src={formData.imageUrl}
                    alt="Event Preview"
                    className="mt-2 w-48 h-32 object-cover rounded-lg shadow"
                  />
                )}
              </div>
            )}
            
            {imagePreview && !id && (
               <img
                  src={imagePreview}
                  alt="Image Preview"
                  className="mt-2 w-48 h-32 object-cover rounded-lg shadow"
                />
            )}
             {imagePreview && id && formData.image && (
               <img
                  src={imagePreview}
                  alt="Image Preview"
                  className="mt-2 w-48 h-32 object-cover rounded-lg shadow"
                />
            )}

        </div>

        <div className="mt-6">
          <motion.button
            type="submit"
            disabled={submitting}
            className={`w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md
                       hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500
                       disabled:opacity-50 disabled:cursor-not-allowed
                       dark:bg-blue-500 dark:hover:bg-blue-600 dark:disabled:bg-gray-600
                       transition-colors duration-200
                       ${submitting ? 'flex items-center justify-center' : ''}`}
             whileHover={{ scale: submitting ? 1 : 1.02 }}
             whileTap={{ scale: submitting ? 1 : 0.98 }}
          >
            {submitting ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l2-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              id ? 'Update Event' : 'Create Event'
            )}
          </motion.button>
        </div>
      </form>
      </div>
    </motion.div>
  );
};

export default EventForm; 