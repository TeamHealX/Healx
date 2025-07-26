import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSignInAlt, FaEnvelope, FaLock } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { auth } from '../firebase'; // Import your firebase auth instance
import { signInWithEmailAndPassword } from 'firebase/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Login successful, redirect to dashboard or home
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white p-10 rounded-xl shadow-lg"
      >
        <h2 className="text-3xl font-bold text-green-700 mb-6 flex items-center gap-2 justify-center">
          <FaSignInAlt /> Login to HealX
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-gray-700 font-semibold mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-green-300 rounded-md py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="you@example.com"
              />
              <FaEnvelope className="absolute left-3 top-2.5 text-green-500" />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 font-semibold mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-green-300 rounded-md py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="Your password"
              />
              <FaLock className="absolute left-3 top-2.5 text-green-500" />
            </div>
          </div>

          {error && <p className="text-red-600 text-center">{error}</p>}

         <button
  type="submit"
  disabled={loading}
  className={`w-full ${loading ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'} text-white font-semibold py-3 rounded-full shadow`}
>
  {loading ? 'Logging in...' : 'Sign In'}
</button>

        </form>
        <p className="mt-6 text-center text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-green-700 hover:underline font-semibold">
            Register here
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
