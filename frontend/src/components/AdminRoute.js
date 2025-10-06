import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  // Debug logging
  console.log('AdminRoute Debug:', {
    isAuthenticated,
    loading,
    user,
    userRole: user?.role
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('AdminRoute: User not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user?.role !== 'admin') {
    console.log('AdminRoute: User is not admin, redirecting to home');
    return <Navigate to="/" replace />;
  }

  console.log('AdminRoute: Admin access granted');
  return children;
};

export default AdminRoute; 