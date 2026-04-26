import React, { useState, useEffect } from 'react';
import { supportAPI } from '../services/api';
import toast from 'react-hot-toast';

const STATUS_COLOR = {
  open: 'bg-yellow-100 text-yellow-700',
  in_progress: 'bg-blue-100 text-blue-700',
  resolved: 'bg-green-100 text-green-700',
};

const AdminSupport = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [response, setResponse] = useState('');
  const [ticketStatus, setTicketStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadTickets = async () => {
    setLoading(true);
    try {
      const res = await supportAPI.getAllTickets(filter === 'all' ? '' : filter);
      setTickets(res.data);
    } catch {
      toast.error('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadTickets(); }, [filter]);

  const openTicket = (ticket) => {
    setSelected(ticket);
    setResponse(ticket.response || '');
    setTicketStatus(ticket.status);
  };

  const handleRespond = async () => {
    setSubmitting(true);
    try {
      await supportAPI.respondTicket(selected.id, { response, status: ticketStatus });
      toast.success('Response sent!');
      setSelected(null);
      loadTickets();
    } catch {
      toast.error('Failed to send response');
    } finally {
      setSubmitting(false);
    }
  };

  const FILTERS = [
    { key: 'all', label: 'All' },
    { key: 'user', label: '👤 From Users' },
    { key: 'vendor', label: '🏪 From Vendors' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-5xl">

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">🎧 Support </h1>
          <p className="text-gray-500 mt-1">Manage and respond to support requests</p>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-6">
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${filter === f.key ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
            >
              {f.label} {f.key !== 'all' && `(${tickets.filter(t => t.sender_role === f.key).length})`}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading...</div>
        ) : tickets.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-16 text-center">
            <div className="text-5xl mb-3">📭</div>
            <p className="text-gray-400">No problem found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tickets.map(t => (
              <div
                key={t.id}
                onClick={() => openTicket(t)}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 cursor-pointer hover:shadow-md hover:border-blue-200 transition"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm ${t.sender_role === 'vendor' ? 'bg-purple-500' : 'bg-blue-500'}`}>
                      {t.sender_username?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{t.subject}</p>
                      <p className="text-xs text-gray-500">
                        {t.sender_role === 'vendor' ? '🏪 Vendor' : '👤 User'} · {t.sender_username} · {new Date(t.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!t.response && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-semibold">Needs Reply</span>}
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${STATUS_COLOR[t.status]}`}>
                      {t.status.replace('_', ' ')}
                    </span>
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        if (!window.confirm('Delete this ticket?')) return;
                        try {
                          await supportAPI.deleteTicket(t.id);
                          toast.success('Deleted successfully');
                          loadTickets();
                        } catch { toast.error('Failed to delete'); }
                      }}
                      className="text-red-400 hover:text-red-600 text-sm transition"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2 line-clamp-1">{t.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Respond Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="p-5 border-b border-gray-100 flex justify-between items-start">
              <div>
                <h3 className="font-bold text-gray-800">{selected.subject}</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  From: {selected.sender_username} ({selected.sender_role}) · {new Date(selected.created_at).toLocaleDateString()}
                </p>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <div className="p-5 space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-bold text-gray-500 mb-1">MESSAGE</p>
                <p className="text-sm text-gray-700">{selected.message}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Your Response</label>
                <textarea
                  value={response}
                  onChange={e => setResponse(e.target.value)}
                  rows={4}
                  placeholder="Type your response..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                <select
                  value={ticketStatus}
                  onChange={e => setTicketStatus(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setSelected(null)} className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition text-sm">
                  Cancel
                </button>
                <button onClick={handleRespond} disabled={submitting || !response.trim()} className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition text-sm disabled:opacity-60">
                  {submitting ? 'Sending...' : 'Send Response'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSupport;
