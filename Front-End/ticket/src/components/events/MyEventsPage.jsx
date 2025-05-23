import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../services/axiosConfig';
import { showToast } from '../shared/Toast';
import Loader from '../shared/Loader';
import EventAnalytics from './EventAnalytics';

const MyEventsPage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    sortBy: 'date'
  });

  const fetchMyEvents = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/users/events');
      if (response.data && Array.isArray(response.data)) {
        setEvents(response.data || []);
      } else {
        setEvents(response.data?.data || []);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err.response?.data?.message || 'Failed to fetch your events');
      showToast.error(err.response?.data?.message || 'Failed to fetch your events');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyEvents();
  }, [fetchMyEvents]);

  const handleDelete = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }

    try {
      await axiosInstance.delete(`/events/${eventId}`);
      showToast.success('Event deleted successfully');
      setEvents(events.filter(event => event._id !== eventId));
    } catch (err) {
      console.error('Error deleting event:', err);
      showToast.error(err.response?.data?.message || 'Failed to delete event');
    }
  };

  const handleDuplicate = async (event) => {
    try {
      const { _id, createdAt, updatedAt, status, remainingTickets, analytics, ...eventData } = event;
      
      const response = await axiosInstance.post('/events', {
        ...eventData,
        title: `${eventData.title} (Copy)`
      });
      
      showToast.success('Event duplicated successfully');
      setEvents([...events, response.data.data]);
    } catch (err) {
      console.error('Error duplicating event:', err);
      showToast.error(err.response?.data?.message || 'Failed to duplicate event');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredEvents = events ? events.filter(event => {
    const matchesStatus = filters.status === 'all' || event.status === filters.status;
    const matchesSearch = event.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                         event.location.toLowerCase().includes(filters.search.toLowerCase());
    return matchesStatus && matchesSearch;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case 'date':
        return new Date(b.date) - new Date(a.date);
      case 'title':
        return a.title.localeCompare(b.title);
      case 'status':
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  }) : [];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Loader />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
        <h1 className="text-2xl font-bold text-gray-800">My Events</h1>
        <button
          onClick={() => navigate('/organizer/events/new')}
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create New Event
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              placeholder="Search by title or location"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="declined">Declined</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="date">Date</option>
              <option value="title">Title</option>
              <option value="status">Status</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
          <button
            onClick={fetchMyEvents}
            className="ml-2 text-red-700 hover:text-red-900 underline"
          >
            Try Again
          </button>
        </div>
      )}

      {filteredEvents.length === 0 ? (
        <div className="text-center bg-white rounded-lg shadow py-8">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Events Found</h3>
          <p className="text-gray-500 mb-4">
            {filters.search || filters.status !== 'all'
              ? 'Try adjusting your filters'
              : "You haven't created any events yet"}
          </p>
          {filters.search || filters.status !== 'all' ? (
            <button
              onClick={() => setFilters({ status: 'all', search: '', sortBy: 'date' })}
              className="text-blue-600 hover:text-blue-800"
            >
              Clear Filters
            </button>
          ) : (
            <button
              onClick={() => navigate('/organizer/events/new')}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Your First Event
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tickets
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEvents.map(event => (
                  <tr key={event._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {event.image && (
                          <img
                            src={event.image}
                            alt={event.title}
                            className="h-10 w-10 rounded-lg object-cover mr-3"
                          />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">{event.title}</div>
                          <div className="text-sm text-gray-500">${event.price}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(event.date).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">{event.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {event.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(event.status)}`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{event.bookedTickets || 0} booked</div>
                      <div>{event.availableTickets} available</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => navigate(`/organizer/events/analytics/${event._id}`)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Analytics
                      </button>
                      <button
                        onClick={() => navigate(`/organizer/events/edit/${event._id}`)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDuplicate(event)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Duplicate
                      </button>
                      <button
                        onClick={() => handleDelete(event._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Analytics Modal */}
      {showAnalytics && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Analytics - {selectedEvent.title}</h2>
                <button
                  onClick={() => {
                    setShowAnalytics(false);
                    setSelectedEvent(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <EventAnalytics eventId={selectedEvent._id} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyEventsPage; 