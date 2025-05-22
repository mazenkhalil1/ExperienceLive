import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import UserRow from './UserRow';
import axiosInstance from '../services/axiosConfig';
import 'react-toastify/dist/ReactToastify.css';

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
      console.log('Frontend: Attempting to update user with ID:', userId);
      await axiosInstance.put(`/users/${userId}`, { role: newRole });
      toast.success('User role updated successfully');
      fetchUsers(); // Refresh the users list
    } catch (err) {
      console.error('Error updating user:', err);
      const errorMessage = err.response?.data?.message || 'Failed to update user role';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleUserDelete = async (userId) => {
    try {
      console.log('Frontend: Attempting to delete user with ID:', userId);
      await axiosInstance.delete(`/users/${userId}`);
      toast.success('User deleted successfully');
      fetchUsers(); // Refresh the users list
    } catch (err) {
      console.error('Error deleting user:', err);
      const errorMessage = err.response?.data?.message || 'Failed to delete user';
      toast.error(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">User Management</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <UserRow
                key={user._id}
                user={user}
                onUpdateRole={handleUserUpdate}
                onDelete={handleUserDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsersPage; 