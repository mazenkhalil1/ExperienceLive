import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ForgetPasswordForm() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1); // 1: Email entry, 2: OTP verification
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await axios.put('http://localhost:5000/api/v1/forgetPassword', { email });
      setMessage('OTP sent to your email. Please check and enter below.');
      setStep(2);
      console.log('OTP request success:', res.data);
    } catch (err) {
      console.error('OTP request error:', err.response?.data || err.message);
      setMessage(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await axios.put('http://localhost:5000/api/v1/resetPassword', {
        email,
        otp,
        newPassword
      });
      
      setMessage('Password reset successful!');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error('Password reset error:', err.response?.data || err.message);
      setMessage(err.response?.data?.message || 'Failed to reset password. Please try again.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto' }}>
      <h2>Reset Password</h2>
      
      {message && (
        <div style={{ 
          padding: '10px', 
          marginBottom: '15px', 
          backgroundColor: message.includes('successful') ? '#d4edda' : '#f8d7da',
          color: message.includes('successful') ? '#155724' : '#721c24',
          borderRadius: '4px'
        }}>
          {message}
        </div>
      )}

      {step === 1 ? (
        <form onSubmit={handleRequestOTP}>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
              cursor: 'pointer' 
            }}
          >
            Request OTP
          </button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword}>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="otp" style={{ display: 'block', marginBottom: '5px' }}>Enter OTP</label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="newPassword" style={{ display: 'block', marginBottom: '5px' }}>New Password</label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
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
              cursor: 'pointer' 
            }}
          >
            Reset Password
          </button>
        </form>
      )}
      
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button 
          onClick={() => navigate('/login')} 
          style={{ 
            background: 'none', 
            border: 'none', 
            color: '#007bff', 
            cursor: 'pointer' 
          }}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}

export default ForgetPasswordForm;
