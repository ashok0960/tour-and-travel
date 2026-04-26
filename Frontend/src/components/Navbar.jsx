import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setShowLogoutModal(false);
    navigate('/login');
    setTimeout(() => setUser(null), 50);
  };

  const isStaff = user?.role === 'admin' || user?.role === 'vendor';
  const dashboardLink = user?.role === 'admin' ? '/admin/dashboard' : '/vendor/dashboard';

  const NavLinks = ({ mobile = false }) => {
    const cls = mobile ? 'block py-2 hover:text-blue-200' : 'hover:text-blue-200 transition';
    const close = mobile ? () => setMenuOpen(false) : undefined;

    return (
      <>
        {!user && <Link to="/" className={cls} onClick={close}>Home</Link>}
        {!isStaff && <Link to="/tours" className={cls} onClick={close}>Tours</Link>}

        {user ? (
          <>
            {isStaff ? (
              <>
                <Link to={dashboardLink} className={cls} onClick={close}>Dashboard</Link>
                <Link to="/admin/tours" className={cls} onClick={close}>Manage Tours</Link>
                <Link to="/admin/bookings" className={cls} onClick={close}>Bookings</Link>
                {user?.role === 'admin' && <Link to="/admin/support" className={cls} onClick={close}>Support</Link>}
                {user?.role === 'vendor' && <Link to="/vendor/support" className={cls} onClick={close}>Support</Link>}
                <Link to="/profile" className={cls} onClick={close}>Profile</Link>
              </>
            ) : (
              <>
                <Link to="/dashboard" className={cls} onClick={close}>Dashboard</Link>
                <Link to="/my-bookings" className={cls} onClick={close}>My Bookings</Link>
                <Link to="/profile" className={cls} onClick={close}>Profile</Link>
              </>
            )}
            <button
              onClick={() => { close?.(); setShowLogoutModal(true); }}
              className={cls}
            >
              Logout
            </button>
            {!mobile && (
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                user.role === 'admin' ? 'bg-red-700' :
                user.role === 'vendor' ? 'bg-purple-700' : 'bg-blue-700'
              }`}>{user.username}</span>
            )}
          </>
        ) : (
          <>
            <Link to="/login" className={cls} onClick={close}>Login</Link>
            <Link to="/register" className={mobile ? cls : 'bg-white text-blue-600 px-4 py-1 rounded-lg hover:bg-gray-100 transition font-medium'} onClick={close}>Register</Link>
          </>
        )}
      </>
    );
  };

  return (
    <>
      <nav className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">

            {/* Logo */}
            <div className="flex items-center gap-3">
              <img src={logo} className="h-10 w-10 rounded-full" alt="logo" />
              <Link to="/" className="text-2xl font-bold">
                <span className="text-white">Mystic </span>
                <span className="text-yellow-300">Path </span>
                <span className="text-blue-200">Travel </span>
                <span className="text-green-300">Co.</span>
              </Link>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-5">
              <NavLinks />
            </div>

            {/* Mobile Toggle */}
            <button className="md:hidden focus:outline-none" onClick={() => setMenuOpen(!menuOpen)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {menuOpen && (
            <div className="md:hidden pb-4 space-y-1">
              <NavLinks mobile />
            </div>
          )}
        </div>
      </nav>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🚪</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Logout?</h3>
            <p className="text-gray-500 text-sm mb-6">Are you sure you want to log out of your account?</p>
            <div className="flex gap-3">
              <button onClick={() => setShowLogoutModal(false)} className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition">
                Stay
              </button>
              <button onClick={handleLogout} className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition">
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
