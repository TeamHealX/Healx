// src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaSignInAlt, FaUserPlus, FaArrowRight, FaShieldAlt, FaClock, FaFolderOpen } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white font-sans">
      {/* Navbar */}
      <header className="flex justify-between items-center px-10 py-6 bg-white shadow-md sticky top-0 z-50">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-bold text-green-700 flex items-center gap-3"
        >
          <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xl">💚</span>
          HealX
        </motion.div>
        <nav className="flex items-center gap-6">
          <Link to="/login" className="text-green-700 font-medium hover:text-green-900 flex items-center gap-1">
            <FaSignInAlt /> Sign In
          </Link>
          <Link to="/register">
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-semibold shadow flex items-center gap-2">
              <FaUserPlus /> Register
            </button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col items-center text-center py-24 px-6 relative overflow-hidden">
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl sm:text-6xl font-extrabold text-gray-900 leading-tight mb-6"
        >
          Revolutionize Your Health Records
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-gray-600 max-w-2xl mb-10"
        >
          HealX is a smart, secure, and easy-to-use platform to manage and share your medical records—anytime, anywhere.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex gap-6 flex-wrap justify-center"
        >
          <Link to="/register">
            <button className="bg-green-700 text-white px-8 py-3 rounded-full font-medium shadow-lg hover:bg-green-800 text-lg">
              Get Started <FaArrowRight className="inline ml-2" />
            </button>
          </Link>
          <button className="border-2 border-green-700 text-green-700 px-8 py-3 rounded-full font-medium hover:bg-green-100 text-lg">
            Live Demo
          </button>
        </motion.div>
      </main>

      {/* Features */}
      <section className="grid sm:grid-cols-3 gap-8 px-10 sm:px-20 py-16 bg-white">
        <motion.div className="bg-green-50 p-8 rounded-xl shadow-md text-center hover:shadow-xl transition">
          <FaShieldAlt className="text-4xl text-green-600 mb-4 mx-auto" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Military-Grade Security</h3>
          <p className="text-gray-600">We encrypt your data with cutting-edge protocols to ensure maximum safety.</p>
        </motion.div>
        <motion.div className="bg-green-50 p-8 rounded-xl shadow-md text-center hover:shadow-xl transition">
          <FaClock className="text-4xl text-green-600 mb-4 mx-auto" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Smart Expiry Sharing</h3>
          <p className="text-gray-600">Control how long your data is accessible and to whom with time-limited links.</p>
        </motion.div>
        <motion.div className="bg-green-50 p-8 rounded-xl shadow-md text-center hover:shadow-xl transition">
          <FaFolderOpen className="text-4xl text-green-600 mb-4 mx-auto" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Organized & Searchable</h3>
          <p className="text-gray-600">Tag, group, and search your reports to find what you need—fast and easy.</p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="text-center text-gray-500 text-sm py-8">
        © 2025 HealX — Made with 💚 for your health and privacy.
      </footer>
    </div>
  );
};

export default Home;
