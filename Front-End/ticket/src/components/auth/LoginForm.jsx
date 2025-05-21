import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../../context/UserContext';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { refreshUser } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      console.log('🚀 Sending login request...');
      const res = await axios.post('http://localhost:5000/api/v1/login', {
        email,
        password
      }, { 
        withCredentials: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Login response:', {
        status: res.status,
        statusText: res.statusText,
        headers: res.headers,
        data: res.data,
        cookies: document.cookie
      });

      if (!res.data.success) {
        throw new Error(res.data.message || 'Login failed');
      }

      // Store token in memory for immediate use
      const token = res.data.token;
      if (token) {
        // Set default authorization header for subsequent requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }

      // Wait a moment to ensure cookie is set
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Debug: Check if token cookie exists
      const cookies = document.cookie.split(';');
      console.log('🍪 All cookies after login:', cookies);
      const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
      console.log('🔑 Token cookie after login:', tokenCookie ? tokenCookie : 'not found');

      if (!tokenCookie) {
        console.warn('⚠️ Token cookie not set, but proceeding with token from response');
      }

      // Refresh user data in context
      await refreshUser();
      
      // Navigate to profile page
      navigate('/profile');
    } catch (err) {
      console.error('❌ Login error:', {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        headers: err.response?.headers,
        cookies: document.cookie
      });
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto' }}>
      <h2>Login</h2>
      {error && (
        <div style={{ 
          color: 'red', 
          marginBottom: '10px', 
          padding: '10px', 
          backgroundColor: '#ffebee', 
          borderRadius: '4px' 
        }}>
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
        />
        <button 
          type="submit"
          style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none' }}
        >
          Login
        </button>
      </form>
      
      <div style={{ marginTop: '15px', textAlign: 'center' }}>
        <Link to="/forget-password" style={{ color: '#007bff', textDecoration: 'none' }}>
          Forgot Password?
        </Link>
      </div>
    </div>
  );
}

export default LoginForm;
