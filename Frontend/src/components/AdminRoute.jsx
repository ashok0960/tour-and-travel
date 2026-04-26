import React from 'react';
import { Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminRoute = ({ children, user }) => {
  const token = localStorage.getItem('access_token');

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!['admin', 'vendor'].includes(user.role)) {
    toast.error('Superuser access required');
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AdminRoute;