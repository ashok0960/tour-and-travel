import React, { useState, useEffect } from 'react';
import { accountsAPI } from '../services/api';
import toast from 'react-hot-toast';

const ROLE_COLORS = {
  admin: 'bg-red-100 text-red-800',
  vendor: 'bg-purple-100 text-purple-800',
  user: 'bg-blue-100 text-blue-800',
};

const AdminUsers = ({ currentUser }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await accountsAPI.getAllUsers();
      setUsers(res.data);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    if (userId === currentUser.id) { toast.error("You can't change your own role"); return; }
    setUpdatingId(userId);
    try {
      const res = await accountsAPI.updateUserRole(userId, newRole);
      setUsers(prev => prev.map(u => u.id === userId ? res.data : u));
      toast.success(`Role updated to ${newRole}`);
    } catch {
      toast.error('Failed to update role');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    setDeletingId(userId);
    try {
      await accountsAPI.deleteUser(userId);
      setUsers(prev => prev.filter(u => u.id !== userId));
      toast.success('User deleted');
    } catch {
      toast.error('Failed to delete user');
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = users.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    vendors: users.filter(u => u.role === 'vendor').length,
    regularUsers: users.filter(u => u.role === 'user').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-1">Manage Users</h1>
          <p className="text-gray-500">Promote users to vendor or admin roles</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Users', value: stats.total, color: 'bg-blue-50 text-blue-700' },
            { label: 'Admins', value: stats.admins, color: 'bg-red-50 text-red-700' },
            { label: 'Vendors', value: stats.vendors, color: 'bg-purple-50 text-purple-700' },
            { label: 'Regular Users', value: stats.regularUsers, color: 'bg-green-50 text-green-700' },
          ].map(s => (
            <div key={s.label} className={`rounded-lg shadow p-4 text-center ${s.color}`}>
              <p className="text-3xl font-bold">{s.value}</p>
              <p className="text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="relative">
            <svg className="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by username or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['#', 'Username', 'Email', 'Current Role', 'Change Role'].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-500">{u.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                          {u.username[0].toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-900">{u.username}</span>
                        {u.id === currentUser.id && (
                          <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">You</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${ROLE_COLORS[u.role] || 'bg-gray-100 text-gray-800'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {u.id === currentUser.id ? (
                        <span className="text-xs text-gray-400 italic">Cannot change own role</span>
                      ) : (
                        <div className="flex gap-2">
                          {['user', 'vendor', 'admin'].filter(r => r !== u.role).map(role => (
                            <button
                              key={role}
                              onClick={() => handleRoleChange(u.id, role)}
                              disabled={updatingId === u.id}
                              className={`px-3 py-1 text-xs rounded-lg font-medium transition disabled:opacity-50 ${
                                role === 'vendor' ? 'bg-purple-600 text-white hover:bg-purple-700' :
                                role === 'admin' ? 'bg-red-600 text-white hover:bg-red-700' :
                                'bg-gray-500 text-white hover:bg-gray-600'
                              }`}
                            >
                              {updatingId === u.id ? '...' : `Make ${role}`}
                            </button>
                          ))}
                          <button
                            onClick={() => handleDelete(u.id)}
                            disabled={deletingId === u.id}
                            className="px-3 py-1 text-xs rounded-lg font-medium bg-red-100 text-red-700 hover:bg-red-600 hover:text-white transition disabled:opacity-50"
                          >
                            {deletingId === u.id ? '...' : 'Delete'}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No users found matching "{search}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
