import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../services/axiosConfig';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';

// Set app element for react-modal (important for accessibility)
Modal.setAppElement('#root'); // Assuming your root element has id='root'

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventToDeleteId, setEventToDeleteId] = useState(null);
  const navigate = useNavigate();

  const fetchEvents = async () => {
    try {
      const response = await axiosInstance.get('/events/all');
      setEvents(response.data.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to fetch events.');
      setLoading(false);
      toast.error('Failed to load events.');
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const openDeleteModal = (eventId) => {
    setEventToDeleteId(eventId);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setEventToDeleteId(null);
    setIsModalOpen(false);
  };

  const confirmDelete = async () => {
    if (!eventToDeleteId) return;

    try {
      await axiosInstance.delete(`/events/${eventToDeleteId}`);
      toast.success('Event deleted successfully!');
      // Remove the deleted event from the list
      setEvents(events.filter(event => event._id !== eventToDeleteId));
      closeDeleteModal();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error(error.response?.data?.message || 'Failed to delete event.');
      closeDeleteModal();
    }
  };

  const handleUpdate = (eventId) => {
    // Navigate to the event edit page
    navigate(`/manage-events/edit/${eventId}`);
  };

  if (loading) {
    return <div className="text-center py-8">Loading events...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Event Management</h2>

        {events.length === 0 ? (
          <div className="text-center text-gray-600">No events found.</div>
        ) : (
          <div className="space-y-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tickets</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {events.map((event) => (
                  <tr key={event._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{event.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(event.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.status}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.tickets.length}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {
                        event.status === 'pending' ? (
                          <>
                            <button
                              // onClick={() => handleApprove(event._id)}
                              className="text-green-600 hover:text-green-900 mr-4"
                            >
                              Approve
                            </button>
                            <button
                              // onClick={() => handleDecline(event._id)}\n                              className="text-red-600 hover:text-red-900 mr-4"
                            >
                              Decline
                            </button>
                          </>
                        ) : (
                           <button
                            // onClick={() => handleResetStatus(event._id)}\n                            className="text-yellow-600 hover:text-yellow-900 mr-4"
                          >
                            Reset to Pending
                          </button>
                        )
                      }
                      <button
                        onClick={() => openDeleteModal(event._id)}
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
        )}

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeDeleteModal}
          className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Confirm Deletion</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this event? This action cannot be undone.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>

      </div>
    </div>
  );
};

export default EventManagement; 