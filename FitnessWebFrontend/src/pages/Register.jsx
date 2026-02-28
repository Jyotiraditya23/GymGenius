import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register, login } from '../services/authService';
import registerImage from '../assets/register.jpg'; // change image if needed

const Register = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(fullName, email, password);
      await login(email, password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex overflow-hidden bg-black text-white">

      {/* LEFT SIDE - FORM */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-8">
        <div className="w-full max-w-md">

          <h1 className="text-4xl font-semibold mb-6">
            Create Your Account
          </h1>

          <p className="text-gray-400 mb-8">
            Start your smart fitness journey with personalized workout and diet planning.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">

            {error && (
              <div className="p-3 rounded-lg bg-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm mb-2 text-gray-300">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="Your name"
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:border-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-gray-300">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
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
                placeholder="Create password"
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:border-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-white text-black font-semibold hover:bg-gray-200 transition disabled:opacity-50"
            >
              {loading ? 'Creating account…' : 'Register'}
            </button>

          </form>

          <p className="mt-6 text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-white font-medium hover:underline">
              Log in
            </Link>
          </p>

        </div>
      </div>

      {/* RIGHT SIDE - IMAGE */}
      <div className="hidden md:flex md:w-1/2 h-full items-center justify-center p-8">
        <img
          src={registerImage}
          alt="Register"
          className="h-full w-full object-cover rounded-2xl shadow-2xl"
        />
      </div>

    </div>
  );
};

export default Register;