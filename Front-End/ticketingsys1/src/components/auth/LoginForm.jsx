import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      }, { withCredentials: true });

      console.log('Login success:', res.data);
      // redirect to homepage or dashboard
      navigate('/');
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      alert('Login failed');
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
          style={{ display: 'block', width: '100%', marginBottom: '10px' }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ display: 'block', width: '100%', marginBottom: '10px' }}
        />

        <button type="submit" style={{ width: '100%' }}>
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginForm;