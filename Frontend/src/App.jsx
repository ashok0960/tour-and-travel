import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import VendorRoute from './components/VendorRoute';
import Layout from './components/Layout';

import Home from './pages/Home';
import TourList from './pages/TourList';
import TourDetail from './pages/TourDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MyBookings from './pages/MyBookings';
import AdminTours from './pages/AdminTours';
import AdminBookings from './pages/AdminBookings';
import AdminUsers from './pages/AdminUsers';
import AddEditTour from './pages/AddEditTour';
import AdminDashboard from './pages/AdminDashboard';
import VendorDashboard from './pages/VendorDashboard';
import AdminSupport from './pages/AdminSupport';
import VendorSupport from './pages/VendorSupport';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancel from './pages/PaymentCancel';
import PaymentsMethod from './pages/PaymentsMethod';
import KhaltiVerify from './pages/KhaltiVerify';
import Profile from './pages/Profile';

import { authAPI } from './services/api';
import PrivacyPolicy from './Terms/PrivacyPolicy';
import TermsUse from './Terms/TermsUse';
import ContactUs from './Terms/ContactUs';
import FAQ from './Terms/FAQ';
import CookiePolicy from './Terms/CookiePolicy';
import SupportModal from './components/SupportModal';
import Support from './pages/Support';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Scroll to top on route change
  const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);

    return null;
  };

  const checkAuth = async () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const response = await authAPI.getProfile();
        setUser(response.data);
      } catch {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    checkAuth();
    // Refresh profile when user returns to tab (catches role changes while logged in)
    const handleFocus = () => {
      if (localStorage.getItem('access_token')) checkAuth();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
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
      <ScrollToTop />
      <Layout user={user} setUser={setUser}>
        <Toaster position="top-right" />
        <Routes>
          {/* Public */}
          <Route path="/" element={user ? <Navigate to={user.role === 'admin' ? '/admin/dashboard' : user.role === 'vendor' ? '/vendor/dashboard' : '/tours'} replace /> : <Home user={user} />} />
          <Route path="/tours" element={<TourList />} />
          <Route path="/tours/:id" element={<TourDetail user={user} />} />
          <Route path="/login" element={user ? <Navigate to={user.role === 'admin' ? '/admin/dashboard' : user.role === 'vendor' ? '/vendor/dashboard' : '/tours'} replace /> : <Login setUser={setUser} />} />
          <Route path="/register" element={user ? <Navigate to="/tours" replace /> : <Register />} />

          {/* User - redirect superusers to their dashboards */}
          <Route path="/dashboard" element={
            <PrivateRoute user={user}>
              {user?.role === 'admin'
                ? <Navigate to="/admin/dashboard" replace />
                : user?.role === 'vendor'
                ? <Navigate to="/vendor/dashboard" replace />
                : <Dashboard user={user} />}
            </PrivateRoute>
          } />
          <Route path="/my-bookings" element={
            <PrivateRoute user={user}>
              {['admin', 'vendor'].includes(user?.role)
                ? <Navigate to={user?.role === 'admin' ? '/admin/dashboard' : '/vendor/dashboard'} replace />
                : <MyBookings />}
            </PrivateRoute>
          } />

          {/* Vendor - only for vendor role, NOT admin */}
          <Route path="/vendor/dashboard" element={<VendorRoute user={user}><VendorDashboard user={user} /></VendorRoute>} />
          <Route path="/vendor/tours/add" element={<VendorRoute user={user}><AddEditTour /></VendorRoute>} />
          <Route path="/vendor/tours/edit/:id" element={<VendorRoute user={user}><AddEditTour /></VendorRoute>} />

          {/* Admin */}
          <Route path="/admin/dashboard" element={<AdminRoute user={user}><AdminDashboard user={user} /></AdminRoute>} />
          <Route path="/admin/tours" element={<AdminRoute user={user}><AdminTours user={user} /></AdminRoute>} />
          <Route path="/admin/tours/add" element={<AdminRoute user={user}><AddEditTour /></AdminRoute>} />
          <Route path="/admin/tours/edit/:id" element={<AdminRoute user={user}><AddEditTour /></AdminRoute>} />
          <Route path="/admin/bookings" element={<AdminRoute user={user}><AdminBookings /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute user={user}><AdminUsers currentUser={user} /></AdminRoute>} />
          <Route path="/admin/support" element={<AdminRoute user={user}><AdminSupport /></AdminRoute>} />
          <Route path="/vendor/support" element={<VendorRoute user={user}><VendorSupport /></VendorRoute>} />

          <Route path="/profile" element={<PrivateRoute user={user}><Profile user={user} setUser={setUser} /></PrivateRoute>} />

          {/* Payment */}
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/cancel" element={<PaymentCancel />} />
          <Route path="/payment/khalti/verify" element={<KhaltiVerify />} />
          <Route path="/paymentmethod" element={<PaymentsMethod />} />
          <Route path="/privacy" element={<PrivacyPolicy/>}/>
          <Route path="/terms" element={<TermsUse/>}/>
          <Route path="/contact" element={<ContactUs/>}/>
          <Route path="/faq" element={<FAQ/>}/>
          <Route path="/cookie-policy" element={<CookiePolicy/>}/>
          <Route path='/support' element={<Support/>}/>
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;