import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingAPI, accountsAPI, tours as toursAPI, supportAPI } from '../services/api';
import toast from 'react-hot-toast';

const AdminDashboard = ({ user }) => {
  const [stats, setStats] = useState({ users: 0, vendors: 0, tours: 0, bookings: 0, revenue: 0, pending: 0 });
  const [recentBookings, setRecentBookings] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadTickets, setUnreadTickets] = useState(0);

  const checkUnreadTickets = async () => {
    try {
      const res = await supportAPI.getAllTickets('');
      const unread = res.data.filter(t => !t.response).length;
      const prev = parseInt(localStorage.getItem('admin_support_read') || '0');
      if (unread > prev) {
        toast('📩 Problem received from vendor!', { icon: '🔔', duration: 5000 });
        localStorage.setItem('admin_support_read', unread);
      }
      setUnreadTickets(unread);
    } catch {}
  };

  useEffect(() => {
    const load = async () => {
      try {
        const [bookingsRes, usersRes, toursRes] = await Promise.all([
          bookingAPI.getAllBookings(),
          accountsAPI.getAllUsers(),
          toursAPI.getAll(),
        ]);
        const bookings = bookingsRes.data;
        const users = usersRes.data;

        setStats({
          users: users.filter(u => u.role === 'user').length,
          vendors: users.filter(u => u.role === 'vendor').length,
          tours: toursRes.data.length,
          bookings: bookings.length,
          revenue: bookings.filter(b => b.payment_status === 'paid').reduce((s, b) => s + parseFloat(b.total_price), 0),
          pending: bookings.filter(b => b.status === 'pending').length,
        });
        setRecentBookings(bookings.slice(0, 6));
        setRecentUsers(users.slice(-5).reverse());
      } catch {
        toast.error('Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };
    load();
    checkUnreadTickets();
  }, []);

  const STATUS_COLOR = {
    confirmed: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  const ROLE_COLOR = {
    admin: 'bg-red-100 text-red-700',
    vendor: 'bg-purple-100 text-purple-700',
    user: 'bg-blue-100 text-blue-700',
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-500 font-medium">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">

        {/* Header Banner */}
        <div className="relative bg-gradient-to-r from-gray-900 via-red-900 to-gray-900 rounded-2xl text-white p-8 mb-8 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-56 h-56 bg-red-500/10 rounded-full" />
          <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-white/5 rounded-full" />
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  Admin
                </span>
              </div>
              <h1 className="text-3xl font-extrabold mb-1">Admin Control Panel</h1>
              <p className="text-gray-300">Welcome back, {user?.username}. Here's your platform overview.</p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <Link to="/admin/users" className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2 rounded-xl text-sm font-semibold transition backdrop-blur-sm">
                👥 Manage Users
              </Link>
              <Link to="/admin/bookings" className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition shadow-md">
                📋 All Bookings
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {[
            { label: 'Total Users', value: stats.users, icon: '👤', bg: 'bg-blue-50', text: 'text-blue-600' },
            { label: 'Vendors', value: stats.vendors, icon: '🏪', bg: 'bg-purple-50', text: 'text-purple-600' },
            { label: 'Tours', value: stats.tours, icon: '🏝️', bg: 'bg-cyan-50', text: 'text-cyan-600' },
            { label: 'Bookings', value: stats.bookings, icon: '📅', bg: 'bg-indigo-50', text: 'text-indigo-600' },
            { label: 'Pending', value: stats.pending, icon: '⏳', bg: 'bg-yellow-50', text: 'text-yellow-600' },
            { label: 'Revenue', value: `Rs${stats.revenue.toFixed(0)}`, icon: '💰', bg: 'bg-green-50', text: 'text-green-600' },
          ].map(s => (
            <div key={s.label} className={`${s.bg} rounded-2xl p-4 text-center shadow-sm`}>
              <div className="text-2xl mb-1">{s.icon}</div>
              <p className={`text-xl font-extrabold ${s.text}`}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Manage Users', icon: '👥', to: '/admin/users', gradient: 'from-blue-500 to-blue-700', desc: 'Promote to vendor/admin' },
            { label: 'All Bookings', icon: '📋', to: '/admin/bookings', gradient: 'from-purple-500 to-purple-700', desc: 'View & update bookings' },
            { label: 'Manage Tours', icon: '🏝️', to: '/admin/tours', gradient: 'from-cyan-500 to-cyan-700', desc: 'Add, edit, delete tours' },
            { label: 'Add New Tour', icon: '➕', to: '/admin/tours/add', gradient: 'from-green-500 to-green-700', desc: 'Create a new tour package' },
          ].map(a => (
            <Link
              key={a.label}
              to={a.to}
              className={`bg-gradient-to-br ${a.gradient} text-white rounded-2xl p-5 hover:opacity-90 transition shadow-md`}
            >
              <div className="text-3xl mb-2">{a.icon}</div>
              <p className="font-bold text-sm">{a.label}</p>
              <p className="text-white/70 text-xs mt-0.5">{a.desc}</p>
            </Link>
          ))}
          <Link
            to="/admin/support"
            onClick={() => { localStorage.setItem('admin_support_read', unreadTickets); setUnreadTickets(0); }}
            className="relative bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-2xl p-5 hover:opacity-90 transition shadow-md"
          >
            {unreadTickets > 0 && (
              <span className="absolute -top-2 -right-2 bg-yellow-400 text-gray-900 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {unreadTickets}
              </span>
            )}
            <div className="text-3xl mb-2">🎧</div>
            <p className="font-bold text-sm">Support</p>
            <p className="text-white/70 text-xs mt-0.5">View problem</p>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Recent Bookings */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold text-gray-800">Recent Bookings</h2>
              <Link to="/admin/bookings" className="text-blue-600 text-sm font-medium hover:underline">View All →</Link>
            </div>
            {recentBookings.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No bookings yet</p>
            ) : (
              <div className="space-y-3">
                {recentBookings.map(b => (
                  <div key={b.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {b.username?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800 leading-tight">{b.tour_title}</p>
                        <p className="text-xs text-gray-500">👤 {b.username} · 📅 {new Date(b.travel_date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <p className="text-sm font-bold text-blue-600">Rs{parseFloat(b.total_price).toFixed(0)}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLOR[b.status] || 'bg-gray-100 text-gray-600'}`}>
                        {b.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Users */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold text-gray-800">Recent Users</h2>
              <Link to="/admin/users" className="text-blue-600 text-sm font-medium hover:underline">Manage All →</Link>
            </div>
            {recentUsers.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No users yet</p>
            ) : (
              <div className="space-y-3">
                {recentUsers.map(u => (
                  <div key={u.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {u.username[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{u.username}</p>
                        <p className="text-xs text-gray-500">{u.email}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${ROLE_COLOR[u.role] || 'bg-gray-100 text-gray-600'}`}>
                      {u.role}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
