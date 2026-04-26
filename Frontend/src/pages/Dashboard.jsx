import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingAPI, supportAPI } from '../services/api';
import toast from 'react-hot-toast';
import SupportModal from '../components/SupportModal';

const STATUS_STYLES = {
  confirmed: 'bg-green-100 text-green-700 border border-green-200',
  pending: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
  cancelled: 'bg-red-100 text-red-700 border border-red-200',
};

const Dashboard = ({ user }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSupport, setShowSupport] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const checkUnreadResponses = async () => {
    try {
      const res = await supportAPI.getMyTickets();
      const unread = res.data.filter(t => t.response && t.status !== 'resolved').length;
      const prev = parseInt(localStorage.getItem('support_read_count') || '0');
      if (unread > prev) {
        toast('📩 You have a new response on your problem!', { icon: '🔔', duration: 5000 });
        localStorage.setItem('support_read_count', unread);
      }
      setUnreadCount(unread);
    } catch {}
  };

  useEffect(() => {
    bookingAPI.getMyBookings()
      .then(r => setBookings(r.data))
      .catch(() => toast.error('Failed to load dashboard data'))
      .finally(() => setLoading(false));
    checkUnreadResponses();
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const stats = {
    total: bookings.length,
    totalSpent: bookings.reduce((s, b) => s + parseFloat(b.total_price), 0),
    upcoming: bookings.filter(b => b.status === 'confirmed' && new Date(b.travel_date) >= today).length,
    pending: bookings.filter(b => b.status === 'pending').length,
  };

return (
    <>
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">

        {/* Welcome Banner */}
        <div className="relative bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl text-white p-8 mb-8 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full" />
          <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-white/5 rounded-full" />
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-extrabold mb-1">
                Welcome back, {user?.username}! 
              </h1>
              <p className="text-blue-100">
                {stats.upcoming > 0
                  ? `You have ${stats.upcoming} upcoming trip${stats.upcoming > 1 ? 's' : ''}. Have a great journey!`
                  : 'Ready for your next adventure? Browse our tours!'}
              </p>
              {user?.role === 'vendor' && (
                <p className="text-yellow-300 text-sm mt-1 font-medium">
                  🏪 You are also a Vendor —{' '}
                  <Link to="/vendor/dashboard" className="underline hover:text-white">Go to Vendor Panel</Link>
                </p>
              )}
            </div>
            <Link
              to="/tours"
              className="bg-white text-blue-700 px-6 py-2.5 rounded-xl font-bold hover:bg-yellow-300 hover:text-blue-800 transition shadow-md whitespace-nowrap"
            >
              Browse Tours
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Bookings', value: stats.total, icon: '📅', color: 'blue' },
            { label: 'Total Spent', value: `Rs${stats.totalSpent.toFixed(0)}`, icon: '💰', color: 'purple' },
            { label: 'Upcoming Trips', value: stats.upcoming, icon: '✈️', color: 'green' },
            { label: 'Pending Payment', value: stats.pending, icon: '⏳', color: 'yellow' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl shadow-md p-5 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-${s.color}-50`}>
                {s.icon}
              </div>
              <div>
                <p className="text-2xl font-extrabold text-gray-800">{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Browse Tours', icon: '🏝️', to: '/tours', color: 'from-blue-500 to-blue-600' },
            { label: 'My Bookings', icon: '📋', to: '/my-bookings', color: 'from-purple-500 to-purple-600' },
            ...(user?.role === 'vendor' ? [{ label: 'Vendor Panel', icon: '🏪', to: '/vendor/dashboard', color: 'from-green-500 to-green-600' }] : []),
          ].map(a => (
            <Link
              key={a.label}
              to={a.to}
              className={`bg-gradient-to-r ${a.color} text-white rounded-2xl p-5 text-center hover:opacity-90 transition shadow-md`}
            >
              <div className="text-3xl mb-2">{a.icon}</div>
              <p className="font-semibold text-sm">{a.label}</p>
            </Link>
          ))}
          <button
            onClick={() => { setShowSupport(true); setUnreadCount(0); localStorage.setItem('support_read_count', '0'); }}
            className="relative bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl p-5 text-center hover:opacity-90 transition shadow-md"
          >
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-yellow-400 text-gray-900 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
            <div className="text-3xl mb-2">🎧</div>
            <p className="font-semibold text-sm">Support</p>
          </button>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Recent Bookings</h2>
            <Link to="/my-bookings" className="text-blue-600 text-sm font-medium hover:underline">
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1,2,3].map(i => (
                <div key={i} className="animate-pulse flex gap-4 p-4 border border-gray-100 rounded-xl">
                  <div className="w-16 h-16 bg-gray-200 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🗺️</div>
              <p className="text-gray-500 mb-4">No bookings yet. Start exploring!</p>
              <Link to="/tours" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition">
                Browse Tours
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.slice(0, 5).map(b => (
                <div key={b.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                      {b.tour_title?.[0] || '?'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{b.tour_title}</p>
                      <p className="text-sm text-gray-500">
                        📍 {b.tour_location} · 📅 {new Date(b.travel_date).toLocaleDateString()} · 👥 {b.number_of_people}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                    <p className="font-bold text-blue-600">Rs{b.total_price}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[b.status] || 'bg-gray-100 text-gray-600'}`}>
                      {b.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
      {showSupport && <SupportModal onClose={() => setShowSupport(false)} role="user" />}
    </>
  );
};

export default Dashboard;
