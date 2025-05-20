import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const styles = {
    footer: {
      backgroundColor: '#f8f9fa',
      padding: '2rem 0',
      marginTop: 'auto',
      borderTop: '1px solid #dee2e6'
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 1rem',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '2rem'
    },
    section: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    },
    heading: {
      fontSize: '1.2rem',
      fontWeight: 'bold',
      color: '#212529',
      marginBottom: '0.5rem'
    },
    link: {
      color: '#6c757d',
      textDecoration: 'none',
      transition: 'color 0.2s',
      '&:hover': {
        color: '#007bff'
      }
    },
    copyright: {
      textAlign: 'center',
      padding: '1rem 0',
      marginTop: '2rem',
      borderTop: '1px solid #dee2e6',
      color: '#6c757d'
    },
    socialLinks: {
      display: 'flex',
      gap: '1rem',
      marginTop: '0.5rem'
    }
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.section}>
          <h3 style={styles.heading}>About Us</h3>
          <p style={{ color: '#6c757d' }}>
            Your trusted platform for event ticketing and management.
            We connect event organizers with attendees seamlessly.
          </p>
        </div>

        <div style={styles.section}>
          <h3 style={styles.heading}>Quick Links</h3>
          <Link to="/" style={styles.link}>Home</Link>
          <Link to="/events" style={styles.link}>Events</Link>
          <Link to="/about" style={styles.link}>About</Link>
          <Link to="/contact" style={styles.link}>Contact</Link>
        </div>

        <div style={styles.section}>
          <h3 style={styles.heading}>Contact Us</h3>
          <p style={{ color: '#6c757d' }}>
            Email: support@ticketing.com<br />
            Phone: +1 (555) 123-4567<br />
            Address: 123 Event Street, City, Country
          </p>
          <div style={styles.socialLinks}>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={styles.link}>
              Facebook
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={styles.link}>
              Twitter
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={styles.link}>
              LinkedIn
            </a>
          </div>
        </div>
      </div>

      <div style={styles.copyright}>
        © {currentYear} Ticketing System. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer; 