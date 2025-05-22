import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import Loader from '../shared/Loader';

const ProtectedRoute = ({ children, roles = [], redirectPath = '/login' }) => {
  const { user, isAuthenticated, loading } = useUser();
  const location = useLocation();

  // Show loader while checking authentication
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <Loader 
          type="spinner"
          size="large"
          text="Checking authentication..."
        />
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // Check role-based access if roles are specified
  if (roles.length > 0 && !roles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Store the last visited protected route
  localStorage.setItem('lastProtectedRoute', location.pathname);

  return children;
};

export default ProtectedRoute; 