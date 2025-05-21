import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import EventCard from './EventCard';
import Loader from '../shared/Loader';
import { showToast } from '../shared/Toast';

export default function EventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    date: '',
    priceRange: '',
  });

  useEffect(() => {
    fetchEvents();
  }, [filters]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/events', { params: filters });
      setEvents(response.data.data);
    } catch (error) {
      showToast.error('Failed to fetch events');
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <Loader fullScreen />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={handleSearch}
            className="form-input flex-1"
          />
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="form-input w-full sm:w-48"
          >
            <option value="">All Categories</option>
            <option value="music">Music</option>
            <option value="sports">Sports</option>
            <option value="arts">Arts & Theater</option>
            <option value="family">Family</option>
          </select>
          <select
            name="date"
            value={filters.date}
            onChange={handleFilterChange}
            className="form-input w-full sm:w-48"
          >
            <option value="">All Dates</option>
            <option value="today">Today</option>
            <option value="tomorrow">Tomorrow</option>
            <option value="this-week">This Week</option>
            <option value="this-month">This Month</option>
          </select>
          <select
            name="priceRange"
            value={filters.priceRange}
            onChange={handleFilterChange}
            className="form-input w-full sm:w-48"
          >
            <option value="">All Prices</option>
            <option value="free">Free</option>
            <option value="under-50">Under $50</option>
            <option value="50-100">$50 - $100</option>
            <option value="over-100">Over $100</option>
          </select>
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">No events found</h3>
          <p className="mt-2 text-sm text-gray-500">
            Try adjusting your search or filters to find what you're looking for.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEvents.map(event => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
} 