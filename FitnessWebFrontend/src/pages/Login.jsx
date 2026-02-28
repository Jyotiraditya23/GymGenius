import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/authService';
import loginImage from '../assets/login.jpg';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      // After successful login → go to /profile
      navigate('/profile', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex overflow-hidden bg-black text-white">

      {/* LEFT SIDE */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-8">
        <div className="w-full max-w-md">

          <h1 className="text-4xl font-semibold mb-6">
            Smart Workout & Diet Planning
          </h1>

          <p className="text-gray-400 mb-8">
            Our platform intelligently tracks your workouts, monitors calorie intake,
            and generates AI-powered personalized diet plans.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">

            {error && (
              <div className="p-3 rounded-lg bg-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm mb-2 text-gray-300">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="yourmail@gmail.com"
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:border-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-gray-300">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter password"
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:border-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-white text-black font-semibold hover:bg-gray-200 transition disabled:opacity-50"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>

          </form>

          <p className="mt-6 text-gray-400">
            Don’t have an account?{' '}
            <Link
              to="/register"
              className="text-white font-medium hover:underline"
            >
              Register
            </Link>
          </p>

        </div>
      </div>

      {/* RIGHT SIDE IMAGE */}
      <div className="hidden md:flex md:w-1/2 h-full items-center justify-center p-8">
        <img
          src={loginImage}
          alt="Login"
          className="h-full w-full object-cover rounded-2xl shadow-2xl"
        />
      </div>

    </div>
  );
};

export default Login;