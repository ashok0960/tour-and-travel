import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const run = async () => {
      if (sessionId) {
        try { await api.post('/payments/verify-session/', { session_id: sessionId }); } catch {}
      }
      const interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) { clearInterval(interval); navigate('/my-bookings'); }
          return prev - 1;
        });
      }, 1000);
    };
    run();
  }, [navigate, sessionId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center">

        {/* Success Icon */}
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Payment Successful!</h1>
        <p className="text-gray-500 mb-6">
          Your booking has been confirmed and payment received. Check your bookings for details.
        </p>

        {sessionId && (
          <div className="bg-gray-50 rounded-xl px-4 py-2 mb-6 text-xs text-gray-400 font-mono break-all">
            Session: {sessionId.slice(0, 30)}...
          </div>
        )}

        {/* Demo note */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-6 text-sm text-yellow-700">
          🧪 This was a <strong>test payment</strong>. No real money was charged.
        </div>

        <div className="space-y-3">
          <Link
            to="/my-bookings"
            className="block w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 transition shadow-md"
          >
            View My Bookings
          </Link>
          <Link
            to="/tours"
            className="block w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
          >
            Browse More Tours
          </Link>
        </div>

        <p className="text-gray-400 text-xs mt-5">
          Redirecting automatically in <span className="font-bold text-blue-500">{countdown}s</span>...
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
