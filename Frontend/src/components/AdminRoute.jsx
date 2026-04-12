import React from 'react';
import { Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminRoute = ({ children, user }) => {
  const token = localStorage.getItem('access_token');
  
  if (!token || !user) {
    toast.error('Please login first');
    return <Navigate to="/login" replace />;
  }
  
  if (user.role !== 'admin') {
    toast.error('Admin access required');
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

export default AdminRoute;