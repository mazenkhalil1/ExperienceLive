import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import ForgetPasswordForm from './components/auth/ForgetPasswordForm';
import ProfilePage from './components/profile/ProfilePage';
import EventDetails from './components/events/EventDetails';
import EventList from './components/events/EventList';
import Navbar from './components/navigation/Navbar';
import Footer from './components/shared/Footer';
import Toast from './components/shared/Toast';
import Loader from './components/shared/Loader';
import AdminUsersPage from './components/AdminUsersPage';
import MyEventsPage from './components/events/MyEventsPage';
import EventForm from './components/events/EventForm';
import EventAnalytics from './components/events/EventAnalytics';
import AdminEventsPage from './components/events/AdminEventsPage';

function App() {
  return (
    <Router>
      <UserProvider>
        <div style={{ 
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Navbar />
          <main style={{ flex: 1, padding: '20px 0' }}>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<EventList />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
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
            </Routes>
          </main>
          <Footer />
          <Toast />
        </div>
      </UserProvider>
    </Router>
  );
}

export default App;
