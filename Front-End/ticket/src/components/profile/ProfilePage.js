import React from 'react';
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