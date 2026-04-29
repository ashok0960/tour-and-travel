import React, { useState, useEffect } from 'react';
import { contactAPI } from '../services/api';
import toast from 'react-hot-toast';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await contactAPI.sendMessage(formData);
      toast.success('✅ Message sent successfully! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      toast.error('❌ Failed to send message. Please try again.');
      console.error('Contact form error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white py-16 px-4">
        <div className="container mx-auto">
          <div className="flex items-center space-x-4 mb-6">
            <span className="text-5xl">📧</span>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold">Contact Us</h1>
              <p className="text-blue-200 mt-2">We'd love to hear from you. Get in touch with us today!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Contact Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Phone Card */}
            <div className="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300 border-t-4 border-blue-500">
              <div className="text-5xl mb-4">📞</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Call Us</h3>
              <p className="text-gray-600 mb-4">We're available Monday to Sunday</p>
              <a href="tel:9810549380" className="text-blue-600 hover:text-blue-700 font-semibold text-lg">
                9810549380
              </a>
            </div>

            {/* Email Card */}
            <div className="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300 border-t-4 border-purple-500">
              <div className="text-5xl mb-4">✉️</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Email Us</h3>
              <p className="text-gray-600 mb-4">Send us your queries anytime</p>
              <a href="mailto:ashokkumarkarki5@gmail.com" className="text-purple-600 hover:text-purple-700 font-semibold break-all">
                ashokkumarkarki5@gmail.com
              </a>
            </div>

            {/* Location Card */}
            <div className="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300 border-t-4 border-pink-500">
              <div className="text-5xl mb-4">📍</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Visit Us</h3>
              <p className="text-gray-600 mb-4">Come by our office</p>
              <p className="text-pink-600 hover:text-pink-700 font-semibold">
                Imadol, Lalitpur<br/>Nepal
              </p>
            </div>
          </div>

          {/* Contact Form Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Contact Form */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-8 border-l-4 border-blue-500">
              <h2 className="text-3xl font-bold text-slate-900 mb-8">Send us a Message</h2>

              {submitted && (
                <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center space-x-3 animate-pulse">
                  <span className="text-2xl">✓</span>
                  <span>Thank you for your message! We'll get back to you soon.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Input */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                  />
                </div>

                {/* Email Input */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Your Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                  />
                </div>

                {/* Subject Input */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="What is this about?"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                  />
                </div>

                {/* Message Textarea */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    placeholder="Tell us more about your inquiry..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 resize-none"
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '⏳ Sending...' : '📤 Send Message'}
                </button>
              </form>
            </div>

            {/* Why Contact Us? */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg shadow-lg p-8 border-l-4 border-purple-500">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center space-x-2">
                <span>💬</span>
                <span>Why Contact Us?</span>
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <span className="text-blue-600 font-bold mt-1">✓</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">Support & Help</h4>
                    <p className="text-gray-600 text-sm">Get assistance with bookings and tours</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-purple-600 font-bold mt-1">✓</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">Partnerships</h4>
                    <p className="text-gray-600 text-sm">Explore vendor opportunities</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-pink-600 font-bold mt-1">✓</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">Feedback</h4>
                    <p className="text-gray-600 text-sm">Share your experience with us</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-green-600 font-bold mt-1">✓</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">Special Requests</h4>
                    <p className="text-gray-600 text-sm">Custom travel packages</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Response Time Info */}
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6 text-center">
            <p className="text-gray-700">
              <span className="font-semibold">⏱️ Response Time:</span> We typically respond to all inquiries within 24 hours during business days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
