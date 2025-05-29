import React, { useState, useEffect } from 'react';
import axiosInstance from '../../services/axiosConfig';
import { showToast } from '../shared/Toast';
import Loader from '../shared/Loader';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from 'react-modal';

// Set app element for react-modal
Modal.setAppElement('#root');

// Import icons if needed, e.g., from Heroicons
// import { ChevronDownIcon } from '@heroicons/react/24/solid';

const AdminEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

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

  const handleDelete = async (eventId) => {
    try {
      const response = await axiosInstance.delete(`/events/${eventId}`);
      if (response.data.success) {
        setEvents(events.filter(event => event._id !== eventId));
        showToast.success('Event deleted successfully');
        setIsDeleteModalOpen(false);
        setEventToDelete(null);
      } else {
        throw new Error('Failed to delete event');
      }
    } catch (err) {
      console.error('Error deleting event:', err);
      showToast.error(err.response?.data?.message || 'Failed to delete event');
    }
  };

  const openDeleteModal = (eventId) => {
    setEventToDelete(eventId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setEventToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const filteredEvents = events.filter(event => 
    statusFilter === 'all' || event.status === statusFilter
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) return (
     <div className="container mx-auto px-4 py-8 min-h-screen-except-nav-footer flex items-center justify-center">
        <Loader type="spinner" size="large" text="Loading events..." />
     </div>
  );
  if (error) return (
     <div className="container mx-auto px-4 py-8 text-center text-red-500 dark:text-red-400 py-8">
        {error}
     </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4 md:mb-0">Manage Events</h1>
        <div className="relative inline-block">
           <select
             value={statusFilter}
             onChange={(e) => setStatusFilter(e.target.value)}
             className="block appearance-none w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 py-2 px-4 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white dark:focus:bg-gray-800 focus:border-blue-500"
           >
             <option value="all">All Events</option>
             <option value="pending">Pending</option>
             <option value="approved">Approved</option>
             <option value="declined">Declined</option>
           </select>
           <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-200">
             <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
           </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Event
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Organizer
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <AnimatePresence>
            <motion.tbody 
              key="event-table-body"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="divide-y divide-gray-200 dark:divide-gray-700"
            >
              {filteredEvents.map(event => (
                <motion.tr 
                  key={event._id}
                  variants={itemVariants}
                  className="bg-white dark:bg-gray-800 even:bg-gray-50 dark:even:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{event.title}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{event.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{event.organizer?.name || 'Unknown'}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{event.organizer?.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500 dark:text-gray-400">
                    {new Date(event.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center align-middle">
                    <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full uppercase shadow-sm
                      ${event.status === 'approved' ? 'bg-green-500 text-white dark:bg-green-600' : ''}
                      ${event.status === 'pending' ? 'bg-yellow-400 text-gray-800 dark:bg-yellow-500' : ''}
                      ${event.status === 'declined' ? 'bg-red-500 text-white dark:bg-red-600' : ''}
                    `}>
                      {event.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <div className="flex justify-center space-x-4">
                       {event.status === 'pending' && (
                         <>
                           <button
                             onClick={() => handleStatusChange(event._id, 'approved')}
                             className="text-green-600 dark:text-green-400 hover:underline"
                           >
                             Approve
                           </button>
                           <button
                             onClick={() => handleStatusChange(event._id, 'declined')}
                             className="text-red-600 dark:text-red-400 hover:underline"
                           >
                             Decline
                           </button>
                         </>
                       )}
                       {event.status !== 'pending' && (
                         <button
                           onClick={() => handleStatusChange(event._id, 'pending')}
                           className="text-blue-600 dark:text-blue-400 hover:underline"
                         >
                           Reset to Pending
                         </button>
                       )}
                       <button
                         onClick={() => openDeleteModal(event._id)}
                         className="text-red-600 dark:text-red-400 hover:underline"
                       >
                         Delete
                       </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </motion.tbody>
          </AnimatePresence>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={closeDeleteModal}
        className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Confirm Deletion</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">Are you sure you want to delete this event? This action cannot be undone.</p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={closeDeleteModal}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => handleDelete(eventToDelete)}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

export default AdminEventsPage; 