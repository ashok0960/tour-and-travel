import React, { useState } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const Profile = ({ user, setUser }) => {
  const [tab, setTab] = useState('info');
  const [info, setInfo] = useState({ username: user?.username || '', email: user?.email || '' });
  const [pass, setPass] = useState({ current_password: '', password: '', confirm_password: '' });
  const [loading, setLoading] = useState(false);

  const roleColor = user?.role === 'vendor' ? 'from-purple-600 to-indigo-600' : 'from-blue-600 to-purple-600';
  const roleLabel = user?.role === 'vendor' ? '🏪 Vendor' : '👤 User';

  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authAPI.updateProfile({ username: info.username, email: info.email });
      setUser(res.data);
      toast.success('Profile updated successfully!');
    } catch (err) {
      const d = err.response?.data;
      toast.error(d?.email?.[0] || d?.username?.[0] || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePassSubmit = async (e) => {
    e.preventDefault();
    if (pass.password !== pass.confirm_password) {
      toast.error('New passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await authAPI.updateProfile({
        current_password: pass.current_password,
        password: pass.password,
      });
      toast.success('Password changed successfully!');
      setPass({ current_password: '', password: '', confirm_password: '' });
    } catch (err) {
      const d = err.response?.data;
      toast.error(d?.current_password?.[0] || d?.non_field_errors?.[0] || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = 'w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-xl">

        {/* Avatar Header */}
        <div className={`bg-gradient-to-r ${roleColor} rounded-2xl text-white p-8 mb-6 text-center`}>
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl font-bold">
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <h1 className="text-2xl font-extrabold">{user?.username}</h1>
          <p className="text-white/70 text-sm mt-1">{user?.email}</p>
          <span className="inline-block mt-2 bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">{roleLabel}</span>
        </div>

        {/* Tabs */}
        <div className="flex bg-white rounded-2xl shadow-sm mb-4 p-1">
          {[{ key: 'info', label: '👤 Profile Info' }, { key: 'password', label: '🔒 Change Password' }].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition ${tab === t.key ? 'bg-blue-600 text-white shadow' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Profile Info Tab */}
        {tab === 'info' && (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-5">Update Profile</h2>
            <form onSubmit={handleInfoSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  value={info.username}
                  onChange={e => setInfo({ ...info, username: e.target.value })}
                  required
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={info.email}
                  onChange={e => setInfo({ ...info, email: e.target.value })}
                  required
                  className={inputCls}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:opacity-90 transition disabled:opacity-60"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        )}

        {/* Change Password Tab */}
        {tab === 'password' && (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-5">Change Password</h2>
            <form onSubmit={handlePassSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Current Password</label>
                <input
                  type="password"
                  value={pass.current_password}
                  onChange={e => setPass({ ...pass, current_password: e.target.value })}
                  required
                  placeholder="Enter current password"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  value={pass.password}
                  onChange={e => setPass({ ...pass, password: e.target.value })}
                  required
                  placeholder="Min 8 characters"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={pass.confirm_password}
                  onChange={e => setPass({ ...pass, confirm_password: e.target.value })}
                  required
                  placeholder="Repeat new password"
                  className={inputCls}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold hover:opacity-90 transition disabled:opacity-60"
              >
                {loading ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};

export default Profile;
