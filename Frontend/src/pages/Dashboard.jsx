import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingAPI } from '../services/api';
import toast from 'react-hot-toast';

const Dashboard = ({ user }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalSpent: 0,
    upcomingTrips: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const bookingsResponse = await bookingAPI.getMyBookings();
      setBookings(bookingsResponse.data);
      
      const totalSpent = bookingsResponse.data.reduce((sum, booking) => 
        sum + parseFloat(booking.total_price), 0
      );
      const upcomingTrips = bookingsResponse.data.filter(
        booking => booking.status === 'confirmed' && new Date(booking.travel_date) > new Date()
      ).length;
      
      setStats({
        totalBookings: bookingsResponse.data.length,
        totalSpent: totalSpent,
        upcomingTrips: upcomingTrips,
      });
    } catch {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white p-8 mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.username}! 👋</h1>
          <p>Here's what's happening with your travel plans</p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalBookings}</p>
              </div>
              <div className="text-4xl">📅</div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Spent</p>
                <p className="text-3xl font-bold text-gray-800">Rs{stats.totalSpent.toFixed(2)}</p>
              </div>
              <div className="text-4xl">💰</div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Upcoming Trips</p>
                <p className="text-3xl font-bold text-gray-800">{stats.upcomingTrips}</p>
              </div>
              <div className="text-4xl">✈️</div>
            </div>
          </div>
        </div>
        
        {/* Recent Bookings */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Recent Bookings</h2>
            <Link to="/my-bookings" className="text-blue-600 hover:underline">
              View All →
            </Link>
          </div>
          
          {loading ? (
            <div className="text-center py-8">Loading bookings...</div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">You haven't made any bookings yet</p>
              <Link to="/tours" className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 inline-block">
                Browse Tours
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.slice(0, 3).map(booking => (
                <div key={booking.id} className="border rounded-lg p-4 hover:shadow transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">{booking.tour_title}</h3>
                      <p className="text-gray-600">{booking.tour_location}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Travel Date: {new Date(booking.travel_date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        {booking.number_of_people} person(s)
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-blue-600">Rs{booking.total_price}</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm mt-2 ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;