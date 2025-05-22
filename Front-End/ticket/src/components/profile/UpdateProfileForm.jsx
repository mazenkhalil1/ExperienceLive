import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import { showToast } from '../shared/Toast';
import Loader from '../shared/Loader';
import axiosInstance from '../../services/axiosConfig';

const UpdateProfileForm = ({ onUpdateSuccess }) => {
  const { user, login } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    profilePicture: user?.profilePicture || '',
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters long';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Profile picture URL validation (optional)
    if (formData.profilePicture && !isValidUrl(formData.profilePicture)) {
      newErrors.profilePicture = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast.error('Please fix the errors in the form');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosInstance.put('/users/profile', formData);

      if (response.data) {
        showToast.success('Profile updated successfully!');
        login(response.data.data);
        if (onUpdateSuccess) onUpdateSuccess();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      showToast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const styles = {
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      maxWidth: '400px',
      margin: '0 auto',
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
    },
    label: {
      fontSize: '0.9rem',
      color: '#666',
      fontWeight: '500',
    },
    input: {
      padding: '0.75rem',
      borderRadius: '4px',
      border: '1px solid #ddd',
      fontSize: '1rem',
      transition: 'border-color 0.2s',
    },
    error: {
      color: '#dc3545',
      fontSize: '0.8rem',
      marginTop: '0.25rem',
    },
    button: {
      padding: '0.75rem',
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      '&:hover': {
        backgroundColor: '#0056b3',
      },
      '&:disabled': {
        backgroundColor: '#ccc',
        cursor: 'not-allowed',
      },
    },
  };

  if (isLoading) {
    return <Loader type="spinner" text="Updating profile..." />;
  }

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.formGroup}>
        <label htmlFor="name" style={styles.label}>Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          style={{
            ...styles.input,
            borderColor: errors.name ? '#dc3545' : '#ddd',
          }}
          placeholder="Enter your name"
        />
        {errors.name && <span style={styles.error}>{errors.name}</span>}
      </div>

      <div style={styles.formGroup}>
        <label htmlFor="email" style={styles.label}>Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          style={{
            ...styles.input,
            borderColor: errors.email ? '#dc3545' : '#ddd',
          }}
          placeholder="Enter your email"
        />
        {errors.email && <span style={styles.error}>{errors.email}</span>}
      </div>

      <div style={styles.formGroup}>
        <label htmlFor="profilePicture" style={styles.label}>Profile Picture URL (Optional)</label>
        <input
          type="url"
          id="profilePicture"
          name="profilePicture"
          value={formData.profilePicture}
          onChange={handleChange}
          style={{
            ...styles.input,
            borderColor: errors.profilePicture ? '#dc3545' : '#ddd',
          }}
          placeholder="Enter profile picture URL"
        />
        {errors.profilePicture && <span style={styles.error}>{errors.profilePicture}</span>}
      </div>

      <button
        type="submit"
        style={styles.button}
        disabled={isLoading}
      >
        {isLoading ? 'Updating...' : 'Update Profile'}
      </button>
    </form>
  );
};

export default UpdateProfileForm; 