import React, { useState, useEffect, useMemo } from 'react';
import { tours } from '../services/api';
import TourCard from '../components/TourCard';

const TourList = () => {
  const [allTours, setAllTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    tours.getAll()
      .then(r => setAllTours(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const locations = useMemo(() => [...new Set(allTours.map(t => t.location))].sort(), [allTours]);

  const filtered = useMemo(() => {
    let list = [...allTours];
    if (search) list = list.filter(t => t.title.toLowerCase().includes(search.toLowerCase()) || t.location.toLowerCase().includes(search.toLowerCase()));
    if (location) list = list.filter(t => t.location === location);
    if (maxPrice) list = list.filter(t => parseFloat(t.price) <= parseFloat(maxPrice));
    switch (sortBy) {
      case 'price-asc': list.sort((a, b) => a.price - b.price); break;
      case 'price-desc': list.sort((a, b) => b.price - a.price); break;
      case 'rating': list.sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0)); break;
      case 'duration': list.sort((a, b) => a.duration - b.duration); break;
      default: break; // newest = API order
    }
    return list;
  }, [allTours, search, location, maxPrice, sortBy]);

  const clearFilters = () => { setSearch(''); setLocation(''); setMaxPrice(''); setSortBy('newest'); };
  const hasFilters = search || location || maxPrice || sortBy !== 'newest';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold mb-2">All Tour Packages</h1>
          <p className="text-blue-100">Discover {allTours.length} amazing experiences worldwide</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-md p-5 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative md:col-span-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search tours..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              />
            </div>

            {/* Location */}
            <select
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            >
              <option value="">All Locations</option>
              {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
            </select>

            {/* Max Price */}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">Rs</span>
              <input
                type="number"
                placeholder="Max price"
                value={maxPrice}
                onChange={e => setMaxPrice(e.target.value)}
                min="0"
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              />
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            >
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="rating">Top Rated</option>
              <option value="duration">Shortest First</option>
            </select>
          </div>

          {hasFilters && (
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                Showing <span className="font-semibold text-blue-600">{filtered.length}</span> of {allTours.length} tours
              </p>
              <button onClick={clearFilters} className="text-sm text-red-500 hover:text-red-700 font-medium flex items-center gap-1">
                ✕ Clear filters
              </button>
            </div>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3,4,5,6].map(i => (
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
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-md">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No tours found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your filters</p>
            <button onClick={clearFilters} className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map(tour => <TourCard key={tour.id} tour={tour} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default TourList;
