import React from 'react';
import { Link } from 'react-router-dom';

const TourCard = ({ tour }) => {
  const rating = tour.average_rating;
  const stars = rating ? '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating)) : null;

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
      {/* Image */}
      <div className="relative h-52 bg-gradient-to-br from-blue-400 to-purple-500 flex-shrink-0">
        {tour.image_url ? (
          <img
            src={tour.image_url}
            alt={tour.title}
            className="w-full h-full object-cover"
            onError={e => { e.target.style.display = 'none'; }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">🏖️</div>
        )}
        {/* Seats badge */}
        {tour.available_seats !== undefined && (
          <span className={`absolute top-3 right-3 text-xs font-semibold px-2 py-1 rounded-full ${
            tour.available_seats > 5
              ? 'bg-green-500 text-white'
              : tour.available_seats > 0
              ? 'bg-yellow-400 text-gray-900'
              : 'bg-red-500 text-white'
          }`}>
            {tour.available_seats > 0 ? `${tour.available_seats} seats left` : 'Sold out'}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-1">{tour.title}</h3>

        <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
          <span>📍 {tour.location}</span>
          <span>⏱️ {tour.duration}d</span>
        </div>

        {stars && (
          <div className="flex items-center gap-1 mb-3">
            <span className="text-yellow-400 text-sm tracking-tight">{stars}</span>
            <span className="text-xs text-gray-400">({rating.toFixed(1)})</span>
          </div>
        )}

        <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-1">{tour.description}</p>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
          <div>
            <span className="text-2xl font-extrabold text-blue-600">Rs{tour.price}</span>
            <span className="text-xs text-gray-400 ml-1">/ person</span>
          </div>
          <Link
            to={`/tours/${tour.id}`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TourCard;
