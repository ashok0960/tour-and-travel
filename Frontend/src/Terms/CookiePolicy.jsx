import React from 'react';

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white py-16 px-4">
        <div className="container mx-auto">
          <div className="flex items-center space-x-4 mb-6">
            <span className="text-5xl">🍪</span>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold">Cookie Policy</h1>
              <p className="text-blue-200 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
          <p className="text-gray-300 max-w-3xl">
            This Cookie Policy explains how Mystic Path Travel Co. uses cookies and similar technologies on our website.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* 1. What are Cookies */}
          <section className="bg-white rounded-lg shadow-lg p-8 mb-8 border-l-4 border-blue-500 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center space-x-2">
              <span className="text-blue-600">1.</span>
              <span>What Are Cookies?</span>
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Cookies are small text files that are placed on your device (computer, tablet, or smartphone) when you visit our website. They are widely used to make websites work more efficiently and provide a better browsing experience.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-gray-700">
                Cookies allow us to recognize you, remember your preferences, and understand how you use our website. This helps us improve our services and provide you with a personalized experience.
              </p>
            </div>
          </section>

          {/* 2. Types of Cookies We Use */}
          <section className="bg-white rounded-lg shadow-lg p-8 mb-8 border-l-4 border-purple-500 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center space-x-2">
              <span className="text-purple-600">2.</span>
              <span>Types of Cookies We Use</span>
            </h2>

            <div className="space-y-5">
              {/* Essential Cookies */}
              <div className="bg-purple-50 p-5 rounded-lg border-l-4 border-purple-400">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                  <span>🔒</span>
                  <span>Essential Cookies</span>
                </h3>
                <p className="text-gray-700 text-sm">
                  These cookies are necessary for the website to function properly. They include security cookies, session cookies, and load balancing cookies. Essential cookies cannot be disabled.
                </p>
              </div>

              {/* Performance Cookies */}
              <div className="bg-blue-50 p-5 rounded-lg border-l-4 border-blue-400">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                  <span>📊</span>
                  <span>Performance Cookies</span>
                </h3>
                <p className="text-gray-700 text-sm">
                  These cookies help us understand how visitors use our website by collecting information about pages visited, errors encountered, and time spent on each page. This helps us optimize our website performance.
                </p>
              </div>

              {/* Functional Cookies */}
              <div className="bg-green-50 p-5 rounded-lg border-l-4 border-green-400">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                  <span>⚙️</span>
                  <span>Functional Cookies</span>
                </h3>
                <p className="text-gray-700 text-sm">
                  These cookies enable us to remember your preferences (language, currency, etc.) and settings, allowing us to provide a personalized experience tailored to your needs.
                </p>
              </div>

              {/* Marketing Cookies */}
              <div className="bg-pink-50 p-5 rounded-lg border-l-4 border-pink-400">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                  <span>📢</span>
                  <span>Marketing Cookies</span>
                </h3>
                <p className="text-gray-700 text-sm">
                  These cookies track your online activity to help us display targeted advertisements and measure the effectiveness of our marketing campaigns. You can opt out of these cookies.
                </p>
              </div>

              {/* Social Media Cookies */}
              <div className="bg-yellow-50 p-5 rounded-lg border-l-4 border-yellow-400">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                  <span>👥</span>
                  <span>Social Media Cookies</span>
                </h3>
                <p className="text-gray-700 text-sm">
                  These cookies are set by social media platforms if you interact with our content through social buttons. They allow social networks to track your browsing activity.
                </p>
              </div>
            </div>
          </section>

          {/* 3. Controlling Cookies */}
          <section className="bg-white rounded-lg shadow-lg p-8 mb-8 border-l-4 border-green-500 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center space-x-2">
              <span className="text-green-600">3.</span>
              <span>How to Control Cookies</span>
            </h2>
            <p className="text-gray-700 leading-relaxed mb-5">
              Most web browsers allow you to control cookies through their settings. Here's how:
            </p>
            <div className="space-y-4">
              {[
                { browser: 'Chrome', steps: 'Settings → Privacy and Security → Cookies and other site data' },
                { browser: 'Firefox', steps: 'Options → Privacy & Security → Cookies and Site Data' },
                { browser: 'Safari', steps: 'Preferences → Privacy → Cookies and website data' },
                { browser: 'Edge', steps: 'Settings → Privacy, search and services → Cookies and other site data' }
              ].map((item) => (
                <div key={item.browser} className="bg-green-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-900">{item.browser}</p>
                  <p className="text-gray-700 text-sm">{item.steps}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-gray-700 text-sm">
                <span className="font-semibold">⚠️ Note:</span> Disabling essential cookies may affect the functionality of our website.
              </p>
            </div>
          </section>

          {/* 4. Third-Party Cookies */}
          <section className="bg-white rounded-lg shadow-lg p-8 mb-8 border-l-4 border-orange-500 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center space-x-2">
              <span className="text-orange-600">4.</span>
              <span>Third-Party Cookies</span>
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              In addition to our own cookies, we allow third parties to place cookies on our website:
            </p>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 bg-orange-50 p-4 rounded-lg">
                <span className="text-orange-600 font-bold mt-1">•</span>
                <div>
                  <p className="font-semibold text-gray-900">Google Analytics</p>
                  <p className="text-gray-700 text-sm">Analyzes website traffic and user behavior</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 bg-orange-50 p-4 rounded-lg">
                <span className="text-orange-600 font-bold mt-1">•</span>
                <div>
                  <p className="font-semibold text-gray-900">Payment Processors</p>
                  <p className="text-gray-700 text-sm">Process and secure payment transactions</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 bg-orange-50 p-4 rounded-lg">
                <span className="text-orange-600 font-bold mt-1">•</span>
                <div>
                  <p className="font-semibold text-gray-900">Social Media Platforms</p>
                  <p className="text-gray-700 text-sm">Enable social sharing and tracking</p>
                </div>
              </div>
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
                <span className="text-red-500 font-bold">✓</span>
                <span>Know what cookies are being used on our website</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-red-500 font-bold">✓</span>
                <span>Control which cookies are set on your device</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-red-500 font-bold">✓</span>
                <span>Withdraw your consent at any time</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-red-500 font-bold">✓</span>
                <span>Delete cookies stored on your device</span>
              </li>
            </ul>
          </section>

          {/* 6. Changes to Policy */}
          <section className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-indigo-500 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center space-x-2">
              <span className="text-indigo-600">6.</span>
              <span>Changes to This Policy</span>
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Cookie Policy from time to time. Changes will be posted on this page with an updated "Last updated" date. Continued use of our website constitutes acceptance of any changes.
            </p>
          </section>

          {/* Contact Section */}
          <div className="mt-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 text-white shadow-lg">
            <h3 className="text-2xl font-bold mb-4 flex items-center space-x-2">
              <span>📞</span>
              <span>Questions About Cookies?</span>
            </h3>
            <p className="mb-4">If you have any questions about our use of cookies, please contact us:</p>
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

export default CookiePolicy;
