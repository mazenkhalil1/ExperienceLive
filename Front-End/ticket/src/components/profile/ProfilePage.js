import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import Loader from '../shared/Loader';
import { showToast } from '../shared/Toast';
import UpdateProfileForm from './UpdateProfileForm';

const ProfilePage = () => {
  const { user, loading, error } = useUser();
  const [isEditing, setIsEditing] = useState(false);

  const styles = {
    container: {
      padding: '20px',
      maxWidth: '600px',
      margin: '0 auto'
    },
    card: {
      border: '1px solid #ccc',
      padding: '20px',
      borderRadius: '8px',
      backgroundColor: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
      paddingBottom: '10px',
      borderBottom: '1px solid #eee'
    },
    heading: {
      margin: 0,
      color: '#333',
      fontSize: '1.5rem'
    },
    editButton: {
      padding: '8px 16px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      '&:hover': {
        backgroundColor: '#0056b3'
      }
    },
    infoGroup: {
      marginBottom: '15px',
      padding: '10px',
      borderBottom: '1px solid #eee',
      display: 'flex',
      alignItems: 'center'
    },
    label: {
      fontWeight: 'bold',
      marginRight: '10px',
      color: '#666',
      width: '120px'
    },
    value: {
      flex: 1
    },
    profilePicture: {
      width: '100px',
      height: '100px',
      borderRadius: '50%',
      objectFit: 'cover',
      marginBottom: '20px',
      border: '3px solid #fff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    roleTag: {
      display: 'inline-block',
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '0.875rem',
      fontWeight: '500',
      textTransform: 'capitalize'
    }
  };

  const getRoleStyle = (role) => {
    switch (role) {
      case 'admin':
        return { backgroundColor: '#dc3545', color: 'white' };
      case 'organizer':
        return { backgroundColor: '#28a745', color: 'white' };
      default:
        return { backgroundColor: '#007bff', color: 'white' };
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <Loader type="spinner" size="large" text="Loading profile..." />
      </div>
    );
  }

  if (error) {
    showToast.error(error);
    return (
      <div style={styles.container}>
        <div style={{ color: '#dc3545', textAlign: 'center' }}>
          Error loading profile. Please try again later.
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={styles.container}>
        <div style={{ textAlign: 'center', color: '#666' }}>
          No profile data available
        </div>
      </div>
    );
  }

  const handleUpdateSuccess = () => {
    setIsEditing(false);
    showToast.success('Profile updated successfully!');
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.heading}>Profile Information</h1>
          <button
            style={styles.editButton}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {isEditing ? (
          <UpdateProfileForm onUpdateSuccess={handleUpdateSuccess} />
        ) : (
          <>
            {user.profilePicture && (
              <img
                src={user.profilePicture}
                alt={`${user.name}'s profile`}
                style={styles.profilePicture}
              />
            )}
            
            <div style={styles.infoGroup}>
              <span style={styles.label}>Name:</span>
              <span style={styles.value}>{user.name}</span>
            </div>
            
            <div style={styles.infoGroup}>
              <span style={styles.label}>Email:</span>
              <span style={styles.value}>{user.email}</span>
            </div>
            
            <div style={styles.infoGroup}>
              <span style={styles.label}>Role:</span>
              <span 
                style={{
                  ...styles.roleTag,
                  ...getRoleStyle(user.role)
                }}
              >
                {user.role}
              </span>
            </div>
            
            <div style={styles.infoGroup}>
              <span style={styles.label}>Member Since:</span>
              <span style={styles.value}>
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage; 