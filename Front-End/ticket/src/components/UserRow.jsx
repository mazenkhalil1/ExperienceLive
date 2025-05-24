import React, { useState } from 'react';
import UpdateUserRoleModal from './UpdateUserRoleModal';
import ConfirmationDialog from './ConfirmationDialog';
import UserDetailsModal from './UserDetailsModal';
import { motion } from 'framer-motion';
import { ShieldCheckIcon, BriefcaseIcon, UserIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../context/ThemeContext';

const UserRow = ({ user, onUpdateRole, onDelete }) => {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { isDarkMode } = useTheme();

  const handleUpdateRole = async (newRole) => {
    setIsUpdating(true);
    try {
      await onUpdateRole(user._id, newRole);
    } finally {
      setIsUpdating(false);
      setIsUpdateModalOpen(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(user._id);
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const getRoleInfo = (role) => {
    switch (role) {
      case 'admin':
        return { colorClass: 'bg-purple-100 text-purple-800 dark:bg-purple-700 dark:text-purple-200 shadow-sm', icon: <ShieldCheckIcon className="w-4 h-4 mr-1" /> };
      case 'organizer':
        return { colorClass: 'bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-200 shadow-sm', icon: <BriefcaseIcon className="w-4 h-4 mr-1" /> };
      case 'user':
        return { colorClass: 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-200 shadow-sm', icon: <UserIcon className="w-4 h-4 mr-1" /> };
      default:
        return { colorClass: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 shadow-sm', icon: <UserIcon className="w-4 h-4 mr-1" /> };
    }
  };

  const roleInfo = getRoleInfo(user.role);

  return (
    <>
      <motion.div 
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className={`rounded-lg p-6 border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-[#fffef9] border-gray-200'} shadow-md hover:shadow-xl transition-shadow duration-300 
                   flex flex-col md:flex-row justify-between items-start md:items-center space-y-6 md:space-y-0 cursor-pointer ${isDarkMode ? '' : 'hover:scale-105'}`}
        onClick={() => setIsDetailsModalOpen(true)}
      >
        {/* User Info */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div className="flex items-center">
             <UserIcon className={`w-5 h-5 mr-2 ${isDarkMode ? 'text-blue-500' : 'text-yellow-500'}`} />
            <div className={`text-base font-semibold ${isDarkMode ? 'text-gray-900 dark:text-white' : 'text-gray-800'}`}>{user.name}</div>
          </div>
          {/* Email */}
          <div className="flex items-center">
             <svg className={`w-5 h-5 mr-2 ${isDarkMode ? 'text-blue-500' : 'text-yellow-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-1 9l-4.343-4.343m0 0L9.657 17.657m0 0l-4.343 4.343m0 0A9 9 0 1020 11a9 9 0 00-11.468 5.16m0 0L7 19m4 4v-4m-3 0H9m10 0h2"></path></svg>
            <div className={`text-sm ${isDarkMode ? 'text-gray-600 dark:text-gray-400' : 'text-gray-800'}`}>{user.email}</div>
          </div>
          {/* Role */}
          <div className="flex items-center md:col-span-2">
             <svg className={`w-5 h-5 mr-2 ${isDarkMode ? 'text-blue-500' : 'text-yellow-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V4a1 1 0 011-1h3a1 1 0 011 1v2m-4 0h4"></path></svg>
            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize flex items-center ${roleInfo.colorClass}`}>
              {roleInfo.icon}
              {user.role}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 items-stretch md:items-center ml-0 md:ml-4">
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              setIsUpdateModalOpen(true);
            }}
            className={`text-sm px-4 py-2 border border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors duration-200 w-full md:w-auto text-center
              ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isUpdating}
             whileHover={{ scale: isUpdating ? 1 : 1.05 }}
             whileTap={{ scale: isUpdating ? 1 : 0.95 }}
          >
            {isUpdating ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin h-4 w-4 mr-1.5 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l2-2.647z"></path></svg>
                Updating...
              </div>
            ) : (
               <span className="flex items-center justify-center"><PencilIcon className="w-4 h-4 mr-1" />Update Role</span>
            )}
          </motion.button>
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              setIsDeleteDialogOpen(true);
            }}
            className={`text-sm px-4 py-2 bg-red-500 dark:bg-red-600 text-white font-semibold rounded-md hover:bg-red-600 dark:hover:bg-red-700 transition-colors duration-200 shadow-md w-full md:w-auto text-center
              ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isDeleting}
             whileHover={{ scale: isDeleting ? 1 : 1.05 }}
             whileTap={{ scale: isDeleting ? 1 : 0.95 }}
          >
            {isDeleting ? (
              <div className="flex items-center justify-center">
                 <svg className="animate-spin h-4 w-4 mr-1.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l2-2.647z"></path></svg>
                 Deleting...
              </div>
            ) : (
              <span className="flex items-center justify-center"><TrashIcon className="w-4 h-4 mr-1" />Delete</span>
            )}
          </motion.button>
        </div>
      </motion.div>

      <UpdateUserRoleModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onUpdate={handleUpdateRole}
        currentRole={user.role}
        userName={user.name}
      />

      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete User"
        message={`Are you sure you want to delete ${user.name}? This action cannot be undone.`}
      />

      <UserDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        userId={user._id}
      />
    </>
  );
};

export default UserRow; 