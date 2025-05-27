import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '../../services/axiosConfig';
import { showToast } from '../shared/Toast';
import Loader from '../shared/Loader';
import { useUser } from '../../context/UserContext';
import BookTicketForm from '../bookings/BookTicketForm';
import { useTheme } from '../../context/ThemeContext';
import { ROUTES } from '../../constants/routes';
import { Link } from 'react-router-dom';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useUser();
  const { isDarkMode } = useTheme();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);

  const fetchEventDetails = async () => {
    try {
      const response = await axiosInstance.get(`/events/${id}`);
      if (response.data.success) {
        setEvent(response.data.data);
      } else {
        throw new Error('Failed to fetch event details');
      }
    } catch (err) {
      console.error('Error fetching event details:', err);
      setError(err.response?.data?.message || 'Failed to load event details');
      showToast.error('Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventDetails();
  }, [id, fetchEventDetails]);

  const handleBookingComplete = () => {
    showToast.success('Booking completed successfully!');
    navigate(ROUTES.BOOKINGS);
  };

  const handleBuyNowClick = (ticketTypeId) => {
    if (isAuthenticated) {
      setShowBookingForm(true);
    } else {
      showToast.info('Please login to book tickets.');
      navigate(ROUTES.LOGIN, { 
        state: { 
          from: `/events/${id}`,
          message: 'Please login to book tickets for this event.'
        } 
      });
    }
  };

  if (loading) return <Loader />;
  if (error) return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center text-red-500 dark:text-red-400 py-8"
    >
      {error}
    </motion.div>
  );
  if (!event) return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-8 text-gray-600 dark:text-gray-400"
    >
      Event not found
    </motion.div>
  );

  const eventDateTime = new Date(event.date);
  const formattedDate = eventDateTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const formattedTime = event.time || eventDateTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });


  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className=""
    >

      {/* Hero Section with Image and Title */}
      <div className="relative h-[50vh] md:h-[60vh] lg:h-[70vh] overflow-hidden">
        <img
          src={event.image || 'https://via.placeholder.com/1200x600'}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex items-end pb-12 px-8">
            <div className="max-w-5xl mx-auto w-full text-white">
                <motion.h1 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-4xl md:text-6xl font-bold drop-shadow-lg"
                >
                    {event.title}
                </motion.h1>
                <motion.p 
                     initial={{ y: 20, opacity: 0 }}
                     animate={{ y: 0, opacity: 1 }}
                     transition={{ delay: 0.4 }}
                     className="text-xl md:text-2xl mt-2 drop-shadow-lg"
                >
                    {event.location}
                </motion.p>
            </div>
        </div>
         {/* Optional: Location/City text above the banner */}
         {/* <div className="absolute top-0 left-0 right-0 text-center py-4 text-white bg-black/30 z-10">
             <h2 className="text-lg md:text-xl font-semibold">{event.location}</h2>
         </div> */}
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-[-8vh] z-10 relative">
        <motion.div 
           initial={{ y: 20, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           transition={{ delay: 0.5 }}
           className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-center"
        >
          {/* Event Info */}
          <div className="md:col-span-2">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-4">{event.title}</h2>
            <div className="space-y-3 text-gray-600 dark:text-gray-300">
              <div className="flex items-center">
                 <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                 <span>{formattedDate} at {formattedTime}</span>
              </div>
               <div className="flex items-center">
                 <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                 <span>{event.location}</span>
              </div>
            </div>
          </div>

          {/* Organizer Info */}
          <div className="md:col-span-1 text-left md:text-right">
             <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Organized by:</h3>
             <p className="text-gray-600 dark:text-gray-300">{event.organizer?.name || 'N/A'}</p>
             {/* <p className="text-gray-600 dark:text-gray-300">{event.organizer?.email || 'N/A'}</p> */}
          </div>
           {/* Main 'Book Now' button and calendar icon - keeping for now, integration with ticket types needed */}
           {/* <div className="md:col-span-3 flex items-center justify-start md:justify-end space-x-4 mt-4">
              <motion.button
                 onClick={() => setShowBookingForm(!showBookingForm)}
                 className="px-6 py-3 bg-yellow-500 text-gray-900 font-bold rounded-lg shadow-lg hover:bg-yellow-600 transition-colors duration-200"
                 whileHover={{ scale: 1.02 }}
                 whileTap={{ scale: 0.98 }}
              >
                 Book Now
              </motion.button>
              <button className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              </button>
           </div> */}
        </motion.div>

        {/* About Event Section */}
        <motion.div 
           initial={{ y: 20, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           transition={{ delay: 0.6 }}
           className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8"
        >
           <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">About Event</h2>
           <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{event.description}</p>
        </motion.div>

         {/* Tickets Section */}
        {/* Removed the old ticket types section */}

         {/* Venue Section */}
         {event.venue && (
            <motion.div 
               initial={{ y: 20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ delay: 0.8 }}
               className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8"
            >
               <div>
                   <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Venue</h2>
                   <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">{event.venue.name}</h3>
                   <p className="text-gray-600 dark:text-gray-400">{event.venue.location}</p>

                   {/* Venue Links */}
                   <div className="flex space-x-4 mt-4">
                       {event.venue.profileUrl && (
                          <a href={event.venue.profileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                             Open Venue Profile
                          </a>
                       )}
                       {event.venue.mapUrl && (
                           <a href={event.venue.mapUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                              Open In Maps
                           </a>
                       )}
                   </div>

                   {/* Facilities */}
                   {event.venue.facilities && event.venue.facilities.length > 0 && (
                       <div className="mt-6">
                           <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Facilities</h4>
                           <div className="grid grid-cols-2 gap-4 text-gray-600 dark:text-gray-300">
                               {event.venue.facilities.map((facility, index) => (
                                   <div key={index} className="flex items-center">
                                        {/* Facility Icon - using generic icons for now */}
                                        <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                        <span>{facility}</span>
                                   </div>
                               ))}
                           </div>
                       </div>
                   )}
               </div>
               
               {/* Venue Image */}
               {event.venue.image && (
                  <div>
                     <img 
                         src={event.venue.image}
                         alt="Venue Image"
                         className="w-full h-64 object-cover rounded-lg shadow-md"
                     />
                  </div>
               )}

            </motion.div>
         )}

        {/* Booking Section */}
        <div className="md:col-span-3 flex flex-col items-center space-y-4 mt-4">
          {!isAuthenticated ? (
            <div className="text-center space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                Please log in to book tickets.
              </p>
              <Link
                to={ROUTES.LOGIN}
                state={{ from: `/events/${id}`, message: 'Please login to book tickets for this event.' }}
                className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg shadow-lg hover:bg-blue-600 transition-colors duration-200"
              >
                Login to Book
              </Link>
            </div>
          ) : (
             // Only show if user has the 'user' role
             user?.role === 'user' && (
              <motion.button
                onClick={() => setShowBookingForm(!showBookingForm)}
                className="px-6 py-3 bg-yellow-500 text-gray-900 font-bold rounded-lg shadow-lg hover:bg-yellow-600 transition-colors duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Book Now
              </motion.button>
            )
          )}

          <AnimatePresence>
            {showBookingForm && event && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4"
              >
                <BookTicketForm event={event} onClose={() => setShowBookingForm(false)} onBookingComplete={handleBookingComplete} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default EventDetails; 