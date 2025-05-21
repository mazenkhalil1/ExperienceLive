import React from 'react';
<<<<<<< HEAD
import { useUser } from '../../context/UserContext';
import Loader from '../shared/Loader';
import { showToast } from '../shared/Toast';

const ProfilePage = () => {
  const { user, loading, error } = useUser();

  const containerStyle = {
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto'
  };

  const cardStyle = {
    border: '1px solid #ccc',
    padding: '20px',
    borderRadius: '4px',
    backgroundColor: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  const headingStyle = {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333'
  };

  const infoGroupStyle = {
    marginBottom: '15px',
    padding: '10px',
    borderBottom: '1px solid #eee'
  };

  const labelStyle = {
    fontWeight: 'bold',
    marginRight: '10px',
    color: '#666'
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <Loader size="large" />
      </div>
    );
  }

  if (error) {
    showToast.error(error);
    return (
      <div style={containerStyle}>
        <div style={{ color: '#dc3545', textAlign: 'center' }}>
          Error loading profile. Please try again later.
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: 'center', color: '#666' }}>
          No profile data available
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={headingStyle}>Profile Information</h1>
        <div>
          <div style={infoGroupStyle}>
            <span style={labelStyle}>Name:</span>
            <span>{user.name}</span>
          </div>
          <div style={infoGroupStyle}>
            <span style={labelStyle}>Email:</span>
            <span>{user.email}</span>
          </div>
          <div style={infoGroupStyle}>
            <span style={labelStyle}>Role:</span>
            <span style={{ 
              textTransform: 'capitalize',
              color: user.role === 'admin' ? '#dc3545' : 
                     user.role === 'organizer' ? '#28a745' : '#007bff'
            }}>
              {user.role}
            </span>
          </div>
          <div style={infoGroupStyle}>
            <span style={labelStyle}>Member Since:</span>
            <span>{new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 
=======
import { useAuth } from '../../context/AuthContext';
import UpdateProfileForm from './UpdateProfileForm';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Profile Information
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Personal details and account information.
            </p>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Full name</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user?.name}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Email address</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user?.email}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Role</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Account created</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {new Date(user?.createdAt).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-8">
          <UpdateProfileForm />
        </div>
      </div>
    </div>
  );
} 
>>>>>>> Gengo
