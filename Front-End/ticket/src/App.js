import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Navbar from './components/navigation/Navbar';
import Footer from './components/shared/Footer';

// Auth Components
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import ForgotPassword from './components/auth/ForgotPassword';

// Profile Components
import ProfilePage from './components/profile/ProfilePage';

// Event Components
import EventList from './components/events/EventList';
import EventDetails from './components/events/EventDetails';

// Booking Components
import BookingList from './components/bookings/BookingList';
import BookingDetails from './components/bookings/BookingDetails';

// Organizer Components
import MyEvents from './components/organizer/MyEvents';
import CreateEvent from './components/organizer/CreateEvent';
import EditEvent from './components/organizer/EditEvent';
import EventAnalytics from './components/organizer/EventAnalytics';

// Admin Components
import AdminEvents from './components/admin/AdminEvents';
import AdminUsers from './components/admin/AdminUsers';

// Error Pages
import Unauthorized from './components/errors/Unauthorized';
import NotFound from './components/errors/NotFound';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<EventList />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/events/:id" element={<EventDetails />} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* Protected Routes - All Authenticated Users */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* Protected Routes - Standard Users */}
              <Route
                path="/bookings"
                element={
                  <ProtectedRoute allowedRoles={['user']}>
                    <BookingList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/bookings/:id"
                element={
                  <ProtectedRoute allowedRoles={['user']}>
                    <BookingDetails />
                  </ProtectedRoute>
                }
              />

              {/* Protected Routes - Organizers */}
              <Route
                path="/my-events"
                element={
                  <ProtectedRoute allowedRoles={['organizer']}>
                    <MyEvents />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-events/new"
                element={
                  <ProtectedRoute allowedRoles={['organizer']}>
                    <CreateEvent />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-events/:id/edit"
                element={
                  <ProtectedRoute allowedRoles={['organizer']}>
                    <EditEvent />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-events/:id/analytics"
                element={
                  <ProtectedRoute allowedRoles={['organizer']}>
                    <EventAnalytics />
                  </ProtectedRoute>
                }
              />

              {/* Protected Routes - Admin */}
              <Route
                path="/admin/events"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminEvents />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminUsers />
                  </ProtectedRoute>
                }
              />

              {/* Catch all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <ToastContainer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
