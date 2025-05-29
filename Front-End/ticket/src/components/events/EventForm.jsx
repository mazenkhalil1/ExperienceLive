import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../services/axiosConfig';
import { toast } from 'react-toastify';

const EventForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    price: '',
    totalTickets: '',
    category: '',
    image: '',
    ticketsAvailable: ''
  });

  const [originalData, setOriginalData] = useState(null);
  const isEditing = !!id;

  useEffect(() => {
    if (isEditing) {
      axiosInstance.get(`/events/${id}`)
        .then((res) => {
          const { title, description, date, location, price, totalTickets, category, image, remainingTickets } = res.data.data;
          const initialData = { 
            title, 
            description, 
            date, 
            location, 
            price, 
            totalTickets, 
            category, 
            image,
            ticketsAvailable: remainingTickets 
          };
          setFormData(initialData);
          setOriginalData(initialData);
        })
        .catch(() => toast.error('Failed to load event for editing.'));
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditing) {
        // For editing, only send fields that have changed
        const allowedFields = ['date', 'location', 'ticketsAvailable'];
        const changedFields = Object.entries(formData)
          .filter(([key, value]) => 
            allowedFields.includes(key) && 
            value !== originalData[key]
          );
        
        if (changedFields.length === 0) {
          toast.info('No changes detected');
          navigate('/my-events');
          return;
        }

        const filteredData = Object.fromEntries(changedFields);
        await axiosInstance.put(`/events/${id}`, filteredData);
        toast.success('Event updated successfully!');
      } else {
        // For creating, send all required fields
        await axiosInstance.post('/events', formData);
        toast.success('Event created successfully!');
      }

      navigate('/my-events');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  const renderInput = (name, label, type = 'text', placeholder, required = true, disabled = false) => {
    const hasChanged = isEditing && formData[name] !== originalData?.[name];
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {hasChanged && <span className="text-blue-500 ml-2">(Modified)</span>}
        </label>
        <input
          name={name}
          type={type}
          value={formData[name]}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
            disabled ? 'bg-gray-100 cursor-not-allowed' : ''
          } ${hasChanged ? 'border-blue-500' : ''}`}
        />
      </div>
    );
  };

  const renderTextarea = (name, label, placeholder, required = true, disabled = false) => {
    const hasChanged = isEditing && formData[name] !== originalData?.[name];
    return (
      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {hasChanged && <span className="text-blue-500 ml-2">(Modified)</span>}
        </label>
        <textarea
          name={name}
          value={formData[name]}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          rows="4"
          className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
            disabled ? 'bg-gray-100 cursor-not-allowed' : ''
          } ${hasChanged ? 'border-blue-500' : ''}`}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-800">
              {isEditing ? 'Edit Event' : 'Create New Event'}
            </h2>
            <button
              onClick={() => navigate('/my-events')}
              className="text-gray-600 hover:text-gray-800"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title Field */}
              {renderInput(
                'title',
                'Event Title',
                'text',
                'Enter event title',
                true,
                isEditing
              )}

              {/* Description Field */}
              {renderTextarea(
                'description',
                'Description',
                'Enter event description',
                true,
                isEditing
              )}

              {/* Date Field */}
              {renderInput(
                'date',
                'Event Date',
                'date',
                '',
                !isEditing,
                false
              )}

              {/* Location Field */}
              {renderInput(
                'location',
                'Location',
                'text',
                'Enter event location',
                !isEditing,
                false
              )}

              {/* Total Tickets Field */}
              {renderInput(
                'totalTickets',
                'Total Tickets',
                'number',
                'Enter total number of tickets',
                true,
                isEditing
              )}

              {/* Available Tickets Field */}
              {renderInput(
                'ticketsAvailable',
                'Available Tickets',
                'number',
                'Enter available tickets',
                !isEditing,
                false
              )}

              {/* Price Field */}
              {renderInput(
                'price',
                'Ticket Price ($)',
                'number',
                'Enter ticket price',
                true,
                isEditing
              )}

              {/* Category Field */}
              {renderInput(
                'category',
                'Category',
                'text',
                'Enter event category',
                false,
                isEditing
              )}

              {/* Image URL Field */}
              {renderInput(
                'image',
                'Image URL',
                'text',
                'Enter image URL',
                false,
                isEditing
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                {isEditing ? 'Update Event' : 'Create Event'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventForm;
