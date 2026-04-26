import React, { useState, useEffect } from 'react';
import { supportAPI } from '../services/api';
import toast from 'react-hot-toast';

const STATUS_COLOR = {
  open: 'bg-yellow-100 text-yellow-700',
  in_progress: 'bg-blue-100 text-blue-700',
  resolved: 'bg-green-100 text-green-700',
};

const SupportModal = ({ onClose, role }) => {
  const [tab, setTab] = useState('new');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [recipientRole, setRecipientRole] = useState('vendor');
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [ticketsLoading, setTicketsLoading] = useState(false);

  const isVendor = role === 'vendor';

  const loadTickets = async () => {
    setTicketsLoading(true);
    try {
      const res = await supportAPI.getMyTickets();
      setTickets(res.data);
    } catch {
      toast.error('Failed to load Supports');
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
      await supportAPI.createTicket({ subject, message, recipient_role: isVendor ? 'admin' : recipientRole });
      toast.success('Support ticket submitted!');
      setSubject('');
      setMessage('');
      setTab('history');
    } catch {
      toast.error('Failed to submit ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">

        {/* Header */}
        <div className={`p-5 flex justify-between items-center ${isVendor ? 'bg-gradient-to-r from-purple-600 to-indigo-600' : 'bg-gradient-to-r from-blue-600 to-purple-600'}`}>
          <div>
            <h2 className="text-xl font-bold text-white">
              {isVendor ? '📩 Contact Admin' : '🎧 Contact Vendor Support'}
            </h2>
            <p className="text-white/70 text-sm mt-0.5">
              {isVendor ? 'Report issues to the admin team' : 'Get help with your bookings or tours'}
            </p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition">✕</button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          {['new', 'history'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-3 text-sm font-semibold transition ${tab === t ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {t === 'new' ? 'Problem' : '📋 Response'}
            </button>
          ))}
        </div>

        <div className="p-6">
          {tab === 'new' ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isVendor && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Contact</label>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setRecipientRole('vendor')} className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition ${recipientRole === 'vendor' ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300'}`}>🏪 Vendor</button>
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  required
                  placeholder="Brief description of your issue"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Message</label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  required
                  rows={4}
                  placeholder="Describe your issue in detail..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:opacity-90 transition disabled:opacity-60"
              >
                {loading ? 'Submitting...' : 'Submit Problem'}
              </button>
            </form>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {ticketsLoading ? (
                <div className="text-center py-8 text-gray-400">Loading...</div>
              ) : tickets.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">📭</div>
                  <p className="text-gray-400 text-sm">No any problem.</p>
                </div>
              ) : tickets.map(t => (
                <div key={t.id} className="border border-gray-100 rounded-xl p-4 hover:bg-gray-50 transition">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-semibold text-gray-800 text-sm">{t.subject}</p>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${STATUS_COLOR[t.status] || 'bg-gray-100 text-gray-600'}`}>
                        {t.status.replace('_', ' ')}
                      </span>
                      <button
                        onClick={async () => {
                          if (!window.confirm('Delete this ticket?')) return;
                          try {
                            await supportAPI.deleteTicket(t.id);
                            toast.success('Deleted successfully');
                            loadTickets();
                          } catch { toast.error('Failed to delete'); }
                        }}
                        className="text-red-400 hover:text-red-600 text-xs font-semibold transition"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{new Date(t.created_at).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-600 line-clamp-2">{t.message}</p>
                  {t.response && (
                    <div className="mt-3 bg-green-50 border border-green-100 rounded-lg p-3">
                      <p className="text-xs font-bold text-green-700 mb-1">✅ Response:</p>
                      <p className="text-sm text-green-800">{t.response}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupportModal;
