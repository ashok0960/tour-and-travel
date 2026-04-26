import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tours } from '../services/api';
import TourCard from '../components/TourCard';

const Home = ({ user }) => {
  const [featuredTours, setFeaturedTours] = useState([]);
  const [loading, setLoading] = useState(true);

  const isStaff = user?.role === 'admin' || user?.role === 'vendor';

  useEffect(() => {
    tours.getAll()
      .then(r => setFeaturedTours(r.data.slice(0, 3)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* ── Hero ── */}
      <div className="relative min-h-[560px] flex items-center bg-gradient-to-br from-blue-700 via-blue-600 to-purple-700 text-white overflow-hidden">
        {/* decorative circles */}
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-white opacity-5 rounded-full" />
        <div className="absolute -bottom-32 -right-20 w-[500px] h-[500px] bg-purple-400 opacity-10 rounded-full" />

        <div className="container mx-auto px-4 py-24 relative z-10 text-center">
          <span className="inline-block bg-white/20 text-white text-sm font-medium px-4 py-1 rounded-full mb-6 backdrop-blur-sm">
            ✈️ &nbsp;Trusted by 10,000+ travelers
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            Explore the World<br />
            <span className="text-yellow-300">Your Way</span>
          </h1>
          <p className="text-xl text-blue-100 mb-10 max-w-xl mx-auto">
            Discover handpicked tour packages, book instantly, and create memories that last a lifetime.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isStaff && (
              <Link
                to="/tours"
                className="bg-white text-blue-700 px-8 py-3 rounded-xl font-bold hover:bg-yellow-300 hover:text-blue-800 transition-all duration-200 shadow-lg"
              >
                Browse Tours
              </Link>
            )}
            <Link
              to={user ? (user.role === 'admin' ? '/admin/dashboard' : user.role === 'vendor' ? '/vendor/dashboard' : '/dashboard') : '/register'}
              className="border-2 border-white text-white px-8 py-3 rounded-xl font-bold hover:bg-white hover:text-blue-700 transition-all duration-200"
            >
              {user ? 'My Dashboard' : 'Join Free'}
            </Link>
          </div>
        </div>
      </div>

      {/* ── Stats Bar ── */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '500+', label: 'Tour Packages' },
              { value: '50+', label: 'Destinations' },
              { value: '10K+', label: 'Happy Travelers' },
              { value: '4.9★', label: 'Average Rating' },
            ].map(s => (
              <div key={s.label}>
                <p className="text-3xl font-extrabold text-blue-600">{s.value}</p>
                <p className="text-gray-500 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Featured Tours ── */}
      {!isStaff && (
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-gray-800 mb-3">Featured Tours</h2>
            <p className="text-gray-500 max-w-md mx-auto">Hand-picked experiences for every kind of traveler</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse">
                  <div className="h-52 bg-gray-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : featuredTours.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <div className="text-6xl mb-4">🏝️</div>
              <p className="text-lg">No tours available yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredTours.map(tour => <TourCard key={tour.id} tour={tour} />)}
            </div>
          )}

          <div className="text-center mt-10">
            <Link to="/tours" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition shadow-md">
              View All Tours →
            </Link>
          </div>
        </div>
      )}

      {/* ── Why Choose Us ── */}
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-gray-800 mb-3">Why TravelHub?</h2>
            <p className="text-gray-500">Everything you need for a perfect trip</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '💰', title: 'Best Prices', desc: 'Competitive pricing with no hidden fees. Get the best value for every rupee.' },
              { icon: '🛡️', title: 'Secure Booking', desc: 'Stripe-powered payments. Your card details are never stored on our servers.' },
              { icon: '🎧', title: '24/7 Support', desc: 'Our travel experts are available round the clock to assist you anytime.' },
            ].map(f => (
              <div key={f.title} className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-shadow text-center">
                <div className="text-5xl mb-4">{f.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{f.title}</h3>
                <p className="text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA Banner ── */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-extrabold mb-4">Ready for Your Next Adventure?</h2>
          <p className="text-blue-100 text-lg mb-8 max-w-md mx-auto">
            Join thousands of happy travelers. Sign up free and start exploring today.
          </p>
          <Link
            to={user ? (user.role === 'admin' ? '/admin/dashboard' : user.role === 'vendor' ? '/vendor/dashboard' : '/dashboard') : '/register'}
            className="bg-yellow-400 text-gray-900 px-10 py-3 rounded-xl font-bold hover:bg-yellow-300 transition shadow-lg text-lg"
          >
            {user ? 'Go to Dashboard' : 'Get Started Free'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
