import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tours, bookingAPI } from '../services/api';
import toast from 'react-hot-toast';

const TourDetail = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    travel_date: '',
    number_of_people: 1,
  });
  const [review, setReview] = useState({ rating: 5, comment: '' });

  const loadTour = async () => {
    try {
      const response = await tours.getOne(id);
      setTour(response.data);
    } catch (error) {
      console.error('Error loading tour:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTour();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to book a tour');
      navigate('/login');
      return;
    }
    try {
      await bookingAPI.create({
        tour: id,
        travel_date: bookingData.travel_date,
        number_of_people: bookingData.number_of_people,
      });
      toast.success('Booking created successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to create booking', error);
      toast.error('Failed to create booking');
    }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to leave a review');
      navigate('/login');
      return;
    }
    try {
      await tours.addReview(id, review);
      toast.success('Review added successfully!');
      loadTour();
      setReview({ rating: 5, comment: '' });
    } catch (error) {
      console.error('Failed to add review', error);
      toast.error('Failed to add review');
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!tour) return <div className="text-center py-20">Tour not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Tour Image */}
        <div>
          {tour.image && (
            <img 
              src={`http://127.0.0.1:8000${tour.image}`}
              alt={tour.title}
              className="w-full rounded-lg shadow-lg"
            />
          )}
        </div>

        {/* Tour Info */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{tour.title}</h1>
          <p className="text-gray-600 mb-4">📍 {tour.location}</p>
          <div className="flex items-center mb-4">
            <span className="text-yellow-400 text-xl">⭐</span>
            <span className="ml-2 text-lg">{tour.average_rating?.toFixed(1) || 'No ratings'}</span>
          </div>
          <p className="text-gray-700 mb-6">{tour.description}</p>
          <div className="bg-gray-100 p-4 rounded-lg mb-6">
            <p className="text-2xl font-bold text-blue-600">Rs{tour.price} <span className="text-sm text-gray-600">per person</span></p>
            <p className="text-gray-600">⏱️ {tour.duration} days</p>
          </div>

          {/* Booking Form */}
          <h3 className="text-xl font-bold mb-4">Book This Tour</h3>
          <form onSubmit={handleBooking} className="space-y-4 mb-8">
            <div>
              <label className="block mb-2">Travel Date</label>
              <input
                type="date"
                required
                value={bookingData.travel_date}
                onChange={(e) => setBookingData({...bookingData, travel_date: e.target.value})}
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-2">Number of People</label>
              <input
                type="number"
                min="1"
                required
                value={bookingData.number_of_people}
                onChange={(e) => setBookingData({...bookingData, number_of_people: parseInt(e.target.value)})}
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
            >
              Book Now - Rs{tour.price * bookingData.number_of_people}
            </button>
          </form>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Reviews</h2>
        
        {/* Add Review Form */}
        {user && (
          <form onSubmit={handleReview} className="bg-gray-100 p-6 rounded-lg mb-8">
            <h3 className="text-xl font-bold mb-4">Write a Review</h3>
            <div className="mb-4">
              <label className="block mb-2">Rating</label>
              <select
                value={review.rating}
                onChange={(e) => setReview({...review, rating: parseInt(e.target.value)})}
                className="w-full px-4 py-2 border rounded"
              >
                {[5,4,3,2,1].map(r => (
                  <option key={r} value={r}>{r} Stars</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-2">Comment</label>
              <textarea
                value={review.comment}
                onChange={(e) => setReview({...review, comment: e.target.value})}
                required
                rows="3"
                className="w-full px-4 py-2 border rounded"
              ></textarea>
            </div>
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
              Submit Review
            </button>
          </form>
        )}

        {/* Reviews List */}
        <div className="space-y-4">
          {tour.reviews?.map(review => (
            <div key={review.id} className="border-b pb-4">
              <div className="flex items-center mb-2">
                <span className="font-bold mr-2">{review.username}</span>
                <span className="text-yellow-400">{"⭐".repeat(review.rating)}</span>
              </div>
              <p className="text-gray-700">{review.comment}</p>
              <p className="text-sm text-gray-500 mt-2">
                {new Date(review.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TourDetail;