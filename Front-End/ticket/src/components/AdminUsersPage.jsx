import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import UserRow from './UserRow';
import axiosInstance from '../services/axiosConfig';
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from 'framer-motion';
import Loader from './shared/Loader';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/users');
      setUsers(response.data.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      const errorMessage = err.response?.data?.message || 'Failed to fetch users';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleUserUpdate = async (userId, newRole) => {
    try {
      // Optimistically update the UI
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user._id === userId ? { ...user, role: newRole, isUpdating: true } : user
        )
      );

      await axiosInstance.put(`/users/${userId}`, { role: newRole });
      toast.success('User role updated successfully');
      // Fetch users to get the latest data and remove optimistic state
      fetchUsers(); 
    } catch (err) {
      console.error('Error updating user:', err);
      const errorMessage = err.response?.data?.message || 'Failed to update user role';
      setError(errorMessage);
      toast.error(errorMessage);
      // Revert optimistic update if failed
      fetchUsers();
    }
  };

  const handleUserDelete = async (userId) => {
    try {
       // Optimistically remove the user from the UI
      setUsers(prevUsers => prevUsers.map(user => 
         user._id === userId ? { ...user, isDeleting: true } : user
      ));

      await axiosInstance.delete(`/users/${userId}`);
      toast.success('User deleted successfully');
      // Filter out the deleted user
      setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
    } catch (err) {
      console.error('Error deleting user:', err);
      const errorMessage = err.response?.data?.message || 'Failed to delete user';
      toast.error(errorMessage);
      // Refresh to revert optimistic removal if failed
      fetchUsers();
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen-except-nav-footer flex items-center justify-center">
        <Loader type="spinner" size="large" text="Loading users..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg shadow-md">
          {error}
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">User Management</h1>
      
      <motion.div
         initial={{ y: 20, opacity: 0 }}
         animate={{ y: 0, opacity: 1 }}
         transition={{ delay: 0.2 }}
         className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 md:p-6"
      >
         {users.length === 0 ? (
            <div className="text-center text-gray-600 dark:text-gray-400 py-8">
               No users found.
            </div>
         ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence>
                 {users.map((user) => (
                    <UserRow
                      key={user._id}
                      user={user}
                      onUpdateRole={handleUserUpdate}
                      onDelete={handleUserDelete}
                    />
                 ))}
              </AnimatePresence>
            </div>
         )}

      </motion.div>
    </motion.div>
  );
};

export default AdminUsersPage; 