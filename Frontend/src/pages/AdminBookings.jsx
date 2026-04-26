import React, { useState, useEffect } from 'react';
import { bookingAPI } from '../services/api';
import toast from 'react-hot-toast';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    pending: 0,
    cancelled: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    loadAllBookings();
  }, []);

  const loadAllBookings = async () => {
    try {
      const response = await bookingAPI.getAllBookings();
      const data = response.data;
      setBookings(data);
      setStats({
        total: data.length,
        confirmed: data.filter(b => b.status === 'confirmed').length,
        pending: data.filter(b => b.status === 'pending').length,
        cancelled: data.filter(b => b.status === 'cancelled').length,
        totalRevenue: data.filter(b => b.status === 'confirmed').reduce((s, b) => s + parseFloat(b.total_price), 0),
      });
    } catch {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await bookingAPI.updateStatus(bookingId, { status: newStatus });
      toast.success(`Booking ${newStatus}`);
      loadAllBookings();
    } catch {
      toast.error('Failed to update booking status');
    }
  };

  const handlePaymentStatusUpdate = async (bookingId, newPaymentStatus) => {
    try {
      await bookingAPI.updatePaymentStatus(bookingId, { payment_status: newPaymentStatus });
      toast.success(`Payment marked as ${newPaymentStatus}`);
      loadAllBookings();
    } catch {
      toast.error('Failed to update payment status');
    }
  };

  const filteredBookings = bookings.filter(b => {
    if (filter !== 'all' && b.status !== filter) return false;
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      return b.tour_title?.toLowerCase().includes(s) || b.username?.toLowerCase().includes(s) || b.tour_location?.toLowerCase().includes(s);
    }
    return true;
  });

  const formatDate = d => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  const formatCurrency = a => parseFloat(a).toFixed(2);
  const getStatusColor = s => ({ confirmed: 'bg-green-100 text-green-800', pending: 'bg-yellow-100 text-yellow-800', cancelled: 'bg-red-100 text-red-800' })[s] || 'bg-gray-100 text-gray-800';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Manage Bookings</h1>
          <p className="text-gray-600">View and manage all customer bookings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-500">Total Bookings</p>
            <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
          </div>
          <div className="bg-green-50 rounded-lg shadow p-4">
            <p className="text-sm text-green-600">Confirmed</p>
            <p className="text-2xl font-bold text-green-700">{stats.confirmed}</p>
          </div>
          <div className="bg-yellow-50 rounded-lg shadow p-4">
            <p className="text-sm text-yellow-600">Pending</p>
            <p className="text-2xl font-bold text-yellow-700">{stats.pending}</p>
          </div>
          <div className="bg-red-50 rounded-lg shadow p-4">
            <p className="text-sm text-red-600">Cancelled</p>
            <p className="text-2xl font-bold text-red-700">{stats.cancelled}</p>
          </div>
          <div className="bg-blue-50 rounded-lg shadow p-4">
            <p className="text-sm text-blue-600">Total Revenue</p>
            <p className="text-2xl font-bold text-blue-700">Rs{formatCurrency(stats.totalRevenue)}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <svg className="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by tour, customer, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              {['all', 'pending', 'confirmed', 'cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg transition ${
                    filter === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Bookings Found</h2>
            <p className="text-gray-600">
              {searchTerm ? 'No bookings match your search criteria' : 'No bookings have been made yet'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tour</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Travel Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">People</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{booking.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{booking.username}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{booking.tour_title}</div>
                        <div className="text-sm text-gray-500">{booking.tour_location}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(booking.travel_date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {booking.number_of_people}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">
                        Rs{formatCurrency(booking.total_price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          booking.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                          booking.payment_status === 'failed' ? 'bg-red-100 text-red-800' :
                          booking.payment_status === 'refunded' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {booking.payment_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex flex-wrap gap-1">
                          {booking.status === 'pending' && (
                            <>
                              <button onClick={() => handleStatusUpdate(booking.id, 'confirmed')} className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs">✓ Confirm</button>
                              <button onClick={() => handleStatusUpdate(booking.id, 'cancelled')} className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs">✕ Cancel</button>
                            </>
                          )}
                          {booking.status === 'confirmed' && (
                            <button onClick={() => handleStatusUpdate(booking.id, 'cancelled')} className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs">✕ Cancel</button>
                          )}
                          {booking.payment_status !== 'paid' && (
                            <button onClick={() => handlePaymentStatusUpdate(booking.id, 'paid')} className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs">💳 Mark Paid</button>
                          )}
                          {booking.payment_status === 'paid' && (
                            <button onClick={() => handlePaymentStatusUpdate(booking.id, 'refunded')} className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-xs">↩ Refund</button>
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
    </div>
  );
};

export default AdminBookings;