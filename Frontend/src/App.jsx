import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Components
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import Layout from './components/Layout';

// Pages
import Home from './pages/Home';
import TourList from './pages/TourList';
import TourDetail from './pages/TourDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MyBookings from './pages/MyBookings';
import AdminTours from './pages/AdminTours';
import AdminBookings from './pages/AdminBookings';
import AddEditTour from './pages/AddEditTour';

// API
import { authAPI } from './services/api';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const response = await authAPI.getProfile();
        setUser(response.data);
      } catch {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    const init = async () => {
      await checkAuth();
    };
    init();
  }, []);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">✈️</div>
          <div className="text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Layout user={user} setUser={setUser}>
        <Toaster position="top-right" />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/tours" element={<TourList />} />
          <Route path="/tours/:id" element={<TourDetail user={user} />} />
          <Route path="/login" element={
            user ? <Navigate to="/dashboard" /> : <Login setUser={setUser} />
          } />
          <Route path="/register" element={
            user ? <Navigate to="/dashboard" /> : <Register />
          } />

          {/* User Routes */}
          <Route path="/dashboard" element={
            <PrivateRoute user={user}>
              <Dashboard user={user} />
            </PrivateRoute>
          } />
          <Route path="/my-bookings" element={
            <PrivateRoute user={user}>
              <MyBookings />
            </PrivateRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin/tours" element={
            <AdminRoute user={user}>
              <AdminTours />
            </AdminRoute>
          } />
          <Route path="/admin/tours/add" element={
            <AdminRoute user={user}>
              <AddEditTour />
            </AdminRoute>
          } />
          <Route path="/admin/tours/edit/:id" element={
            <AdminRoute user={user}>
              <AddEditTour />
            </AdminRoute>
          } />
          <Route path="/admin/bookings" element={
            <AdminRoute user={user}>
              <AdminBookings />
            </AdminRoute>
          } />
        </Routes>
      </Layout>
    </Router>
  );
}


export default App;