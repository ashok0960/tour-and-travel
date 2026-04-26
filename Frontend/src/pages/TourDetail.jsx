import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { tours, bookingAPI } from '../services/api';
import toast from 'react-hot-toast';

const TourDetail = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [bookingData, setBookingData] = useState({ travel_date: '', number_of_people: 1 });
  const [review, setReview] = useState({ rating: 5, comment: '' });

  // min date = tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const loadTour = async () => {
    try {
      const r = await tours.getOne(id);
      setTour(r.data);
    } catch (err) {
      if (err.response?.status !== 401) {
        toast.error('Tour not found');
        navigate('/tours');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadTour(); }, [id]); // eslint-disable-line

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to book'); navigate('/login'); return; }
    if (tour.available_seats < bookingData.number_of_people) {
      toast.error(`Only ${tour.available_seats} seats available`);
      return;
    }
    setBookingLoading(true);
    try {
      await bookingAPI.create({ tour: id, travel_date: bookingData.travel_date, number_of_people: bookingData.number_of_people });
      toast.success('Booking created! Proceed to payment from My Bookings.');
      navigate('/my-bookings');
    } catch (error) {
      const msg = error.response?.data?.travel_date?.[0] || error.response?.data?.non_field_errors?.[0] || 'Failed to create booking';
      toast.error(msg);
    } finally {
      setBookingLoading(false);
    }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to review'); navigate('/login'); return; }
    setReviewLoading(true);
    try {
      await tours.addReview(id, review);
      toast.success('Review submitted!');
      setReview({ rating: 5, comment: '' });
      loadTour();
    } catch {
      toast.error('Failed to submit review');
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-500">Loading tour details...</p>
      </div>
    </div>
  );

  const totalCost = tour.price * bookingData.number_of_people;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image */}
      <div className="relative h-72 md:h-96 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
        {tour.image_url ? (
          <img
            src={tour.image_url}
            alt={tour.title}
            className="w-full h-full object-cover"
            onError={e => { e.target.style.display = 'none'; }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-8xl">🏖️</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-6 left-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Link to="/tours" className="text-white/70 hover:text-white text-sm transition">Tours</Link>
            <span className="text-white/50">›</span>
            <span className="text-sm">{tour.title}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold">{tour.title}</h1>
          <p className="text-white/80 mt-1">📍 {tour.location}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left: Tour Info */}
          <div className="lg:col-span-2 space-y-6">

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-3 bg-blue-50 rounded-xl">
                  <p className="text-2xl font-extrabold text-blue-600">Rs{tour.price}</p>
                  <p className="text-xs text-gray-500 mt-1">Per Person</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-xl">
                  <p className="text-2xl font-extrabold text-purple-600">{tour.duration}</p>
                  <p className="text-xs text-gray-500 mt-1">Days</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-xl">
                  <p className="text-2xl font-extrabold text-yellow-600">
                    {tour.average_rating ? tour.average_rating.toFixed(1) : '—'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Rating</p>
                </div>
                <div className={`p-3 rounded-xl ${tour.available_seats > 5 ? 'bg-green-50' : tour.available_seats > 0 ? 'bg-orange-50' : 'bg-red-50'}`}>
                  <p className={`text-2xl font-extrabold ${tour.available_seats > 5 ? 'text-green-600' : tour.available_seats > 0 ? 'text-orange-600' : 'text-red-600'}`}>
                    {tour.available_seats}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Seats Left</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-3">About This Tour</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{tour.description}</p>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-5">
                Reviews ({tour.reviews?.length || 0})
              </h2>

              {/* Write Review */}
              {user ? (
                <form onSubmit={handleReview} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-5 mb-6 border border-blue-100">
                  <h3 className="font-semibold text-gray-700 mb-4">Write a Review</h3>
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-600 mb-2">Your Rating</p>
                    <div className="flex gap-2">
                      {[1,2,3,4,5].map(r => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setReview({ ...review, rating: r })}
                          className={`text-2xl transition-transform hover:scale-125 ${r <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        >
                          ★
                        </button>
                      ))}
                      <span className="ml-2 text-sm text-gray-500 self-center">{review.rating}/5</span>
                    </div>
                  </div>
                  <textarea
                    value={review.comment}
                    onChange={e => setReview({ ...review, comment: e.target.value })}
                    required
                    rows={3}
                    placeholder="Share your experience..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-none"
                  />
                  <button
                    type="submit"
                    disabled={reviewLoading}
                    className="mt-3 bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-60"
                  >
                    {reviewLoading ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              ) : (
                <div className="bg-gray-50 rounded-xl p-4 mb-6 text-center border border-dashed border-gray-200">
                  <p className="text-gray-500 text-sm">
                    <Link to="/login" className="text-blue-600 font-semibold hover:underline">Sign in</Link> to leave a review
                  </p>
                </div>
              )}

              {/* Reviews List */}
              {tour.reviews?.length === 0 ? (
                <p className="text-gray-400 text-center py-6">No reviews yet. Be the first!</p>
              ) : (
                <div className="space-y-4">
                  {tour.reviews?.map(r => (
                    <div key={r.id} className="border-b border-gray-100 pb-4 last:border-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                            {r.username[0].toUpperCase()}
                          </div>
                          <span className="font-semibold text-gray-800 text-sm">{r.username}</span>
                        </div>
                        <span className="text-xs text-gray-400">{new Date(r.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="text-yellow-400 text-sm mb-1">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                      <p className="text-gray-600 text-sm">{r.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-6">
              <div className="text-center mb-5 pb-5 border-b border-gray-100">
                <p className="text-3xl font-extrabold text-blue-600">Rs{tour.price}</p>
                <p className="text-gray-400 text-sm">per person</p>
              </div>

              {tour.available_seats === 0 ? (
                <div className="text-center py-6">
                  <div className="text-4xl mb-3">😔</div>
                  <p className="font-bold text-red-600 text-lg">Sold Out</p>
                  <p className="text-gray-500 text-sm mt-1">This tour is fully booked</p>
                </div>
              ) : (
                <form onSubmit={handleBooking} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Travel Date</label>
                    <input
                      type="date"
                      required
                      min={minDate}
                      value={bookingData.travel_date}
                      onChange={e => setBookingData({ ...bookingData, travel_date: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Number of People
                      <span className="text-gray-400 font-normal ml-1">(max {tour.available_seats})</span>
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={tour.available_seats}
                      required
                      value={bookingData.number_of_people}
                      onChange={e => setBookingData({ ...bookingData, number_of_people: Math.max(1, parseInt(e.target.value) || 1) })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                    />
                  </div>

                  {/* Price breakdown */}
                  <div className="bg-blue-50 rounded-xl p-4 space-y-2 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Rs{tour.price} × {bookingData.number_of_people} person{bookingData.number_of_people > 1 ? 's' : ''}</span>
                      <span>Rs{totalCost}</span>
                    </div>
                    <div className="flex justify-between font-bold text-gray-800 pt-2 border-t border-blue-100">
                      <span>Total</span>
                      <span className="text-blue-600 text-lg">Rs{totalCost}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-60 shadow-md"
                  >
                    {bookingLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Booking...
                      </span>
                    ) : `Book Now — Rs${totalCost}`}
                  </button>

                  {!user && (
                    <p className="text-center text-xs text-gray-400">
                      <Link to="/login" className="text-blue-600 hover:underline">Login</Link> required to book
                    </p>
                  )}
                </form>
              )}

              <div className="mt-5 pt-4 border-t border-gray-100 text-xs text-gray-400 text-center space-y-1">
                <p>🔒 Secure payment via Stripe</p>
                <p>✅ Free cancellation before travel date</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetail;
