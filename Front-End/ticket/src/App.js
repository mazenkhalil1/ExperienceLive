import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import ForgetPasswordForm from './components/auth/ForgetPasswordForm';
import ProfilePage from './components/profile/ProfilePage';
import EventDetails from './components/events/EventDetails';
import EventList from './components/events/EventList';
import Navbar from './components/navigation/Navbar';
import Footer from './components/shared/Footer';
import AdminUsersPage from './components/AdminUsersPage';
import MyEventsPage from './components/events/MyEventsPage';
import EventForm from './components/events/EventForm';
import EventAnalytics from './components/events/EventAnalytics';
import AdminEventsPage from './components/events/AdminEventsPage';
import UserBookingsPage from './components/bookings/UserBookingsPage';
import BookingDetails from './components/bookings/BookingDetails';
import axiosInstance from './services/axiosConfig';

import { AnimatePresence, motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { SearchFilterProvider } from './context/SearchFilterContext';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <UserProvider>
          <SearchFilterProvider>
            <ThemedApp />
          </SearchFilterProvider>
        </UserProvider>
      </ThemeProvider>
    </Router>
  );
}

function ThemedApp() {
  const { isDarkMode } = useTheme();
  const location = useLocation();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalModalOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchEventsData = async () => {
      try {
        const response = await axiosInstance.get('/events');
        if (!response.data) {
          throw new Error('No data received from server');
        }
        const fetchedEvents = response.data.data || [];
        setEvents(fetchedEvents);
        
        const uniqueLocations = [...new Set(fetchedEvents.map(event => event.location).filter(loc => loc != null && loc !== ''))];
        setLocations(uniqueLocations);

        const uniqueCategories = [...new Set(fetchedEvents.map(event => event.category).filter(cat => cat != null && cat !== ''))];
        setCategories(uniqueCategories);

      } catch (err) {
        console.error('Error fetching events for filters:', err);
      }
    };

    fetchEventsData();
  }, []);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);
  const openRegisterModal = () => setIsRegisterModalModalOpen(true);
  const closeRegisterModal = () => setIsRegisterModalModalOpen(false);

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-gray-950 to-black' : 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-50 via-white to-white'} transition-colors duration-200`}>
      <Navbar openLoginModal={openLoginModal} openRegisterModal={openRegisterModal} locations={locations} categories={categories} />
      <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8 mt-16">
        <AnimatePresence mode='wait' initial={false}>
          <Routes location={location} key={location.pathname}>
            {/* Public routes */}
            <Route path="/" element={<EventList events={events} />} />
            <Route path="/forget-password" element={<ForgetPasswordForm />} />
            <Route path="/events/:id" element={<EventDetails />} />

            {/* Protected profile route - accessible by all authenticated users */}
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute allowedRoles={['admin', 'organizer', 'user']}>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />

            {/* Admin routes */}
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Routes>
                    <Route path="dashboard" element={<AdminUsersPage />} />
                    <Route path="users" element={<AdminUsersPage />} />
                    <Route path="events" element={<AdminEventsPage />} />
                    <Route path="*" element={<Navigate to="dashboard" replace />} />
                  </Routes>
                </ProtectedRoute>
              } 
            />
            
            {/* Organizer routes */}
            <Route 
              path="/organizer/*" 
              element={
                <ProtectedRoute allowedRoles={['organizer']}>
                  <Routes>
                    <Route path="events" element={<MyEventsPage />} />
                    <Route path="events/new" element={<EventForm />} />
                    <Route path="events/edit/:id" element={<EventForm />} />
                    <Route path="analytics" element={<EventAnalytics />} />
                    <Route path="*" element={<Navigate to="events" replace />} />
                  </Routes>
                </ProtectedRoute>
              } 
            />

            {/* Protected User routes */}
            <Route 
              path="/my-events" 
              element={
                <ProtectedRoute allowedRoles={['user', 'organizer']}>
                  <EventList userOnly={true} />
                </ProtectedRoute>
              } 
            />

            {/* Booking routes */}
            <Route 
              path="/bookings" 
              element={
                <ProtectedRoute allowedRoles={['user', 'admin']}>
                  <UserBookingsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/bookings/:id" 
              element={
                <ProtectedRoute allowedRoles={['user', 'admin']}>
                  <BookingDetails />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      {/* Login Modal */}
      <AnimatePresence>
        {isLoginModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={closeLoginModal}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full relative"
              onClick={(e) => e.stopPropagation()}
            >
              <LoginForm closeModal={closeLoginModal} openRegisterModal={openRegisterModal} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Register Modal */}
      <AnimatePresence>
        {isRegisterModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={closeRegisterModal}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full relative"
              onClick={(e) => e.stopPropagation()}
            >
              <RegisterForm closeModal={closeRegisterModal} openLoginModal={openLoginModal} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
