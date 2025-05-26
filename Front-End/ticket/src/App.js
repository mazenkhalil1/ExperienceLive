import './App.css';
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { SearchFilterProvider } from './context/SearchFilterContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ROUTES } from './constants/routes';

// Layout Components
import Navbar from './components/navigation/Navbar';
import Footer from './components/shared/Footer';
import Loader from './components/shared/Loader';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Lazy-loaded components
const LoginForm = lazy(() => import('./components/auth/LoginForm'));
const RegisterForm = lazy(() => import('./components/auth/RegisterForm'));
const ForgetPasswordForm = lazy(() => import('./components/auth/ForgetPasswordForm'));
const ProfilePage = lazy(() => import('./components/profile/ProfilePage'));
const EventDetails = lazy(() => import('./components/events/EventDetails'));
const EventList = lazy(() => import('./components/events/EventList'));
const AdminUsersPage = lazy(() => import('./components/AdminUsersPage'));
const MyEventsPage = lazy(() => import('./components/events/MyEventsPage'));
const EventForm = lazy(() => import('./components/events/EventForm'));
const EventAnalytics = lazy(() => import('./components/events/EventAnalytics'));
const AdminEventsPage = lazy(() => import('./components/events/AdminEventsPage'));
const UserBookingsPage = lazy(() => import('./components/bookings/UserBookingsPage'));
const BookingDetails = lazy(() => import('./components/bookings/BookingDetails'));
const UnauthorizedPage = lazy(() => import('./components/shared/UnauthorizedPage'));
const NotFoundPage = lazy(() => import('./components/shared/NotFoundPage'));

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

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-gray-950 to-black' : 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-50 via-white to-white'} transition-colors duration-200`}>
      <Navbar />
      <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8 mt-16">
        <Suspense fallback={<Loader size="lg" />}>
          <Routes>
            {/* Public routes */}
            <Route path={ROUTES.HOME} element={<EventList />} />
            <Route path={ROUTES.LOGIN} element={<LoginForm />} />
            <Route path={ROUTES.REGISTER} element={<RegisterForm />} />
            <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgetPasswordForm />} />
            <Route path={ROUTES.EVENT_DETAILS} element={<EventDetails />} />
            <Route path={ROUTES.UNAUTHORIZED} element={<UnauthorizedPage />} />

            {/* Protected profile route */}
            <Route 
              path={ROUTES.PROFILE} 
              element={
                <ProtectedRoute allowedRoles={['admin', 'organizer', 'user']}>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />

            {/* Admin routes */}
            <Route 
              path={ROUTES.ADMIN.ROOT} 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Routes>
                    <Route path="dashboard" element={<AdminUsersPage />} />
                    <Route path="users" element={<AdminUsersPage />} />
                    <Route path="events" element={<AdminEventsPage />} />
                    <Route path="*" element={<Navigate to={ROUTES.ADMIN.DASHBOARD} replace />} />
                  </Routes>
                </ProtectedRoute>
              } 
            />
            
            {/* Organizer routes */}
            <Route 
              path={`${ROUTES.ORGANIZER.ROOT}/*`}
              element={
                <ProtectedRoute allowedRoles={['organizer']}>
                  <Routes>
                    <Route path="events" element={<MyEventsPage />} />
                    <Route path="events/new" element={<EventForm />} />
                    <Route path="events/edit/:id" element={<EventForm />} />
                    <Route path="analytics" element={<EventAnalytics />} />
                    <Route path="*" element={<Navigate to={ROUTES.ORGANIZER.EVENTS} replace />} />
                  </Routes>
                </ProtectedRoute>
              } 
            />

            {/* Protected User routes */}
            <Route 
              path={ROUTES.MY_EVENTS} 
              element={
                <ProtectedRoute allowedRoles={['user', 'organizer']}>
                  <EventList userOnly={true} />
                </ProtectedRoute>
              } 
            />

            {/* Booking routes */}
            <Route 
              path={ROUTES.BOOKINGS} 
              element={
                <ProtectedRoute allowedRoles={['user', 'admin']}>
                  <UserBookingsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path={ROUTES.BOOKING_DETAILS} 
              element={
                <ProtectedRoute allowedRoles={['user', 'admin']}>
                  <BookingDetails />
                </ProtectedRoute>
              } 
            />

            {/* Catch-all route for 404 */}
            <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
          </Routes>
        </Suspense>
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
    </div>
  );
}

export default App;
