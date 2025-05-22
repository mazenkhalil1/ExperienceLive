import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../../context/UserContext';
import { showToast } from '../shared/Toast';

function UpdateProfile() {
  const { user, updateUser } = useUser();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profilePicture: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        profilePicture: user.profilePicture || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate name length
      if (formData.name.length < 3 || formData.name.length > 30) {
        showToast.error('Name must be between 3 and 30 characters');
        setIsLoading(false);
        return;
      }

      const res = await axios.put(
        'http://localhost:5000/api/v1/users/profile',
        formData,
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (res.data.user) {
        updateUser(res.data.user);
        showToast.success('Profile updated successfully!');
        navigate('/profile');
      } else {
        throw new Error('No user data received');
      }
    } catch (err) {
      console.error('Update profile error:', err);
      if (err.response) {
        showToast.error(err.response.data.message || 'Failed to update profile');
      } else {
        showToast.error('Network error. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const containerStyle = {
    maxWidth: '400px',
    margin: '50px auto',
    padding: '20px'
  };

  const formStyle = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px'
  };

  const buttonStyle = {
    width: '100%',
    padding: '12px',
    backgroundColor: isLoading ? '#ccc' : '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: isLoading ? 'not-allowed' : 'pointer',
    marginTop: '10px'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '5px',
    color: '#333',
    fontWeight: '500'
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Update Profile</h2>
      <form onSubmit={handleSubmit} style={formStyle}>
        <div>
          <label htmlFor="name" style={labelStyle}>Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            minLength={3}
            maxLength={30}
            style={inputStyle}
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="email" style={labelStyle}>Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={inputStyle}
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="profilePicture" style={labelStyle}>Profile Picture URL (optional)</label>
          <input
            type="url"
            id="profilePicture"
            name="profilePicture"
            value={formData.profilePicture}
            onChange={handleChange}
            placeholder="https://example.com/profile-picture.jpg"
            style={inputStyle}
            disabled={isLoading}
          />
        </div>

        <button type="submit" style={buttonStyle} disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Update Profile'}
        </button>

        <button
          type="button"
          onClick={() => navigate('/profile')}
          style={{
            ...buttonStyle,
            backgroundColor: '#6c757d',
            marginTop: '10px'
          }}
          disabled={isLoading}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default UpdateProfile; 