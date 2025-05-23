import React, { useState, useEffect } from 'react';
import axiosInstance from '../../services/axiosConfig';
import { showToast } from '../shared/Toast';
import Loader from '../shared/Loader';

const AdminEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axiosInstance.get('/events/all');
      if (response.data.success) {
        setEvents(response.data.data);
      } else {
        throw new Error('Failed to fetch events');
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err.response?.data?.message || 'Failed to fetch events');
      setLoading(false);
    }
  };

  const handleStatusChange = async (eventId, status) => {
    try {
      const response = await axiosInstance.put(`/events/${eventId}`, {
        status: status
      });
      
      if (response.data.success) {
        // Update local state
        setEvents(events.map(event => 
          event._id === eventId ? { ...event, status } : event
        ));
        
        showToast.success(`Event ${status} successfully`);
      } else {
        throw new Error('Failed to update event status');
      }
    } catch (err) {
      console.error('Error updating event status:', err);
      showToast.error(err.response?.data?.message || `Failed to update event status`);
    }
  };

  const filteredEvents = events.filter(event => 
    statusFilter === 'all' || event.status === statusFilter
  );

  if (loading) return <Loader />;
  if (error) return <div className="text-center text-red-500 py-8">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Events</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 border rounded-lg"
        >
          <option value="all">All Events</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="declined">Declined</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Event
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Organizer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredEvents.map(event => (
              <tr key={event._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{event.title}</div>
                  <div className="text-sm text-gray-500">{event.location}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{event.organizer?.name || 'Unknown'}</div>
                  <div className="text-sm text-gray-500">{event.organizer?.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(event.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${event.status === 'approved' ? 'bg-green-100 text-green-800' : ''}
                    ${event.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${event.status === 'declined' ? 'bg-red-100 text-red-800' : ''}
                  `}>
                    {event.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {event.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(event._id, 'approved')}
                        className="text-green-600 hover:text-green-900 mr-4"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusChange(event._id, 'declined')}
                        className="text-red-600 hover:text-red-900"
                      >
                        Decline
                      </button>
                    </>
                  )}
                  {event.status !== 'pending' && (
                    <button
                      onClick={() => handleStatusChange(event._id, 'pending')}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Reset to Pending
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminEventsPage; 