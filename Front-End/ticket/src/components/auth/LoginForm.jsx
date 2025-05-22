import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { showToast } from '../shared/Toast';
import axiosInstance from '../../services/axiosConfig';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axiosInstance.post('/login', {
        email,
        password
      });

      // Store token in localStorage
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
      }

      // Update user context with the user data
      if (res.data.user) {
        login(res.data.user);
        showToast.success('Login successful!');
        
        // Redirect based on role
        switch (res.data.user.role) {
          case 'admin':
            navigate('/admin/dashboard');
            break;
          case 'organizer':
            navigate('/organizer/dashboard');
            break;
          case 'user':
            navigate('/user/dashboard');
            break;
          default:
            navigate('/profile');
        }
      } else {
        throw new Error('No user data received');
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.response) {
        showToast.error(err.response.data.message || 'Login failed');
      } else {
        showToast.error('Network error. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
          style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
          style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
        />
        <button 
          type="submit"
          disabled={isLoading}
          style={{ 
            width: '100%', 
            padding: '10px', 
            backgroundColor: isLoading ? '#ccc' : '#007bff', 
            color: 'white', 
            border: 'none',
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? 'Logging in...' : 'Login'}
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
