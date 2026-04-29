import React, { useState } from 'react';

const FAQ = () => {
  const [expanded, setExpanded] = useState(null);

  const faqs = [
    {
      id: 1,
      question: "How do I book a tour?",
      answer: "To book a tour, browse our available tours on the website, select your preferred tour, fill in the required details, and proceed to payment. You'll receive a confirmation email with all booking details."
    },
    {
      id: 2,
      question: "What is your cancellation policy?",
      answer: "Cancellations made 7 or more days before the tour date receive a full refund. Cancellations within 7 days of the tour date are subject to a 50% cancellation fee. Some tours may have different policies."
    },
    {
      id: 3,
      question: "What payment methods do you accept?",
      answer: "We accept multiple payment methods including credit cards (Visa, MasterCard, American Express), digital wallets, and Khalti payment gateway. All transactions are secured with SSL encryption."
    },
    {
      id: 4,
      question: "Can I modify my booking after confirmation?",
      answer: "Yes, you can modify your booking up to 7 days before the tour date. Log into your account, go to 'My Bookings,' and select the tour you wish to modify. Changes may be subject to availability."
    },
    {
      id: 5,
      question: "Do you offer group discounts?",
      answer: "Yes! We offer special discounts for groups of 10 or more people. Contact our sales team at ashokkumarkarki5@gmail.com or call 9810549380 for group booking inquiries."
    },
    {
      id: 6,
      question: "What is included in the tour packages?",
      answer: "Tour inclusions vary depending on the package selected. Each tour listing clearly shows what's included (accommodation, meals, transportation, activities, etc.) and what's not included."
    },
    {
      id: 7,
      question: "Do I need a visa for my destination?",
      answer: "Visa requirements vary by destination and your nationality. We recommend checking with the embassy or consulate of your destination country. We can provide guidance, but you are responsible for obtaining all necessary documents."
    },
    {
      id: 8,
      question: "What should I do if I experience issues during my tour?",
      answer: "Contact our 24/7 support team immediately. You can reach us via email at ashokkumarkarki5@gmail.com or call 9810549380. We'll assist you promptly."
    },
    {
      id: 9,
      question: "Are travel insurance included in the packages?",
      answer: "Travel insurance is not automatically included. We recommend purchasing travel insurance separately. We can provide information about recommended insurance providers."
    },
    {
      id: 10,
      question: "Can I get a refund if I'm not satisfied?",
      answer: "Our refund policy depends on the specific tour and when the request is made. Generally, refunds are provided as per our cancellation policy. For disputes, contact our support team."
    }
  ];

  const toggleExpanded = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white py-16 px-4">
        <div className="container mx-auto">
          <div className="flex items-center space-x-4 mb-6">
            <span className="text-5xl">❓</span>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold">Frequently Asked Questions</h1>
              <p className="text-blue-200 mt-2">Find answers to common questions about our services</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Search Info */}
          <div className="mb-12 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-gray-700 text-center">
              <span className="font-semibold">💡 Tip:</span> Use Ctrl+F (or Cmd+F on Mac) to search for specific keywords on this page.
            </p>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border-l-4 border-blue-500"
              >
                <button
                  onClick={() => toggleExpanded(faq.id)}
                  className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-300"
                >
                  <div className="flex items-start space-x-4 flex-1">
                    <span className="text-2xl font-bold text-blue-600 flex-shrink-0 pt-1">
                      {faq.id.toString().padStart(2, '0')}
                    </span>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {faq.question}
                    </h3>
                  </div>
                  <span className={`text-2xl text-blue-600 flex-shrink-0 transition-transform duration-300 ${
                    expanded === faq.id ? 'rotate-180' : ''
                  }`}>
                    ▼
                  </span>
                </button>

                {/* Expanded Answer */}
                {expanded === faq.id && (
                  <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 animate-in fade-in slide-in-from-top-2 duration-300">
                    <p className="text-gray-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Still Have Questions Section */}
          <div className="mt-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 text-white shadow-lg text-center">
            <h3 className="text-3xl font-bold mb-4 flex items-center justify-center space-x-2">
              <span>🤔</span>
              <span>Still Have Questions?</span>
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Can't find the answer you're looking for? Please contact our support team. We're here to help!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-colors duration-300"
              >
                📧 Contact Us
              </a>
              <a
                href="mailto:ashokkumarkarki5@gmail.com"
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors duration-300"
              >
                ✉️ Email Support
              </a>
            </div>
          </div>

          {/* Categories Section */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
              <div className="text-4xl mb-3">🎫</div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Bookings</h4>
              <p className="text-gray-600 text-sm">Questions about booking tours and reservations</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
              <div className="text-4xl mb-3">💳</div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Payments</h4>
              <p className="text-gray-600 text-sm">Information about payment methods and refunds</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
              <div className="text-4xl mb-3">🛡️</div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Safety</h4>
              <p className="text-gray-600 text-sm">Travel safety tips and travel insurance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
