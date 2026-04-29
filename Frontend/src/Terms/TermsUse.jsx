import React from 'react';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white py-16 px-4">
        <div className="container mx-auto">
          <div className="flex items-center space-x-4 mb-6">
            <span className="text-5xl">⚖️</span>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold">Terms of Service</h1>
              <p className="text-blue-200 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
          <p className="text-gray-300 max-w-3xl">
            Please read these terms carefully before using our service. By accessing and using Mystic Path Travel Co., you accept and agree to be bound by the terms and provision of this agreement.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* 1. Service Description */}
          <section className="bg-white rounded-lg shadow-lg p-8 mb-8 border-l-4 border-blue-500 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center space-x-2">
              <span className="text-blue-600">1.</span>
              <span>Service Description</span>
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Mystic Path Travel Co. provides online tour booking and travel planning services. Our platform allows users to browse, compare, and book travel packages offered by our vendor partners.
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start space-x-3">
                <span className="text-blue-500 font-bold">•</span>
                <span>View and search available tours and destinations</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-blue-500 font-bold">•</span>
                <span>Book tours through our secure payment system</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-blue-500 font-bold">•</span>
                <span>Manage bookings and access tour information</span>
              </li>
            </ul>
          </section>

          {/* 2. User Accounts */}
          <section className="bg-white rounded-lg shadow-lg p-8 mb-8 border-l-4 border-purple-500 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center space-x-2">
              <span className="text-purple-600">2.</span>
              <span>User Accounts</span>
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              When you create an account with us, you are responsible for:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start space-x-3">
                <span className="text-purple-500 font-bold">•</span>
                <span>Providing accurate and complete information during registration</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-purple-500 font-bold">•</span>
                <span>Maintaining the confidentiality of your password</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-purple-500 font-bold">•</span>
                <span>All activities that occur under your account</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-purple-500 font-bold">•</span>
                <span>Notifying us immediately of any unauthorized use</span>
              </li>
            </ul>
          </section>

          {/* 3. Bookings and Payments */}
          <section className="bg-white rounded-lg shadow-lg p-8 mb-8 border-l-4 border-green-500 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center space-x-2">
              <span className="text-green-600">3.</span>
              <span>Bookings and Payments</span>
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              All bookings made through our platform are subject to the following:
            </p>
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Payment Terms:</h3>
                <p className="text-gray-700">Payment must be received in full before tour confirmation. We accept various payment methods including credit cards and digital wallets.</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Cancellation Policy:</h3>
                <p className="text-gray-700">Cancellations must be made at least 7 days before the tour date for a full refund. Cancellations within 7 days may be subject to a cancellation fee.</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Confirmation:</h3>
                <p className="text-gray-700">You will receive a confirmation email immediately after successful payment.</p>
              </div>
            </div>
          </section>

          {/* 4. User Conduct */}
          <section className="bg-white rounded-lg shadow-lg p-8 mb-8 border-l-4 border-orange-500 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center space-x-2">
              <span className="text-orange-600">4.</span>
              <span>User Conduct</span>
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You agree not to engage in any of the following prohibited activities:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start space-x-3">
                <span className="text-orange-500 font-bold">✕</span>
                <span>Harassing or causing distress or inconvenience to any person</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-orange-500 font-bold">✕</span>
                <span>Impersonating any person or entity</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-orange-500 font-bold">✕</span>
                <span>Posting offensive, inappropriate, or threatening content</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-orange-500 font-bold">✕</span>
                <span>Attempting to gain unauthorized access to our systems</span>
              </li>
            </ul>
          </section>

          {/* 5. Liability Disclaimer */}
          <section className="bg-white rounded-lg shadow-lg p-8 mb-8 border-l-4 border-red-500 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center space-x-2">
              <span className="text-red-600">5.</span>
              <span>Liability Disclaimer</span>
            </h2>
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <p className="text-gray-700 leading-relaxed mb-3">
                Our services are provided on an "as is" and "as available" basis. We do not warrant that:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start space-x-3">
                  <span className="text-red-500 font-bold">•</span>
                  <span>The service will meet your specific requirements</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-red-500 font-bold">•</span>
                  <span>The service will be uninterrupted or error-free</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-red-500 font-bold">•</span>
                  <span>Any defects will be corrected</span>
                </li>
              </ul>
            </div>
          </section>

          {/* 6. Changes to Terms */}
          <section className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-indigo-500 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center space-x-2">
              <span className="text-indigo-600">6.</span>
              <span>Changes to Terms</span>
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to the website. Your continued use of the service following the posting of modified terms constitutes your acceptance of the changes.
            </p>
          </section>

          {/* Contact Section */}
          <div className="mt-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 text-white shadow-lg">
            <h3 className="text-2xl font-bold mb-4 flex items-center space-x-2">
              <span>✉️</span>
              <span>Have Questions?</span>
            </h3>
            <p className="mb-4">If you have any questions about these Terms of Service, please contact us:</p>
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

export default TermsOfService;
