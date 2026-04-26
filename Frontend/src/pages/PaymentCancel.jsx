import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const PaymentCancel = () => {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('booking_id');

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center">

        {/* Cancel Icon */}
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Payment Cancelled</h1>
        <p className="text-gray-500 mb-6">
          Your payment was cancelled. Your booking is still saved — you can pay anytime from My Bookings.
        </p>

        {/* Demo test card reminder */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 text-left">
          <p className="text-xs font-bold text-yellow-700 mb-2">🧪 Test Mode — Use this demo card to pay:</p>
          <div className="space-y-1 text-xs text-yellow-800 font-mono">
            <div className="flex justify-between">
              <span className="text-yellow-600">Card Number</span>
              <span className="font-bold tracking-widest">4242 4242 4242 4242</span>
            </div>
            <div className="flex justify-between">
              <span className="text-yellow-600">Expiry</span>
              <span className="font-bold">Any future date</span>
            </div>
            <div className="flex justify-between">
              <span className="text-yellow-600">CVC</span>
              <span className="font-bold">Any 3 digits</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Link
            to="/my-bookings"
            className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition shadow-md"
          >
            Go to My Bookings & Retry
          </Link>
          <Link
            to="/tours"
            className="block w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
          >
            Browse Tours
          </Link>
        </div>

        {bookingId && (
          <p className="text-gray-400 text-xs mt-4">Booking ID: #{bookingId}</p>
        )}
      </div>
    </div>
  );
};

export default PaymentCancel;
