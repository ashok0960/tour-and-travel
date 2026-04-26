import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-3xl">✈️</span>
              <h3 className="text-2xl font-bold">Mystic Path Travel Co.</h3>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Your trusted partner for unforgettable travel experiences around the world. 
              We offer the best tour packages at competitive prices.
            </p>
            <div className="flex space-x-4 pt-2">
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors duration-300"
                aria-label="Facebook"
              >
                <span className="text-xl">📘</span>
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-400 transition-colors duration-300"
                aria-label="Twitter"
              >
                <span className="text-xl">🐦</span>
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors duration-300"
                aria-label="Instagram"
              >
                <span className="text-xl">📷</span>
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors duration-300"
                aria-label="LinkedIn"
              >
                <span className="text-xl">💼</span>
              </a>
            </div>
          </div>

          {/* Quick Links Section */}
          <div>
            <h4 className="text-lg font-semibold mb-4 relative">
              Quick Links
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-blue-500 mt-2"></span>
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">
                  🏠 Home
                </Link>
              </li>
              <li>
                <Link to="/tours" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">
                  🏝️ All Tours
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">
                  📊 Dashboard
                </Link>
              </li>
              <li>
                <Link to="/my-bookings" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">
                  📅 My Bookings
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h4 className="text-lg font-semibold mb-4 relative">
              Support
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-blue-500 mt-2"></span>
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">
                  ❓ Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">
                  📧 Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">
                  📖 FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">
                  ⚖️ Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">
                  🔒 Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter Section */}
          <div>
            <h4 className="text-lg font-semibold mb-4 relative">
              Stay Updated
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-blue-500 mt-2"></span>
            </h4>
            <p className="text-gray-300 mb-4 text-sm">
              Subscribe to our newsletter for exclusive deals and travel tips!
            </p>
            <form className="space-y-3">
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email address"
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:border-blue-500 text-white text-sm"
                />
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-r-lg transition-colors duration-300"
                >
                  Subscribe
                </button>
              </div>
            </form>
            <div className="mt-6 space-y-2">
              <p className="text-gray-300 text-sm flex items-center">
                <span className="mr-2">📞</span> 9810549380
              </p>
              <p className="text-gray-300 text-sm flex items-center">
                <span className="mr-2">✉️</span>ashokkumarkarki5@gmail.com
              </p>
              <p className="text-gray-300 text-sm flex items-center">
                <span className="mr-2">📍</span> 123 Travel Street, Adventure City
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {currentYear} Mystic Path Travel Co.. All rights reserved. Made with 
              <span className="text-red-500 mx-1">❤️</span> 
              for travelers around the world.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Use
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;