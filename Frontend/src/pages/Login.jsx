import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const Login = ({ setUser }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const getErrorMessage = (error) => {
    const d = error.response?.data;
    if (!d) return 'Login failed. Check your connection.';
    if (typeof d === 'string') return d;
    return d.detail || d.error || Object.values(d).flat()[0] || 'Login failed';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authAPI.login(formData);
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      // Always fetch fresh profile so role changes are reflected immediately
      const profileRes = await authAPI.getProfile();
      const freshUser = profileRes.data;
      setUser(freshUser);
      toast.success(`Welcome back, ${freshUser.username}! 👋`);
      const role = freshUser.role;
      navigate(role === 'admin' ? '/admin/dashboard' : role === 'vendor' ? '/vendor/dashboard' : '/tours');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex">

        {/* Left panel */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 text-white flex-col justify-center items-center p-12">
          <div className="text-6xl mb-6">✈️</div>
          <h2 className="text-3xl font-extrabold mb-3 text-center">Welcome Back!</h2>
          <p className="text-blue-100 text-center leading-relaxed">
            Sign in to manage your bookings, explore new destinations, and continue your journey.
          </p>
          <div className="mt-10 space-y-3 w-full">
            {['🏝️ Browse 500+ tours', '💳 Secure Stripe payments', '📅 Manage your bookings'].map(t => (
              <div key={t} className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-2 text-sm">
                {t}
              </div>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-gray-800">Sign In</h2>
            <p className="text-gray-500 mt-1">Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Username or Email</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                autoComplete="username"
                placeholder="Enter your username or email"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 pr-12 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xl"
                  tabIndex={-1}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-md"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-500 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 font-semibold hover:underline">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
