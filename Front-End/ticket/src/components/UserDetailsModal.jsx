import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axiosInstance from '../services/axiosConfig';
import { showToast } from './shared/Toast';
import Loader from './shared/Loader';

const UserDetailsModal = ({ isOpen, onClose, userId }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && userId) {
      fetchUserDetails();
    }
  }, [isOpen, userId]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/users/${userId}`);
      if (response.data.success) {
        setUser(response.data.data);
      } else {
        throw new Error('Failed to fetch user details');
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching user details:', err);
      setError(err.response?.data?.message || 'Failed to load user details');
      showToast.error('Failed to load user details');
    } finally {
      setLoading(false);
    }
  };

  const formatMemberSince = (dateString) => {
    if (!dateString) return 'N/A';

    try {
      // Check if our date is in the future (which shouldn't happen)
      const date = new Date(dateString);
      const now = new Date();

      // If the date is in the future or very close to now, it's likely a system/timezone issue
      if (date > now || Math.abs(now - date) < 1000 * 60 * 1) {
        // within 5 minutes
        // Just display today's date in a standard format
        return 'Today';
      }

      // Continue with your existing relative time function
      const diffTime = Math.abs(now - date);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      const diffMinutes = Math.floor(diffTime / (1000 * 60));

      if (diffMinutes < 60) {
        return diffMinutes <= 1 ? 'Just now' : `${diffMinutes} minutes ago`;
      } else if (diffHours < 24) {
        return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
      } else if (diffDays === 0) {
        return 'Today';
      } else if (diffDays === 1) {
        return 'Yesterday';
      } else if (diffDays < 7) {
        return `${diffDays} days ago`;
      } else if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
      } else if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        return months === 1 ? '1 month ago' : `${months} months ago`;
      } else {
        const years = Math.floor(diffDays / 365);
        return years === 1 ? '1 year ago' : `${years} years ago`;
      }
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Unknown date';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="fixed inset-0 flex items-center justify-center p-4"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">User Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <Loader />
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-4">{error}</div>
        ) : user ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-gray-600 font-medium">Name</h3>
                <p className="text-gray-900">{user.name}</p>
              </div>
              <div>
                <h3 className="text-gray-600 font-medium">Email</h3>
                <p className="text-gray-900">{user.email}</p>
              </div>
              <div>
                <h3 className="text-gray-600 font-medium">Role</h3>
                <span
                  className={`px-2 py-1 inline-flex text-sm font-semibold rounded-full ${
                    user.role === 'admin'
                      ? 'bg-purple-100 text-purple-800'
                      : user.role === 'organizer'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {user.role}
                </span>
              </div>
              <div>
                <h3 className="text-gray-600 font-medium">Member Since</h3>
                <p className="text-gray-900">
                  {formatMemberSince(user.createdAt)}
                </p>
              </div>
            </div>

            {user.profilePicture && (
              <div className="mt-4">
                <h3 className="text-gray-600 font-medium mb-2">
                  Profile Picture
                </h3>
                <img
                  src={user.profilePicture}
                  alt={`${user.name}'s profile`}
                  className="w-32 h-32 rounded-full object-cover"
                />
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4">No user data available</div>
        )}
      </div>
    </Modal>
  );
};

export default UserDetailsModal;