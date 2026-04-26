import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { paymentsAPI } from '../services/api';

const KhaltiVerify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); 

  useEffect(() => {
    const pidx = searchParams.get('pidx');
    const bookingId = searchParams.get('booking_id');
    const txnStatus = searchParams.get('status');

    if (!pidx || !bookingId) {
      setStatus('failed');
      return;
    }

    if (txnStatus !== 'Completed') {
      setStatus('failed');
      return;
    }

    paymentsAPI.khaltiVerify(bookingId, pidx)
      .then(() => {
        setStatus('success');
        setTimeout(() => navigate('/my-bookings'), 3000);
      })
      .catch(() => setStatus('failed'));
  }, []); 

  if (status === 'verifying') return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block w-14 h-14 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-600 font-medium">Verifying your Khalti payment...</p>
      </div>
    </div>
  );

  if (status === 'success') return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-green-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Khalti Payment Successful!</h1>
        <p className="text-gray-500 mb-6">Your booking is confirmed. Thank you for using Khalti!</p>
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 mb-6 text-sm text-purple-700">
          🟣 Paid via <strong>Khalti</strong> — Nepal's trusted digital wallet
        </div>
        <Link to="/my-bookings" className="block w-full bg-gradient-to-r from-purple-600 to-green-500 text-white py-3 rounded-xl font-bold hover:opacity-90 transition shadow-md">
          View My Bookings
        </Link>
        <p className="text-gray-400 text-xs mt-4">Redirecting automatically in 3s...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Payment Failed</h1>
        <p className="text-gray-500 mb-6">Khalti payment could not be verified. Your booking is still saved.</p>
        <div className="space-y-3">
          <Link to="/my-bookings" className="block w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-bold hover:opacity-90 transition shadow-md">
            Go to My Bookings & Retry
          </Link>
          <Link to="/tours" className="block w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition">
            Browse Tours
          </Link>
        </div>
      </div>
    </div>
  );
};

export default KhaltiVerify;
