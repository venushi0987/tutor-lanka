import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, role }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role && user?.role !== role && user?.role !== 'admin') {
    return <Navigate to={`/dashboard/${user?.role}`} replace />;
  }
  return children;
};

export default ProtectedRoute;
