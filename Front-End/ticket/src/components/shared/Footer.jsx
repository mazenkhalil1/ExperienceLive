import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const currentYear = new Date().getFullYear();

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setIsSubscribing(true);
    try {
      // TODO: Implement newsletter subscription API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      toast.success('Successfully subscribed to newsletter!');
      setEmail('');
    } catch (error) {
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setIsSubscribing(false);
    }
  };

  const styles = {
    footer: {
      backgroundColor: '#f8f9fa',
      padding: '2rem 0',
      marginTop: 'auto',
      borderTop: '1px solid #dee2e6',
      width: '100%',
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 1rem',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '2rem',
    },
    section: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    },
    heading: {
      fontSize: '1.2rem',
      fontWeight: 'bold',
      color: '#212529',
      marginBottom: '0.5rem',
      position: 'relative',
      '&::after': {
        content: '""',
        position: 'absolute',
        bottom: '-5px',
        left: 0,
        width: '50px',
        height: '2px',
        backgroundColor: '#007bff',
      },
    },
    link: {
      color: '#6c757d',
      textDecoration: 'none',
      transition: 'color 0.2s',
      '&:hover': {
        color: '#007bff',
      },
    },
    copyright: {
      textAlign: 'center',
      padding: '1rem 0',
      marginTop: '2rem',
      borderTop: '1px solid #dee2e6',
      color: '#6c757d',
    },
    socialLinks: {
      display: 'flex',
      gap: '1rem',
      marginTop: '0.5rem',
    },
    newsletterForm: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      marginTop: '1rem',
    },
    input: {
      padding: '0.5rem',
      borderRadius: '4px',
      border: '1px solid #dee2e6',
      fontSize: '1rem',
    },
    button: {
      padding: '0.5rem 1rem',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      '&:hover': {
        backgroundColor: '#0056b3',
      },
      '&:disabled': {
        backgroundColor: '#ccc',
        cursor: 'not-allowed',
      },
    },
    socialIcon: {
      width: '24px',
      height: '24px',
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'scale(1.1)',
      },
    },
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
          <div style={styles.socialLinks}>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <img src="/icons/facebook.svg" alt="Facebook" style={styles.socialIcon} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <img src="/icons/twitter.svg" alt="Twitter" style={styles.socialIcon} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <img src="/icons/linkedin.svg" alt="LinkedIn" style={styles.socialIcon} />
            </a>
          </div>
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
        </div>

        <div style={styles.section}>
          <h3 style={styles.heading}>Newsletter</h3>
          <p style={{ color: '#6c757d' }}>
            Subscribe to our newsletter for updates on upcoming events and exclusive offers.
          </p>
          <form onSubmit={handleSubscribe} style={styles.newsletterForm}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              style={styles.input}
              aria-label="Email for newsletter"
            />
            <button
              type="submit"
              disabled={isSubscribing}
              style={styles.button}
            >
              {isSubscribing ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        </div>
      </div>

      <div style={styles.copyright}>
        © {currentYear} Ticketing System. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer; 