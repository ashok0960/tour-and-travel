import React from 'react';
import { Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Allows both admin (superuser) and vendor (staff)
const ManagementRoute = ({ children, user }) => {
  const token = localStorage.getItem('access_token');

  if (!token || !user) {
    toast.error('Please login first');
    return <Navigate to="/login" replace />;
  }

  if (!['admin', 'vendor'].includes(user.role)) {
    toast.error('Access restricted to staff and superusers');
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ManagementRoute;
