import React, { useState, useEffect } from 'react';
import { tours } from '../services/api';
import TourCard from '../components/TourCard';

const TourList = () => {
  const [allTours, setAllTours] = useState([]);
  const [filteredTours, setFilteredTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    loadTours();
  }, []);

  const loadTours = async () => {
    try {
      const response = await tours.getAll();
      setAllTours(response.data);
      setFilteredTours(response.data);
      const uniqueLocations = [...new Set(response.data.map(t => t.location))];
      setLocations(uniqueLocations);
    } catch (error) {
      console.error('Error loading tours:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = allTours;
    if (search) {
      filtered = filtered.filter(tour => 
        tour.title.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (location) {
      filtered = filtered.filter(tour => tour.location === location);
    }
    setFilteredTours(filtered);
  }, [search, location, allTours]);

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">All Tour Packages</h1>
      
      {/* Filters */}
      <div className="bg-gray-100 p-4 rounded-lg mb-8 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search tours..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 rounded border"
        />
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="px-4 py-2 rounded border"
        >
          <option value="">All Locations</option>
          {locations.map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </div>

      {/* Tours Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTours.map(tour => (
          <TourCard key={tour.id} tour={tour} />
        ))}
      </div>

      {filteredTours.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          No tours found matching your criteria.
        </div>
      )}
    </div>
  );
};

export default TourList;