import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingAPI } from '../services/api';
import api from '../services/api';
import toast from 'react-hot-toast';
import PaymentsMethod from './PaymentsMethod';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, confirmed, pending, cancelled
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);


  useEffect(() => {
    const run = async () => {
      const params = new URLSearchParams(window.location.search);
      const sessionId = params.get('session_id');
      const paymentStatus = params.get('payment');

      if (sessionId) {
        try { await api.post('/payments/verify-session/', { session_id: sessionId }); } catch {}
        window.history.replaceState({}, '', window.location.pathname);
        toast.success('🎉 Payment Successful! Your booking is confirmed.', { id: 'payment-success' });
      } else if (paymentStatus === 'success') {
        toast.success('🎉 Payment Successful! Your booking is confirmed.', { id: 'payment-success' });
        window.history.replaceState({}, '', window.location.pathname);
      }

      await loadBookings();
    };
    run();

    const handleFocus = () => loadBookings();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const loadBookings = async () => {
    try {
      const response = await bookingAPI.getMyBookings();
      setBookings(response.data);
    } catch {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentClick = (booking) => {
    setSelectedBooking(booking);
    setShowPaymentModal(true);
  };


  const STATUS_COLOR = { confirmed: 'bg-green-100 text-green-800 border-green-200', pending: 'bg-yellow-100 text-yellow-800 border-yellow-200', cancelled: 'bg-red-100 text-red-800 border-red-200' };
  const STATUS_ICON = { confirmed: '✅', pending: '⏳', cancelled: '❌' };
  const filteredBookings = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);
  const formatDate = d => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const formatCurrency = a => parseFloat(a).toFixed(2);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Bookings</h1>
          <p className="text-gray-600">View and manage all your tour bookings</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition ${filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
          >
            All ({bookings.length})
          </button>
          <button
            onClick={() => setFilter('confirmed')}
            className={`px-4 py-2 rounded-lg transition ${filter === 'confirmed'
              ? 'bg-green-600 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
          >
            Confirmed ({bookings.filter(b => b.status === 'confirmed').length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg transition ${filter === 'pending'
              ? 'bg-yellow-600 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
          >
            Pending ({bookings.filter(b => b.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('cancelled')}
            className={`px-4 py-2 rounded-lg transition ${filter === 'cancelled'
              ? 'bg-red-600 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
          >
            Cancelled ({bookings.filter(b => b.status === 'cancelled').length})
          </button>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">📅</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Bookings Found</h2>
            <p className="text-gray-600 mb-6">
              {filter === 'all'
                ? "You haven't made any bookings yet"
                : `You don't have any ${filter} bookings`}
            </p>
            <Link to="/tours" className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 inline-block">
              Browse Tours
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="flex flex-col md:flex-row">
                  {/* Booking Status Sidebar */}
                  <div className={`md:w-48 p-4 ${STATUS_COLOR[booking.status] || 'bg-gray-100 text-gray-800'} border-r`}>
                    <div className="text-center">
                      <div className="text-3xl mb-2">{STATUS_ICON[booking.status] || '📅'}</div>
                      <p className="font-semibold uppercase text-sm">{booking.status}</p>
                      <p className="text-xs mt-2">Booking ID: #{booking.id}</p>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="flex-1 p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start mb-4">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                          {booking.tour_title}
                        </h2>
                        <div className="flex items-center text-gray-600 mb-2">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{booking.tour_location}</span>
                        </div>
                      </div>
                      <div className="mt-2 md:mt-0">
                        <p className="text-2xl font-bold text-blue-600">
                          Rs{formatCurrency(booking.total_price)}
                        </p>
                        <p className="text-sm text-gray-500">Total amount</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <div>
                          <p className="text-sm text-gray-500">Travel Date</p>
                          <p className="font-semibold">{formatDate(booking.travel_date)}</p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <div>
                          <p className="text-sm text-gray-500">Number of People</p>
                          <p className="font-semibold">{booking.number_of_people} {booking.number_of_people === 1 ? 'person' : 'people'}</p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <p className="text-sm text-gray-500">Booking Date</p>
                          <p className="font-semibold">{formatDate(booking.booking_date)}</p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        <div>
                          <p className="text-sm text-gray-500">Price per person</p>
                          <p className="font-semibold">Rs{formatCurrency(booking.total_price / booking.number_of_people)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t items-center">
                      {/* Payment status badge */}
                      <span className={`text-xs px-3 py-1 rounded-full font-semibold border ${
                        booking.payment_status === 'paid' ? 'bg-green-50 text-green-700 border-green-200' :
                        booking.payment_status === 'failed' ? 'bg-red-50 text-red-700 border-red-200' :
                        booking.status === 'confirmed' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        'bg-yellow-50 text-yellow-700 border-yellow-200'
                      }`}>
                        💳 {booking.payment_status === 'paid' ? 'Paid' : booking.payment_status === 'failed' ? 'Payment Failed' : booking.status === 'confirmed' ? 'Confirmed - Pay Now' : 'Payment Pending'}
                      </span>

                      <Link
                        to={`/tours/${booking.tour}`}
                        className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                      >
                        View Tour
                      </Link>

                      {/* Only show these if NOT paid+confirmed */}
                      {!(booking.payment_status === 'paid' && booking.status === 'confirmed') && (
                        <>
                          {booking.status === 'pending' && (
                            <button
                              onClick={async () => {
                                if (window.confirm('Are you sure you want to cancel this booking?')) {
                                  try {
                                    await bookingAPI.updateStatus(booking.id, { status: 'cancelled' });
                                    toast.success('Booking cancelled');
                                    loadBookings();
                                  } catch {
                                    toast.error('Failed to cancel booking');
                                  }
                                }
                              }}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
                            >
                              Cancel
                            </button>
                          )}
                          {booking.payment_status !== 'paid' && booking.status !== 'cancelled' && (
                            <button
                              onClick={() => handlePaymentClick(booking)}
                              className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition flex items-center gap-2 text-sm font-semibold shadow-sm"
                            >
                              💳 Pay Now
                            </button>
                          )}
                          {booking.payment_status !== 'paid' && (
                            <button
                              onClick={async () => {
                                if (!window.confirm('Delete this booking?')) return;
                                try {
                                  await bookingAPI.deleteBooking(booking.id);
                                  toast.success('Booking deleted');
                                  loadBookings();
                                } catch (e) {
                                  toast.error(e.response?.data?.error || 'Failed to delete booking');
                                }
                              }}
                              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-red-100 hover:text-red-700 transition text-sm font-semibold"
                            >
                              🗑️ Delete
                            </button>
                          )}
                        </>
                      )}

                      {/* Paid + confirmed: only delete allowed */}
                      {booking.payment_status === 'paid' && booking.status === 'confirmed' && (
                        <button
                          onClick={async () => {
                            if (!window.confirm('Delete this booking?')) return;
                            try {
                              await bookingAPI.deleteBooking(booking.id);
                              toast.success('Booking deleted');
                              loadBookings();
                            } catch (e) {
                              toast.error(e.response?.data?.error || 'Failed to delete booking');
                            }
                          }}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-red-100 hover:text-red-700 transition text-sm font-semibold"
                        >
                          🗑️ Delete
                        </button>
                      )}

                      {showPaymentModal && selectedBooking && (
                        <PaymentsMethod
                          booking={selectedBooking}
                          onClose={() => { setShowPaymentModal(false); setSelectedBooking(null); }}
                          onSuccess={() => { setShowPaymentModal(false); loadBookings(); }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary Section */}
        {bookings.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Booking Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-blue-600">
                  Rs{formatCurrency(bookings.reduce((sum, b) => sum + parseFloat(b.total_price), 0))}
                </p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Confirmed Trips</p>
                <p className="text-2xl font-bold text-green-600">
                  {bookings.filter(b => b.status === 'confirmed').length}
                </p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600">Total People</p>
                <p className="text-2xl font-bold text-purple-600">
                  {bookings.reduce((sum, b) => sum + b.number_of_people, 0)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;