import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const getPasswordStrength = (pwd) => {
    if (!pwd) return null;
    if (pwd.length < 6) return { label: 'Too short', color: 'bg-red-400', width: 'w-1/4' };
    if (pwd.length < 8) return { label: 'Weak', color: 'bg-orange-400', width: 'w-2/4' };
    if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) return { label: 'Strong', color: 'bg-green-500', width: 'w-full' };
    return { label: 'Medium', color: 'bg-yellow-400', width: 'w-3/4' };
  };

  const getErrorMessage = (error) => {
    const d = error.response?.data;
    if (!d) return 'Registration failed. Check your connection.';
    if (typeof d === 'string') return d;
    return d.detail || d.message || Object.values(d).flat()[0] || 'Registration failed';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email.toLowerCase().endsWith('@gmail.com')) {
      toast.error('Only @gmail.com email addresses are allowed');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    try {
      await authAPI.register({ username: formData.username, email: formData.email, password: formData.password });
      toast.success('Account created! Please sign in.');
      navigate('/login');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const strength = getPasswordStrength(formData.password);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex">

        {/* Left panel */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-purple-600 to-blue-600 text-white flex-col justify-center items-center p-12">
          <div className="text-6xl mb-6">🌍</div>
          <h2 className="text-3xl font-extrabold mb-3 text-center">Join TravelHub</h2>
          <p className="text-purple-100 text-center leading-relaxed">
            Create your free account and start exploring the world's most amazing destinations.
          </p>
          <div className="mt-10 space-y-3 w-full">
            {['✅ Free to join', '🔒 Secure & private', '🎁 Exclusive member deals'].map(t => (
              <div key={t} className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-2 text-sm">
                {t}
              </div>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-gray-800">Create Account</h2>
            <p className="text-gray-500 mt-1">Fill in the details to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                autoComplete="username"
                placeholder="Choose a username"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
                placeholder="your@gmail.com"
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50 transition ${
                  formData.email && !formData.email.toLowerCase().endsWith('@gmail.com')
                    ? 'border-red-400' : 'border-gray-200'
                }`}
              />
              {formData.email && !formData.email.toLowerCase().endsWith('@gmail.com') && (
                <p className="text-xs text-red-500 mt-1">Email is not valid. Only @gmail.com is allowed.</p>
              )}
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
                  autoComplete="new-password"
                  placeholder="Min. 8 characters"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50 pr-12 transition"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xl" tabIndex={-1}>
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {strength && (
                <div className="mt-2">
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.width}`} />
                  </div>
                  <p className={`text-xs mt-1 font-medium ${
                    strength.label === 'Strong' ? 'text-green-600' :
                    strength.label === 'Medium' ? 'text-yellow-600' : 'text-red-500'
                  }`}>{strength.label}</p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                  placeholder="Repeat your password"
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50 pr-12 transition ${
                    formData.confirmPassword && formData.password !== formData.confirmPassword
                      ? 'border-red-400' : 'border-gray-200'
                  }`}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xl" tabIndex={-1}>
                  {showConfirm ? '🙈' : '👁️'}
                </button>
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">Passwords don't match</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-bold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-md mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-500 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
