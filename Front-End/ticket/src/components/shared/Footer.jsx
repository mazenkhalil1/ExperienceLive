import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

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

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 py-12 mt-auto border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

        {/* About Us */}
        <div className="flex flex-col">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 relative after:absolute after:bottom-[-8px] after:left-0 after:w-12 after:h-0.5 after:bg-blue-500">
            About Us
          </h3>
          <p className="text-sm leading-relaxed">
            Your trusted platform for event ticketing and management.
            We connect event organizers with attendees seamlessly.
          </p>
          <div className="flex space-x-4 mt-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:scale-110 transition-transform duration-200">
              {/* Replace with actual SVG icons or use a library */}
              <img src="/icons/facebook.svg" alt="Facebook" className="w-6 h-6" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:scale-110 transition-transform duration-200">
               {/* Replace with actual SVG icons or use a library */}
              <img src="/icons/twitter.svg" alt="Twitter" className="w-6 h-6" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:scale-110 transition-transform duration-200">
               {/* Replace with actual SVG icons or use a library */}
              <img src="/icons/linkedin.svg" alt="LinkedIn" className="w-6 h-6" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 relative after:absolute after:bottom-[-8px] after:left-0 after:w-12 after:h-0.5 after:bg-blue-500">
            Quick Links
          </h3>
          <Link to="/" className="text-sm hover:text-blue-500 transition-colors duration-200">Home</Link>
          <Link to="/events" className="text-sm hover:text-blue-500 transition-colors duration-200">Events</Link>
          <Link to="/about" className="text-sm hover:text-blue-500 transition-colors duration-200">About</Link>
          <Link to="/contact" className="text-sm hover:text-blue-500 transition-colors duration-200">Contact</Link>
        </div>

        {/* Contact Us */}
        <div className="flex flex-col">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 relative after:absolute after:bottom-[-8px] after:left-0 after:w-12 after:h-0.5 after:bg-blue-500">
            Contact Us
          </h3>
          <p className="text-sm leading-relaxed">
            Email: <a href="mailto:support@ticketing.com" className="hover:text-blue-500 transition-colors duration-200">support@ticketing.com</a><br />
            Phone: +1 (555) 123-4567<br />
            Address: 123 Event Street, City, Country
          </p>
        </div>

        {/* Newsletter */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col"
        >
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 relative after:absolute after:bottom-[-8px] after:left-0 after:w-12 after:h-0.5 after:bg-blue-500">
            Newsletter
          </h3>
          <p className="text-sm leading-relaxed mb-4">
            Subscribe to our newsletter for updates on upcoming events and exclusive offers.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 transition-colors duration-200"
              aria-label="Email for newsletter"
            />
            <motion.button
              type="submit"
              disabled={isSubscribing}
              className={
                `w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md
                 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500
                 disabled:opacity-50 disabled:cursor-not-allowed
                 transition-colors duration-200
                 ${isSubscribing ? 'flex items-center justify-center' : ''}`
              }
              whileHover={{ scale: isSubscribing ? 1 : 1.02 }}
              whileTap={{ scale: isSubscribing ? 1 : 0.98 }}
            >
              {isSubscribing ? (
                 <div className="flex items-center">
                    <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l2-2.647z"></path></svg>
                    Subscribing...
                 </div>
              ) : (
                'Subscribe'
              )}
            </motion.button>
          </form>
        </motion.div>

      </div>

      {/* Copyright */}
      <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
        © {currentYear} Ticketing System. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer; 