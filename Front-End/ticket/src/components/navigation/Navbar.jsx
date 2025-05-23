import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../../context/UserContext';

function Navbar() {
  const { user, isAuthenticated, logout } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const styles = {
    nav: {
      backgroundColor: '#333',
      padding: '1rem',
      color: 'white',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
    },
    container: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 1rem',
    },
    brand: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: 'white',
      textDecoration: 'none',
    },
    navLinks: {
      display: windowWidth > 768 ? 'flex' : isMobileMenuOpen ? 'flex' : 'none',
      flexDirection: windowWidth > 768 ? 'row' : 'column',
      gap: '1rem',
      alignItems: windowWidth > 768 ? 'center' : 'flex-start',
      position: windowWidth > 768 ? 'static' : 'absolute',
      top: windowWidth > 768 ? 'auto' : '100%',
      left: 0,
      right: 0,
      backgroundColor: windowWidth > 768 ? 'transparent' : '#333',
      padding: windowWidth > 768 ? 0 : '1rem',
    },
    link: (isActive) => ({
      color: 'white',
      textDecoration: 'none',
      padding: '0.5rem 1rem',
      borderRadius: '4px',
      transition: 'background-color 0.2s',
      backgroundColor: isActive ? '#555' : 'transparent',
      '&:hover': {
        backgroundColor: '#444',
      },
    }),
    button: {
      backgroundColor: '#dc3545',
      border: 'none',
      cursor: 'pointer',
      fontSize: '1rem',
      color: 'white',
      padding: '0.5rem 1rem',
      borderRadius: '4px',
      transition: 'background-color 0.2s',
    },
    hamburger: {
      display: windowWidth <= 768 ? 'block' : 'none',
      background: 'none',
      border: 'none',
      color: 'white',
      fontSize: '1.5rem',
      cursor: 'pointer',
    },
    userAvatar: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem',
      borderRadius: '4px',
      backgroundColor: '#444',
    },
    avatarImage: {
      width: '30px',
      height: '30px',
      borderRadius: '50%',
      objectFit: 'cover',
    },
  };

  const NavLink = ({ to, children }) => {
    const isActive = location.pathname === to;
    return (
      <Link to={to} style={styles.link(isActive)}>
        {children}
      </Link>
    );
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link to="/" style={styles.brand}>
          Ticketing System
        </Link>

        <button
          style={styles.hamburger}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          ☰
        </button>

        <div style={styles.navLinks}>
          {isAuthenticated ? (
            <>
              <div style={styles.userAvatar}>
                <img
                  src={user?.profilePicture || '/default-avatar.png'}
                  alt="User avatar"
                  style={styles.avatarImage}
                />
                <span>{user?.name}</span>
              </div>
              <NavLink to="/profile">Profile</NavLink>
              {user?.role === 'admin' && (
                <>
                  <NavLink to="/admin/dashboard">Admin Dashboard</NavLink>
                  <NavLink to="/admin/users">Manage Users</NavLink>
                </>
              )}
              {user?.role === 'organizer' && (
                <NavLink to="/organizer/events">My Events</NavLink>
              )}
              {user?.role === 'user' && (
                <NavLink to="/user/dashboard">User Dashboard</NavLink>
              )}
              <button 
                onClick={handleLogout}
                style={styles.button}
                onMouseOver={(e) => e.target.style.backgroundColor = '#c82333'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 