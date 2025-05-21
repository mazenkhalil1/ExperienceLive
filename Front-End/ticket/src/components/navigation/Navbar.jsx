import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../../context/UserContext';

function Navbar() {
  const { user, isAuthenticated, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Call the backend logout endpoint
      await axios.get('http://localhost:5000/api/v1/logOut', { withCredentials: true });
      
      // Clear user context
      logout();
      
      // Redirect to login
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      alert('Error during logout. Please try again.');
    }
  };

  const navStyle = {
    backgroundColor: '#333',
    padding: '1rem',
    color: 'white'
  };

  const containerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem'
  };

  const brandStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: 'white',
    textDecoration: 'none'
  };

  const navLinksStyle = {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center'
  };

  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    transition: 'background-color 0.2s'
  };

  const buttonStyle = {
    ...linkStyle,
    backgroundColor: '#dc3545',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem'
  };

  const buttonHoverStyle = {
    backgroundColor: '#c82333'
  };

  return (
    <nav style={navStyle}>
      <div style={containerStyle}>
        <Link to="/" style={brandStyle}>
          Ticketing System
        </Link>

        <div style={navLinksStyle}>
          {isAuthenticated ? (
            <>
              <Link to="/profile" style={linkStyle}>
                Profile
              </Link>
              {user?.role === 'admin' && (
                <Link to="/admin/dashboard" style={linkStyle}>
                  Admin Dashboard
                </Link>
              )}
              {user?.role === 'organizer' && (
                <Link to="/organizer/dashboard" style={linkStyle}>
                  Organizer Dashboard
                </Link>
              )}
              {user?.role === 'user' && (
                <Link to="/user/dashboard" style={linkStyle}>
                  User Dashboard
                </Link>
              )}
              <button 
                onClick={handleLogout}
                style={buttonStyle}
                onMouseOver={(e) => e.target.style.backgroundColor = buttonHoverStyle.backgroundColor}
                onMouseOut={(e) => e.target.style.backgroundColor = buttonStyle.backgroundColor}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={linkStyle}>
                Login
              </Link>
              <Link to="/register" style={linkStyle}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 