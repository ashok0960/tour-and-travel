import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tours as toursAPI, bookingAPI, supportAPI } from '../services/api';
import toast from 'react-hot-toast';
import SupportModal from '../components/SupportModal';

const STATUS_COLOR = {
  confirmed: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  pending:   'bg-amber-100 text-amber-700 border border-amber-200',
  cancelled: 'bg-red-100 text-red-700 border border-red-200',
};

const PAYMENT_COLOR = {
  paid:    'bg-emerald-100 text-emerald-700 border border-emerald-200',
  pending: 'bg-amber-100 text-amber-700 border border-amber-200',
  failed:  'bg-red-100 text-red-700 border border-red-200',
  refunded:'bg-blue-100 text-blue-700 border border-blue-200',
};

const Badge = ({ label, colorClass }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${colorClass}`}>
    {label}
  </span>
);

const StatCard = ({ icon, label, value, bg, text }) => (
  <div className={`${bg} rounded-2xl p-5 flex items-center gap-4 shadow-sm`}>
    <div className="text-3xl">{icon}</div>
    <div>
      <p className={`text-2xl font-extrabold ${text}`}>{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  </div>
);

const VendorDashboard = ({ user }) => {
  const [myTours, setMyTours] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [bookingFilter, setBookingFilter] = useState('all');
  const [tourToDelete, setTourToDelete] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [showSupport, setShowSupport] = useState(false);
  const [unreadTickets, setUnreadTickets] = useState(0);

  const checkUnreadTickets = async () => {
    try {
      const res = await supportAPI.getVendorTickets();
      const unread = res.data.filter(t => !t.response).length;
      const prev = parseInt(localStorage.getItem('vendor_support_read') || '0');
      if (unread > prev) {
        toast('📩 New support ticket from a user!', { icon: '🔔', duration: 5000 });
        localStorage.setItem('vendor_support_read', unread);
      }
      setUnreadTickets(unread);
    } catch {}
  };

  const isAdmin = user?.role === 'admin';
  const addTourPath = isAdmin ? '/admin/tours/add' : '/vendor/tours/add';
  const editTourPath = (id) => isAdmin ? `/admin/tours/edit/${id}` : `/vendor/tours/edit/${id}`;

  useEffect(() => { loadData(); checkUnreadTickets(); }, []);

  const loadData = async () => {
    try {
      const [toursRes, bookingsRes] = await Promise.all([
        toursAPI.getVendorTours(),
        bookingAPI.getVendorBookings(),
      ]);
      setMyTours(toursRes.data);
      setBookings(bookingsRes.data);
    } catch {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTour = async () => {
    setDeletingId(tourToDelete.id);
    try {
      await toursAPI.delete(tourToDelete.id);
      toast.success(`"${tourToDelete.title}" deleted`);
      setTourToDelete(null);
      loadData();
    } catch {
      toast.error('Failed to delete tour');
    } finally {
      setDeletingId(null);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    setUpdatingId(bookingId);
    try {
      await bookingAPI.updateStatus(bookingId, { status: newStatus });
      toast.success(`Booking marked as ${newStatus}`);
      loadData();
    } catch {
      toast.error('Failed to update booking');
    } finally {
      setUpdatingId(null);
    }
  };

  const handlePaymentStatusUpdate = async (bookingId, newPaymentStatus) => {
    setUpdatingId(bookingId);
    try {
      await bookingAPI.updatePaymentStatus(bookingId, { payment_status: newPaymentStatus });
      toast.success(`Payment marked as ${newPaymentStatus}`);
      loadData();
    } catch {
      toast.error('Failed to update payment status');
    } finally {
      setUpdatingId(null);
    }
  };

  const stats = {
    totalTours: myTours.length,
    totalBookings: bookings.length,
    pendingBookings: bookings.filter(b => b.status === 'pending').length,
    confirmedBookings: bookings.filter(b => b.status === 'confirmed').length,
    totalRevenue: bookings
      .filter(b => b.payment_status === 'paid')
      .reduce((sum, b) => sum + parseFloat(b.total_price), 0),
  };

  const filteredBookings = bookingFilter === 'all'
    ? bookings
    : bookings.filter(b => b.status === bookingFilter);

  const TABS = [
    { key: 'overview', label: 'Overview', icon: '📊' },
    { key: 'my-tours', label: 'My Tours', icon: '🏝️' },
    { key: 'bookings', label: 'Bookings', icon: '📋' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block w-14 h-14 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-500 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">

        {/* ── HEADER BANNER ── */}
        <div className="relative bg-gradient-to-br from-violet-700 via-purple-700 to-indigo-700 rounded-3xl text-white p-8 mb-8 overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-white/20 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-white/30">
                  {isAdmin ? '👑 Admin' : '🏪 Vendor'} Portal
                </span>
              </div>
              <h1 className="text-4xl font-extrabold mb-2 tracking-tight">
                Welcome back, {user?.username}!
              </h1>
              <p className="text-purple-200 text-sm">
                You have <span className="text-white font-bold">{stats.pendingBookings}</span> pending bookings to review.
              </p>
            </div>
            <Link
              to={addTourPath}
              className="flex items-center gap-2 bg-white text-purple-700 px-6 py-3 rounded-2xl font-bold hover:bg-yellow-300 hover:text-purple-900 transition-all shadow-lg whitespace-nowrap text-sm"
            >
              <span className="text-lg">+</span> Add New Tour
            </Link>
            <button
              onClick={() => setShowSupport(true)}
              className="relative flex items-center gap-2 bg-white/20 border border-white/30 text-white px-5 py-3 rounded-2xl font-bold hover:bg-white/30 transition-all whitespace-nowrap text-sm"
            >
              {unreadTickets > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-gray-900 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {unreadTickets}
                </span>
              )}
              🎧 Contact Admin
            </button>
          </div>
        </div>

        {/* ── STATS ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <StatCard icon="🏝️" label="My Tours"       value={stats.totalTours}                          bg="bg-violet-50"  text="text-violet-600" />
          <StatCard icon="📅" label="Total Bookings"  value={stats.totalBookings}                       bg="bg-blue-50"    text="text-blue-600" />
          <StatCard icon="⏳" label="Pending"         value={stats.pendingBookings}                     bg="bg-amber-50"   text="text-amber-600" />
          <StatCard icon="✅" label="Confirmed"       value={stats.confirmedBookings}                   bg="bg-emerald-50" text="text-emerald-600" />
          <StatCard icon="💰" label="Revenue (Paid)"  value={`Rs${stats.totalRevenue.toLocaleString()}`} bg="bg-green-50"   text="text-green-600" />
        </div>

        {/* ── TABS ── */}
        <div className="flex gap-1 mb-6 bg-white rounded-2xl p-1.5 shadow-sm w-fit">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.key
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW TAB ── */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Recent Bookings */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-bold text-gray-800">Recent Bookings</h2>
                <button onClick={() => setActiveTab('bookings')} className="text-purple-600 text-sm font-medium hover:underline">
                  View All →
                </button>
              </div>
              {bookings.length === 0 ? (
                <div className="text-center py-10">
                  <div className="text-5xl mb-3">📭</div>
                  <p className="text-gray-400">No bookings yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {bookings.slice(0, 5).map(b => (
                    <div key={b.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-purple-50 transition">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {b.username?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800 leading-tight">{b.tour_title}</p>
                          <p className="text-xs text-gray-500">👤 {b.username} · {b.number_of_people} pax · 📅 {new Date(b.travel_date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-2">
                        <p className="text-sm font-bold text-purple-600">Rs{parseFloat(b.total_price).toLocaleString()}</p>
                        <Badge label={b.status} colorClass={STATUS_COLOR[b.status] || 'bg-gray-100 text-gray-600'} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* My Tours Quick View */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-bold text-gray-800">My Tours</h2>
                <button onClick={() => setActiveTab('my-tours')} className="text-purple-600 text-sm font-medium hover:underline">
                  Manage →
                </button>
              </div>
              {myTours.length === 0 ? (
                <div className="text-center py-10">
                  <div className="text-5xl mb-3">🏖️</div>
                  <p className="text-gray-400 mb-4">No tours yet</p>
                  <Link to={addTourPath} className="bg-purple-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-purple-700 transition">
                    Add First Tour
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {myTours.slice(0, 5).map(t => (
                    <div key={t.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-purple-50 transition">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-blue-400 to-purple-500">
                          {t.image_url
                            ? <img src={t.image_url} alt={t.title} className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center text-lg">🏖️</div>
                          }
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{t.title}</p>
                          <p className="text-xs text-gray-500">📍 {t.location} · ⏱️ {t.duration}d · 💺 {t.available_seats} seats</p>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-purple-600 flex-shrink-0 ml-2">Rs{parseFloat(t.price).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── MY TOURS TAB ── */}
        {activeTab === 'my-tours' && (
          <div>
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold text-gray-800">My Tour Packages <span className="text-gray-400 font-normal text-base">({myTours.length})</span></h2>
              <Link to={addTourPath} className="bg-purple-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-purple-700 transition shadow-sm">
                + Add New Tour
              </Link>
            </div>

            {myTours.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-16 text-center border border-gray-100">
                <div className="text-7xl mb-4">🏝️</div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">No Tours Yet</h3>
                <p className="text-gray-400 mb-6">Start by adding your first tour package</p>
                <Link to={addTourPath} className="bg-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-purple-700 transition">
                  Add Tour
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {myTours.map(tour => {
                  const tourBookingCount = bookings.filter(b => b.tour === tour.id).length;
                  return (
                    <div key={tour.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
                      {/* Image */}
                      <div className="h-44 overflow-hidden relative">
                        {tour.image_url ? (
                          <img src={tour.image_url} alt={tour.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center">
                            <span className="text-5xl">🏖️</span>
                          </div>
                        )}
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-purple-700 font-bold text-sm px-3 py-1 rounded-full shadow">
                          Rs{parseFloat(tour.price).toLocaleString()}
                        </div>
                      </div>
                      {/* Content */}
                      <div className="p-4">
                        <h3 className="font-bold text-gray-800 text-base mb-1 truncate">{tour.title}</h3>
                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500 mb-3">
                          <span>📍 {tour.location}</span>
                          <span>⏱️ {tour.duration} days</span>
                          <span>💺 {tour.available_seats} seats</span>
                          <span>📅 {tourBookingCount} booking{tourBookingCount !== 1 ? 's' : ''}</span>
                        </div>
                        <div className="flex gap-2">
                          <Link to={editTourPath(tour.id)} className="flex-1 text-center py-2 bg-amber-500 text-white rounded-xl text-xs font-semibold hover:bg-amber-600 transition">
                            ✏️ Edit
                          </Link>
                          <Link to={`/tours/${tour.id}`} className="flex-1 text-center py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition">
                            👁️ View
                          </Link>
                          <button
                            onClick={() => setTourToDelete(tour)}
                            className="flex-1 py-2 bg-red-500 text-white rounded-xl text-xs font-semibold hover:bg-red-600 transition"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── BOOKINGS TAB ── */}
        {activeTab === 'bookings' && (
          <div>
            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2 mb-5">
              {['all', 'pending', 'confirmed', 'cancelled'].map(f => (
                <button
                  key={f}
                  onClick={() => setBookingFilter(f)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition capitalize ${
                    bookingFilter === f
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {f} <span className="opacity-70">({f === 'all' ? bookings.length : bookings.filter(b => b.status === f).length})</span>
                </button>
              ))}
            </div>

            {filteredBookings.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-16 text-center border border-gray-100">
                <div className="text-6xl mb-4">📭</div>
                <p className="text-gray-400 font-medium">No bookings found</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        {['#', 'Customer', 'Tour', 'Travel Date', 'Pax', 'Total', 'Payment', 'Status', 'Actions'].map(h => (
                          <th key={h} className="px-4 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredBookings.map(b => (
                        <tr key={b.id} className="hover:bg-purple-50/40 transition">
                          <td className="px-4 py-3.5 text-sm text-gray-400 font-mono">#{b.id}</td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                {b.username?.[0]?.toUpperCase()}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-800">{b.username}</p>
                                <p className="text-xs text-gray-400">{b.user_email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            <p className="text-sm font-medium text-gray-800">{b.tour_title}</p>
                            <p className="text-xs text-gray-400">📍 {b.tour_location}</p>
                          </td>
                          <td className="px-4 py-3.5 text-sm text-gray-600 whitespace-nowrap">
                            {new Date(b.travel_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </td>
                          <td className="px-4 py-3.5 text-sm text-gray-600 text-center">{b.number_of_people}</td>
                          <td className="px-4 py-3.5 text-sm font-bold text-purple-600 whitespace-nowrap">
                            Rs{parseFloat(b.total_price).toLocaleString()}
                          </td>
                          <td className="px-4 py-3.5">
                            <Badge label={b.payment_status} colorClass={PAYMENT_COLOR[b.payment_status] || 'bg-gray-100 text-gray-600'} />
                          </td>
                          <td className="px-4 py-3.5">
                            <Badge label={b.status} colorClass={STATUS_COLOR[b.status] || 'bg-gray-100 text-gray-600'} />
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="flex flex-wrap gap-1.5">
                              {b.status === 'pending' && (
                                <>
                                  <button disabled={updatingId === b.id} onClick={() => handleStatusUpdate(b.id, 'confirmed')} className="px-2.5 py-1.5 bg-emerald-500 text-white rounded-lg text-xs font-semibold hover:bg-emerald-600 transition disabled:opacity-50">✓ Confirm</button>
                                  <button disabled={updatingId === b.id} onClick={() => handleStatusUpdate(b.id, 'cancelled')} className="px-2.5 py-1.5 bg-red-500 text-white rounded-lg text-xs font-semibold hover:bg-red-600 transition disabled:opacity-50">✕ Cancel</button>
                                </>
                              )}
                              {b.status === 'confirmed' && (
                                <button disabled={updatingId === b.id} onClick={() => handleStatusUpdate(b.id, 'cancelled')} className="px-2.5 py-1.5 bg-red-500 text-white rounded-lg text-xs font-semibold hover:bg-red-600 transition disabled:opacity-50">✕ Cancel</button>
                              )}
                              {b.payment_status !== 'paid' && (
                                <button disabled={updatingId === b.id} onClick={() => handlePaymentStatusUpdate(b.id, 'paid')} className="px-2.5 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition disabled:opacity-50">💳 Mark Paid</button>
                              )}
                              {b.payment_status === 'paid' && (
                                <button disabled={updatingId === b.id} onClick={() => handlePaymentStatusUpdate(b.id, 'refunded')} className="px-2.5 py-1.5 bg-gray-500 text-white rounded-lg text-xs font-semibold hover:bg-gray-600 transition disabled:opacity-50">↩ Refund</button>
                              )}
                              {b.status === 'cancelled' && (
                                <span className="text-xs text-gray-400 italic">—</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {showSupport && <SupportModal onClose={() => setShowSupport(false)} role="vendor" />}

      {tourToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center animate-in">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🗑️</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Delete Tour?</h3>
            <p className="text-gray-500 text-sm mb-6">
              Are you sure you want to delete <span className="font-semibold text-gray-700">"{tourToDelete.title}"</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setTourToDelete(null)}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition"
              >
                Keep It
              </button>
              <button
                onClick={handleDeleteTour}
                disabled={deletingId === tourToDelete.id}
                className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition disabled:opacity-50"
              >
                {deletingId === tourToDelete.id ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorDashboard;
