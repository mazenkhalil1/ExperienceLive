import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('🔍 Submitting login form...');
    console.log('📧 Email:', email);
    console.log('🔑 Password:', password);

    try {
      console.log('🚀 Sending POST request to /api/v1/login...');
      const res = await axios.post('http://localhost:5000/api/v1/login', {
        email,
        password
      }, { withCredentials: true });

      console.log('✅ Login successful:', res.data);
      alert('Login successful');
      navigate('/');
    } catch (err) {
      console.log('❌ Login failed!');
      if (err.response) {
        console.log('🔁 Server responded with status:', err.response.status);
        console.log('📦 Response data:', err.response.data);
        alert('Login failed: ' + (err.response.data.message || 'Unknown error'));
      } else {
        console.log('📡 Network error or server down');
        alert('Login failed: Network error');
      }
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
          onChange={(e) => {
            console.log('📥 Email changed to:', e.target.value);
            setEmail(e.target.value);
          }}
          required
          style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            console.log('🔐 Password changed');
            setPassword(e.target.value);
          }}
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
