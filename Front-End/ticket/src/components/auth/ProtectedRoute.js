import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import Loader from '../shared/Loader';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated, isLoading, userRole } = useUser();
  const location = useLocation();

  // Show loader while checking authentication
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  // Not authenticated - redirect to login with return path
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Check role-based access if roles are specified
  if (allowedRoles.length > 0) {
    const currentRole = userRole || user.role;
    
    if (!currentRole || !allowedRoles.includes(currentRole)) {
      // Redirect to appropriate dashboard based on user's role
      const roleBasedPath = getRoleBasedPath(currentRole);
      console.log(`Unauthorized access. Required roles: ${allowedRoles.join(', ')}, Current role: ${currentRole}`);
      return <Navigate to={roleBasedPath} replace />;
    }
  }

  // Render children if all checks pass
  return children;
};

// Helper function to determine default path based on user role
const getRoleBasedPath = (role) => {
  switch (role) {
    case 'admin':
      return '/admin/dashboard';
    case 'organizer':
      return '/organizer/events';
    case 'user':
      return '/events';
    default:
      return '/login';
  }
};

export default ProtectedRoute; 