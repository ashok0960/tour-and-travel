import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white py-16 px-4">
        <div className="container mx-auto">
          <div className="flex items-center space-x-4 mb-6">
            <span className="text-5xl">🔒</span>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold">Privacy Policy</h1>
              <p className="text-blue-200 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
          <p className="text-gray-300 max-w-3xl">
            We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and protect your personal information.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* 1. Information We Collect */}
          <section className="bg-white rounded-lg shadow-lg p-8 mb-8 border-l-4 border-blue-500 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center space-x-2">
              <span className="text-blue-600">1.</span>
              <span>Information We Collect</span>
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We collect information in various ways:
            </p>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">📝 Account Information:</h3>
                <p className="text-gray-700">Name, email address, phone number, date of birth, and address provided during registration.</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">💳 Payment Information:</h3>
                <p className="text-gray-700">Credit card details, billing address, and transaction history (processed securely through third-party providers).</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">🌐 Technical Information:</h3>
                <p className="text-gray-700">IP address, browser type, device type, and pages visited on our platform.</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">📊 Usage Information:</h3>
                <p className="text-gray-700">Search queries, tour preferences, and booking history.</p>
              </div>
            </div>
          </section>

          {/* 2. How We Use Your Information */}
          <section className="bg-white rounded-lg shadow-lg p-8 mb-8 border-l-4 border-purple-500 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center space-x-2">
              <span className="text-purple-600">2.</span>
              <span>How We Use Your Information</span>
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use your information for the following purposes:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start space-x-3">
                <span className="text-purple-500 font-bold">✓</span>
                <span>Processing and confirming your tour bookings</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-purple-500 font-bold">✓</span>
                <span>Sending booking confirmations and receipts</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-purple-500 font-bold">✓</span>
                <span>Providing customer support and responding to inquiries</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-purple-500 font-bold">✓</span>
                <span>Improving our services and user experience</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-purple-500 font-bold">✓</span>
                <span>Sending promotional emails and newsletters (with your consent)</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-purple-500 font-bold">✓</span>
                <span>Detecting and preventing fraud</span>
              </li>
            </ul>
          </section>

          {/* 3. Information Sharing */}
          <section className="bg-white rounded-lg shadow-lg p-8 mb-8 border-l-4 border-green-500 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center space-x-2">
              <span className="text-green-600">3.</span>
              <span>Information Sharing</span>
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We do not sell your personal information. We may share information with:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start space-x-3">
                <span className="text-green-500 font-bold">•</span>
                <span>Tour operators and vendors to fulfill your bookings</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-green-500 font-bold">•</span>
                <span>Payment processors for secure transaction processing</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-green-500 font-bold">•</span>
                <span>Law enforcement when required by law</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-green-500 font-bold">•</span>
                <span>Service providers who assist us in operating our platform</span>
              </li>
            </ul>
          </section>

          {/* 4. Data Security */}
          <section className="bg-white rounded-lg shadow-lg p-8 mb-8 border-l-4 border-orange-500 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center space-x-2">
              <span className="text-orange-600">4.</span>
              <span>Data Security</span>
            </h2>
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <p className="text-gray-700 leading-relaxed mb-3">
                We implement industry-standard security measures to protect your personal information:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start space-x-3">
                  <span className="text-orange-500 font-bold">🔐</span>
                  <span>SSL encryption for all data transmission</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-orange-500 font-bold">🔐</span>
                  <span>Secure password storage using industry-standard methods</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-orange-500 font-bold">🔐</span>
                  <span>Regular security audits and updates</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-orange-500 font-bold">🔐</span>
                  <span>Restricted access to personal information</span>
                </li>
              </ul>
            </div>
          </section>

          {/* 5. Your Rights */}
          <section className="bg-white rounded-lg shadow-lg p-8 mb-8 border-l-4 border-red-500 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center space-x-2">
              <span className="text-red-600">5.</span>
              <span>Your Rights</span>
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You have the right to:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start space-x-3">
                <span className="text-red-500 font-bold">👤</span>
                <span>Access the personal information we hold about you</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-red-500 font-bold">👤</span>
                <span>Request corrections to inaccurate information</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-red-500 font-bold">👤</span>
                <span>Request deletion of your account and personal data</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-red-500 font-bold">👤</span>
                <span>Opt out of promotional communications</span>
              </li>
            </ul>
          </section>

          {/* 6. Cookies */}
          <section className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-indigo-500 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center space-x-2">
              <span className="text-indigo-600">6.</span>
              <span>Cookies & Tracking</span>
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use cookies and similar tracking technologies to enhance your browsing experience. You can control cookie preferences through your browser settings.
            </p>
            <p className="text-gray-700">
              For more information, see our <a href="/cookie-policy" className="text-indigo-600 hover:text-indigo-700 font-semibold">Cookie Policy</a>.
            </p>
          </section>

          {/* Contact Section */}
          <div className="mt-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 text-white shadow-lg">
            <h3 className="text-2xl font-bold mb-4 flex items-center space-x-2">
              <span>📧</span>
              <span>Contact Us</span>
            </h3>
            <p className="mb-4">If you have questions about our Privacy Policy, please contact us:</p>
            <div className="space-y-2">
              <p><strong>Email:</strong> ashokkumarkarki5@gmail.com</p>
              <p><strong>Phone:</strong> 9810549380</p>
              <p><strong>Address:</strong> Imadol, Lalitpur</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
