import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RegisterForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user', // default role
    profilePicture: '' // optional
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Role options with descriptions
  const roleOptions = [
    {
      value: 'user',
      label: 'Standard User',
      description: 'Browse and book tickets for events'
    },
    {
      value: 'organizer',
      label: 'Event Organizer',
      description: 'Create and manage your own events'
    }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate name length
    if (formData.name.length < 3 || formData.name.length > 30) {
      setError('Name must be between 3 and 30 characters');
      return;
    }

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      // Remove confirmPassword before sending to backend
      const { confirmPassword, ...registrationData } = formData;
      
      const res = await axios.post('http://localhost:5000/api/v1/register', registrationData);
      console.log('Registration success:', res.data);
      alert('Registered successfully');
      navigate('/login');
    } catch (err) {
      console.error('Registration error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h2>Register</h2>
      
      {error && (
        <div style={{ 
          color: 'red', 
          backgroundColor: '#ffebee', 
          padding: '10px', 
          marginBottom: '15px', 
          borderRadius: '4px' 
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="name" style={{ display: 'block', marginBottom: '5px' }}>
            Full Name (3-30 characters)
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
            minLength={3}
            maxLength={30}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>
            Password (min. 6 characters)
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: '5px' }}>
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            minLength={6}
            style={{ 
              width: '100%', 
              padding: '8px', 
              borderRadius: '4px', 
              border: '1px solid #ccc',
              backgroundColor: formData.password !== formData.confirmPassword && formData.confirmPassword ? '#fff3f3' : 'white'
            }}
          />
          {formData.password !== formData.confirmPassword && formData.confirmPassword && (
            <div style={{ color: '#dc3545', fontSize: '0.875rem', marginTop: '5px' }}>
              Passwords do not match
            </div>
          )}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="role" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Select Your Role
          </label>
          <div style={{ 
            border: '1px solid #ccc', 
            borderRadius: '4px', 
            padding: '10px',
            backgroundColor: '#f8f9fa'
          }}>
            {roleOptions.map(option => (
              <div 
                key={option.value}
                style={{ 
                  marginBottom: '10px',
                  padding: '10px',
                  border: formData.role === option.value ? '2px solid #007bff' : '1px solid #ddd',
                  borderRadius: '4px',
                  backgroundColor: formData.role === option.value ? '#e3f2fd' : 'white',
                  cursor: 'pointer'
                }}
                onClick={() => handleChange({ target: { name: 'role', value: option.value } })}
              >
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                  <input
                    type="radio"
                    id={`role-${option.value}`}
                    name="role"
                    value={option.value}
                    checked={formData.role === option.value}
                    onChange={handleChange}
                    style={{ marginRight: '10px' }}
                  />
                  <label 
                    htmlFor={`role-${option.value}`}
                    style={{ 
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      margin: 0
                    }}
                  >
                    {option.label}
                  </label>
                </div>
                <div style={{ 
                  marginLeft: '24px', 
                  color: '#666',
                  fontSize: '0.9em'
                }}>
                  {option.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="profilePicture" style={{ display: 'block', marginBottom: '5px' }}>
            Profile Picture URL (optional)
          </label>
          <input
            id="profilePicture"
            name="profilePicture"
            type="url"
            value={formData.profilePicture}
            onChange={handleChange}
            placeholder="https://example.com/profile-picture.jpg"
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        <button 
          type="submit"
          style={{ 
            width: '100%', 
            padding: '10px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1.1em',
            fontWeight: 'bold'
          }}
        >
          Register
        </button>
      </form>

      <div style={{ marginTop: '15px', textAlign: 'center' }}>
        <button 
          onClick={() => navigate('/login')}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: '#007bff', 
            cursor: 'pointer' 
          }}
        >
          Already have an account? Login
        </button>
      </div>
    </div>
  );
}

export default RegisterForm;
