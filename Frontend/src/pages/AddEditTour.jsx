import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { tours as toursAPI } from '../services/api';
import toast from 'react-hot-toast';

const AddEditTour = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  // Detect if coming from vendor routes — return to vendor dashboard after save
  const isVendorRoute = location.pathname.startsWith('/vendor');
  const returnPath = isVendorRoute ? '/vendor/dashboard' : '/admin/tours';
  const [loading, setLoading] = useState(false);
  const [fetchingTour, setFetchingTour] = useState(!!id);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    price: '',
    duration: '',
    available_seats: '',
    image: null
  });
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (id) {
      fetchTour();
    }
  }, [id]);

  const fetchTour = async () => {
    try {
      const response = await toursAPI.getOne(id);
      const tour = response.data;
      setFormData({
        title: tour.title,
        description: tour.description,
        location: tour.location,
        price: tour.price,
        duration: tour.duration,
        available_seats: tour.available_seats,
        image: null
      });
      if (tour.image_url) {
        setPreviewImage(tour.image_url);
      }
    } catch {
      toast.error('Failed to fetch tour details');
      navigate(returnPath);
    } finally {
      setFetchingTour(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file
      });
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.location ||
        !formData.price || !formData.duration || !formData.available_seats) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('location', formData.location);
      data.append('price', formData.price);
      data.append('duration', formData.duration);
      data.append('available_seats', formData.available_seats);
      // Only append image if a new file was selected
      if (formData.image instanceof File) {
        data.append('image', formData.image);
      }

      if (id) {
        await toursAPI.update(id, data);
        toast.success('Tour updated successfully');
      } else {
        await toursAPI.create(data);
        toast.success('Tour created successfully');
      }
      navigate(returnPath);
    } catch (error) {
      const errData = error.response?.data;
      const msg = errData
        ? (typeof errData === 'string' ? errData : Object.values(errData).flat()[0])
        : `Failed to ${id ? 'update' : 'create'} tour`;
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (fetchingTour) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading tour details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {id ? 'Edit Tour' : 'Add New Tour'}
          </h1>
          <p className="text-gray-600">
            {id ? 'Update the tour package details' : 'Create a new tour package'}
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Tour Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., hiking, treaking ...."
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Nepal some place ..."
              />
            </div>

            {/* Price, Duration, and Available Seats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Price (Rs) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 599"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Duration (days) *
                </label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 7"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Available Seats *
                </label>
                <input
                  type="number"
                  name="available_seats"
                  value={formData.available_seats}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 20"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="6"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe the tour package, including highlights, itinerary, and what's included..."
              ></textarea>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Tour Image
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-500 transition">
                <div className="space-y-1 text-center">
                  {previewImage ? (
                    <div className="mb-4">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="mx-auto h-48 w-auto object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewImage(null);
                          setFormData({ ...formData, image: null });
                        }}
                        className="mt-2 text-sm text-red-600 hover:text-red-700"
                      >
                        Remove Image
                      </button>
                    </div>
                  ) : (
                    <>
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="image-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                        >
                          <span>Upload an image</span>
                          <input
                            id="image-upload"
                            name="image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="sr-only"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate(returnPath)}
                className="flex-1 px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? 'Saving...' : (id ? 'Update Tour' : 'Create Tour')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEditTour;