import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import ForgetPasswordForm from './components/auth/ForgetPasswordForm';
import ProfilePage from './components/profile/ProfilePage';
import Navbar from './components/navigation/Navbar';
import Footer from './components/shared/Footer';
import Toast from './components/shared/Toast';
import Loader from './components/shared/Loader';
import AdminUsersPage from './components/AdminUsersPage';
import MyEventsPage from './components/events/MyEventsPage';
import EventForm from './components/events/EventForm';
import EventAnalytics from './components/events/EventAnalytics';

// Placeholder components for different user roles
const AdminDashboard = () => (
  <Routes>
    <Route path="dashboard" element={<div>Admin Dashboard</div>} />
    <Route path="users" element={<AdminUsersPage />} />
    <Route path="*" element={<Navigate to="dashboard" replace />} />
  </Routes>
);
const OrganizerDashboard = () => (
  <Routes>
    <Route path="events" element={<MyEventsPage />} />
    <Route path="events/new" element={<EventForm />} />
    <Route path="events/edit/:id" element={<EventForm />} />
    <Route path="events/analytics/:id" element={<EventAnalytics />} />
    <Route path="dashboard" element={<MyEventsPage />} />
    <Route path="*" element={<Navigate to="events" replace />} />
  </Routes>
);
const UserDashboard = () => <div>User Dashboard</div>;

function App() {
  return (
    <UserProvider>
      <Router>
        <div style={{ 
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Navbar />
          <main style={{ flex: 1, padding: '20px 0' }}>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
              <Route path="/forget-password" element={<ForgetPasswordForm />} />

              {/* Protected routes */}
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } 
              />

              {/* Role-specific routes */}
              <Route 
                path="/admin/*" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/organizer/*" 
                element={
                  <ProtectedRoute allowedRoles={['organizer']}>
                    <OrganizerDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/user/*" 
                element={
                  <ProtectedRoute allowedRoles={['user']}>
                    <UserDashboard />
                  </ProtectedRoute>
                } 
              />

              {/* Default route - redirect based on role */}
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    {({ user }) => {
                      switch (user?.role) {
                        case 'admin':
                          return <Navigate to="/admin/dashboard" replace />;
                        case 'organizer':
                          return <Navigate to="/organizer/dashboard" replace />;
                        case 'user':
                          return <Navigate to="/user/dashboard" replace />;
                        default:
                          return <Navigate to="/login" replace />;
                      }
                    }}
                  </ProtectedRoute>
                } 
              />

              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </main>
          <Footer />
          <Toast />
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
