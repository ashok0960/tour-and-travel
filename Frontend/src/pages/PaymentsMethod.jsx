import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { paymentsAPI } from '../services/api';
import toast from 'react-hot-toast';

const PaymentsMethod = ({ booking, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('stripe');
  const navigate = useNavigate();

  const fmt = (amount) => `Rs${parseFloat(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

  const handlePayment = async () => {
    setLoading(true);
    try {
      if (selectedMethod === 'stripe') {
        const response = await paymentsAPI.createCheckoutSession(booking.id);
        if (response.data.checkout_url) {
          window.location.href = response.data.checkout_url;
        }
      } else if (selectedMethod === 'khalti') {
        const response = await paymentsAPI.khaltiInitiate(booking.id);
        if (response.data.payment_url) {
          window.location.href = response.data.payment_url;
        }
      }
    } catch (error) {
      const msg = error.response?.data?.error || 'Payment initiation failed. Please try again.';
      if (error.response?.status === 401) {
        toast.error('Please login again');
        navigate('/login');
      } else if (error.response?.status === 503) {
        toast.error(error.response.data.error || 'Payment service unavailable.');
      } else if (error.code === 'ERR_NETWORK') {
        toast.error('Cannot connect to server. Make sure backend is running.');
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const methods = [
    {
      id: 'stripe',
      label: 'Credit / Debit Card',
      sublabel: 'Visa, Mastercard, Rupay & more',
      icon: '💳',
      badge: 'International',
      badgeColor: 'bg-blue-100 text-blue-700',
      borderColor: 'border-blue-500',
      bg: 'bg-blue-50',
    },
    {
      id: 'khalti',
      label: 'Khalti',
      sublabel: 'Nepal\'s trusted digital wallet',
      icon: '🟣',
      badge: 'Nepal',
      badgeColor: 'bg-purple-100 text-purple-700',
      borderColor: 'border-purple-500',
      bg: 'bg-purple-50',
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-5 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white">Complete Payment</h2>
            <p className="text-blue-100 text-sm mt-0.5">Choose your payment method</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          {/* Booking Summary */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 mb-5 border border-blue-100">
            <h3 className="font-bold text-gray-700 mb-3 text-sm uppercase tracking-wide">Booking Summary</h3>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Tour</span>
                <span className="font-semibold text-gray-800 text-right max-w-[60%] truncate">{booking.tour_title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Location</span>
                <span className="text-gray-700">📍 {booking.tour_location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Travel Date</span>
                <span className="text-gray-700">📅 {new Date(booking.travel_date).toLocaleDateString('en-NP', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Passengers</span>
                <span className="text-gray-700">👥 {booking.number_of_people} {booking.number_of_people === 1 ? 'person' : 'people'}</span>
              </div>
              <div className="border-t border-blue-200 pt-2 mt-2 flex justify-between items-center">
                <span className="font-bold text-gray-800">Total</span>
                <span className="text-xl font-extrabold text-blue-600">{fmt(booking.total_price)}</span>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="mb-5 space-y-3">
            <h3 className="font-semibold text-gray-700 text-sm">Select Payment Method</h3>
            {methods.map(m => (
              <label
                key={m.id}
                className={`flex items-center p-3.5 border-2 rounded-xl cursor-pointer transition-all ${
                  selectedMethod === m.id ? `${m.borderColor} ${m.bg}` : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={m.id}
                  checked={selectedMethod === m.id}
                  onChange={() => setSelectedMethod(m.id)}
                  className="mr-3 accent-purple-600"
                />
                <span className="text-2xl mr-3">{m.icon}</span>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 text-sm">{m.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{m.sublabel}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${m.badgeColor}`}>
                  {m.badge}
                </span>
              </label>
            ))}
          </div>

          {/* Pay Button */}
          <button
            onClick={handlePayment}
            disabled={loading}
            className={`w-full text-white py-3.5 rounded-xl font-bold text-base transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-md ${
              selectedMethod === 'khalti'
                ? 'bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {selectedMethod === 'khalti' ? 'Redirecting to Khalti...' : 'Redirecting to Stripe...'}
              </span>
            ) : (
              `Pay ${fmt(booking.total_price)} via ${selectedMethod === 'khalti' ? 'Khalti' : 'Card'}`
            )}
          </button>

          {/* Test info */}
          {selectedMethod === 'stripe' && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-xl p-3">
              <p className="text-xs font-bold text-yellow-700 mb-2">🧪 Stripe Test Mode — Use Demo Card</p>
              <div className="space-y-1 text-xs text-yellow-800 font-mono">
                <div className="flex justify-between">
                  <span className="text-yellow-600">Card Number</span>
                  <span className="font-bold tracking-widest">4242 4242 4242 4242</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-yellow-600">Expiry / CVC</span>
                  <span className="font-bold">Any future date / Any 3 digits</span>
                </div>
              </div>
            </div>
          )}

          {selectedMethod === 'khalti' && (
            <div className="mt-4 bg-purple-50 border border-purple-200 rounded-xl p-3">
              <p className="text-xs font-bold text-purple-700 mb-2">🧪 Khalti Test Mode — Use Demo Credentials</p>
              <div className="space-y-1 text-xs text-purple-800 font-mono">
                <div className="flex justify-between">
                  <span className="text-purple-600">Khalti ID</span>
                  <span className="font-bold">9800000000 – 9800000005</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-600">MPIN</span>
                  <span className="font-bold">1111</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-600">OTP</span>
                  <span className="font-bold">987654</span>
                </div>
              </div>
            </div>
          )}

          {/* Security Note */}
          <div className="mt-3 flex items-center justify-center gap-3 text-xs text-gray-400">
            <span>🔒 SSL Secured</span>
            <span>•</span>
            <span>{selectedMethod === 'khalti' ? 'Powered by Khalti' : 'Powered by Stripe'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentsMethod;
