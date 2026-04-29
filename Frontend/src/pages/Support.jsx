import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supportAPI } from '../services/api';
import toast from 'react-hot-toast';

const STATUS_COLOR = {
  open: 'bg-yellow-100 text-yellow-700',
  in_progress: 'bg-blue-100 text-blue-700',
  resolved: 'bg-green-100 text-green-700',
};

const Support = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState('new');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [recipientRole, setRecipientRole] = useState('vendor');
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [ticketsLoading, setTicketsLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const loadTickets = async () => {
    setTicketsLoading(true);
    try {
      const res = await supportAPI.getMyTickets();
      setTickets(res.data);
    } catch {
      toast.error('Failed to load Support Tickets');
    } finally {
      setTicketsLoading(false);
    }
  };

  useEffect(() => {
    if (tab === 'history') loadTickets();
  }, [tab]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await supportAPI.createTicket({ subject, message, recipient_role: recipientRole });
      toast.success('Support ticket submitted!');
      setSubject('');
      setMessage('');
      setTab('history');
      loadTickets();
    } catch {
      toast.error('Failed to submit ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white py-16 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <span className="text-5xl">🎧</span>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold">Support Center</h1>
                <p className="text-blue-200 mt-2">Get help from our support team</p>
              </div>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-300 font-semibold flex items-center space-x-2"
            >
              <span>←</span>
              <span>Back</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-gray-100 bg-gray-50">
              {['new', 'history'].map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`flex-1 py-4 text-sm font-semibold transition ${tab === t ? 'border-b-4 border-blue-600 text-blue-600 bg-white' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {t === 'new' ? '✍️ Submit ' : '📋 Response History'}
                </button>
              ))}
            </div>

            <div className="p-8">
              {tab === 'new' ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Contact Type
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setRecipientRole('vendor')}
                        className={`flex-1 py-3 rounded-lg text-sm font-semibold border-2 transition ${recipientRole === 'vendor' ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300'}`}
                      >
                        🏪 Vendor Support
                      </button>
                     
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={e => setSubject(e.target.value)}
                      required
                      placeholder="Brief description of your issue"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      required
                      rows={5}
                      placeholder="Describe your issue in detail..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold hover:opacity-90 transition disabled:opacity-60"
                  >
                    {loading ? '⏳ Submitting...' : '📤 Submit '}
                  </button>
                </form>
              ) : (
                <div className="space-y-4">
                  {ticketsLoading ? (
                    <div className="text-center py-12 text-gray-400">
                      <div className="text-4xl mb-2">⏳</div>
                      <p>Loading tickets...</p>
                    </div>
                  ) : tickets.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-5xl mb-3">📭</div>
                      <p className="text-gray-600 text-lg font-semibold">No Problem yet</p>
                      <p className="text-gray-400 mt-1">Submit your first problem </p>
                    </div>
                  ) : (
                    tickets.map(t => (
                      <div key={t.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-shadow duration-300">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800 text-base mb-1">{t.subject}</p>
                            <p className="text-xs text-gray-500 flex items-center space-x-2">
                              <span>📅 {new Date(t.created_at).toLocaleDateString()}</span>
                              <span>🕐 {new Date(t.created_at).toLocaleTimeString()}</span>
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-3 py-1 rounded-full font-semibold ${STATUS_COLOR[t.status] || 'bg-gray-100 text-gray-600'}`}>
                              {t.status === 'open' ? '🔴 Open' : t.status === 'in_progress' ? '🟡 In Progress' : '🟢 Resolved'}
                            </span>
                            <button
                              onClick={async () => {
                                if (!window.confirm('Delete this ticket?')) return;
                                try {
                                  await supportAPI.deleteTicket(t.id);
                                  toast.success('Ticket deleted');
                                  loadTickets();
                                } catch {
                                  toast.error('Failed to delete ticket');
                                }
                              }}
                              className="text-red-400 hover:text-red-600 text-lg transition hover:scale-110"
                              title="Delete ticket"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 mb-3 line-clamp-3">{t.message}</p>
                        {t.response && (
                          <div className="mt-4 bg-green-50 border-l-4 border-green-500 rounded-lg p-4">
                            <p className="text-sm font-bold text-green-700 mb-2 flex items-center space-x-2">
                              <span>✅</span>
                              <span>Support Response</span>
                            </p>
                            <p className="text-sm text-green-800">{t.response}</p>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
              <div className="text-4xl mb-3">📞</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Call Us</h3>
              <p className="text-gray-600 text-sm">9810549380</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
              <div className="text-4xl mb-3">📧</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Us</h3>
              <p className="text-gray-600 text-sm">ashokkumarkarki5@gmail.com</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
              <div className="text-4xl mb-3">⏱️</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Response Time</h3>
              <p className="text-gray-600 text-sm">Usually within 24 hours</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
