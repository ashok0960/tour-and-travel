import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold">🌍 TravelHub</Link>
          
          <div className="flex space-x-6">
            <Link to="/" className="hover:text-blue-200">Home</Link>
            <Link to="/tours" className="hover:text-blue-200">Tours</Link>
            
            {user ? (
              <>
                <Link to="/dashboard" className="hover:text-blue-200">Dashboard</Link>
                {user.role === 'admin' && (
                  <>
                    <Link to="/admin/tours" className="hover:text-blue-200">Manage Tours</Link>
                    <Link to="/admin/bookings" className="hover:text-blue-200">All Bookings</Link>
                  </>
                )}
                <button onClick={handleLogout} className="hover:text-blue-200">Logout</button>
                <span className="ml-4">👋 {user.username}</span>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-200">Login</Link>
                <Link to="/register" className="hover:text-blue-200">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;