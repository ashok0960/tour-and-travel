import React from 'react';
import { Link } from 'react-router-dom';

const TourCard = ({ tour }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105">
      {tour.image && (
        <img 
          src={`http://127.0.0.1:8000${tour.image}`} 
          alt={tour.title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">{tour.title}</h3>
        <p className="text-gray-600 mb-2">📍 {tour.location}</p>
        <p className="text-gray-600 mb-2">⏱️ {tour.duration} days</p>
        <p className="text-2xl font-bold text-blue-600 mb-4">Rs{tour.price}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-yellow-400">⭐</span>
            <span className="ml-1">{tour.average_rating?.toFixed(1) || 'No ratings'}</span>
          </div>
          <Link 
            to={`/tours/${tour.id}`}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TourCard;