import React, { useState } from 'react';
import UpdateUserRoleModal from './UpdateUserRoleModal';
import ConfirmationDialog from './ConfirmationDialog';

const UserRow = ({ user, onUpdateRole, onDelete }) => {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleUpdateRole = (newRole) => {
    console.log('UserRow: handleUpdateRole triggered for user ID:', user._id);
    console.log('UserRow: Calling onUpdateRole prop');
    onUpdateRole(user._id, newRole);
    setIsUpdateModalOpen(false);
  };

  const handleDelete = () => {
    console.log('UserRow: handleDelete triggered for user ID:', user._id);
    console.log('UserRow: Calling onDelete prop');
    onDelete(user._id);
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <tr className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm font-medium text-gray-900">{user.name}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-500">{user.email}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
            ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
              user.role === 'organizer' ? 'bg-blue-100 text-blue-800' : 
              'bg-green-100 text-green-800'}`}>
            {user.role}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <button
            onClick={() => setIsUpdateModalOpen(true)}
            className="text-indigo-600 hover:text-indigo-900 mr-4"
          >
            Update Role
          </button>
          <button
            onClick={() => setIsDeleteDialogOpen(true)}
            className="text-red-600 hover:text-red-900"
          >
            Delete
          </button>
        </td>
      </tr>

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
    </>
  );
};

export default UserRow; 