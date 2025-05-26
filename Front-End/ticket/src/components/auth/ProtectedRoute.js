import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { ROUTES } from '../../constants/routes';
import Loader from '../shared/Loader';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isLoading } = useUser();
  const location = useLocation();

  console.log('ProtectedRoute: User state:', user);
  console.log('ProtectedRoute: Is Loading:', isLoading);
  console.log('ProtectedRoute: Allowed Roles:', allowedRoles);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!user) {
    // Redirect to login if not authenticated
    console.log('ProtectedRoute: User not authenticated. Redirecting to login.');
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect to unauthorized if role doesn't match
    console.log('ProtectedRoute: User role (', user.role, ') not in allowed roles (', allowedRoles, '). Redirecting to unauthorized.');
    return <Navigate to={ROUTES.UNAUTHORIZED} state={{ from: location }} replace />;
  }

  console.log('ProtectedRoute: User authenticated and authorized.');
  return children;
};

export default ProtectedRoute; 