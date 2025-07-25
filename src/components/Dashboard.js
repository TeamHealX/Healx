"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { User, LogOut, Settings, FolderOpen, ChevronDown, Upload, Heart } from "lucide-react"

const Dashboard = () => {
  const navigate = useNavigate()
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)

  const handleLogout = () => {
    // TODO: Add your logout logic here
    alert("Logged out!")
    navigate("/")
  }

  const toggleProfileMenu = () => {
    setProfileMenuOpen((prev) => !prev)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 font-sans flex flex-col scroll-smooth">
      {/* Header */}
      <header className="flex justify-between items-center px-6 sm:px-12 py-5 bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex items-center gap-4 select-none"
        >
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform cursor-default">
              <Heart className="w-7 h-7 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">HealX Dashboard</h1>
            <p className="text-sm text-gray-600 hidden sm:block">Your health, secured</p>
          </div>
        </motion.div>

        <nav className="relative">
          <button
            onClick={toggleProfileMenu}
            className="flex items-center gap-3 px-4 py-2 text-gray-700 font-semibold hover:text-gray-900 hover:bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
            aria-haspopup="true"
            aria-expanded={profileMenuOpen}
            aria-label="User profile menu"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-md">
              <User className="w-5 h-5 text-white" />
            </div>
            <span className="hidden sm:block">User</span>
            <ChevronDown
              className={`transition-transform duration-300 w-4 h-4 ${profileMenuOpen ? "rotate-180" : "rotate-0"}`}
            />
          </button>

          <AnimatePresence>
            {profileMenuOpen && (
              <motion.ul
                initial={{ opacity: 0, scale: 0.85, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.85, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none z-50 overflow-hidden border border-gray-100"
                role="menu"
                aria-label="Profile dropdown menu"
              >
                <div className="p-2">
                  <li>
                    <button
                      onClick={() => {
                        setProfileMenuOpen(false)
                        navigate("/settings")
                      }}
                      className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 flex items-center gap-3 rounded-xl transition-colors"
                      role="menuitem"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setProfileMenuOpen(false)
                        handleLogout()
                      }}
                      className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center gap-3 rounded-xl transition-colors"
                      role="menuitem"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </li>
                </div>
              </motion.ul>
            )}
          </AnimatePresence>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-6 sm:px-12 py-16">
        {/* Welcome Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-16 text-center"
        >
          <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
            Welcome back,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 underline decoration-emerald-300 decoration-4">
              User!
            </span>
          </h1>
          <p className="text-gray-600 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
            Manage your health records securely and share them with your doctors instantly. Your privacy is our
            priority.
          </p>
        </motion.section>

        {/* Quick Access Cards */}
        <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: Upload,
              title: "Upload Records",
              desc: "Add new medical records easily and securely.",
              onClick: () => navigate("/upload"),
              gradient: "from-emerald-500 to-teal-600",
              bgGradient: "from-emerald-50 to-teal-50",
              iconBg: "bg-emerald-100",
              iconColor: "text-emerald-600",
            },
            {
              icon: FolderOpen,
              title: "View Records",
              desc: "Browse, search, and organize your medical files.",
              onClick: () => navigate("/records"),
              gradient: "from-blue-500 to-indigo-600",
              bgGradient: "from-blue-50 to-indigo-50",
              iconBg: "bg-blue-100",
              iconColor: "text-blue-600",
            },
            {
              icon: Settings,
              title: "Settings",
              desc: "Manage your profile, privacy, and preferences.",
              onClick: () => navigate("/settings"),
              gradient: "from-purple-500 to-pink-600",
              bgGradient: "from-purple-50 to-pink-50",
              iconBg: "bg-purple-100",
              iconColor: "text-purple-600",
            },
          ].map(({ icon: Icon, title, desc, onClick, bgGradient, iconBg, iconColor }) => (
            <motion.div
              key={title}
              whileHover={{
                scale: 1.05,
                y: -8,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
              }}
              whileFocus={{
                scale: 1.05,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.2)",
              }}
              whileTap={{ scale: 0.98 }}
              tabIndex={0}
              onClick={onClick}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onClick()
              }}
              role="button"
              aria-label={title}
              className={`cursor-pointer rounded-3xl p-8 bg-gradient-to-br ${bgGradient} border border-white/50 shadow-lg hover:shadow-2xl flex flex-col items-center text-center transition-all duration-300 outline-none focus:ring-4 focus:ring-emerald-300 group backdrop-blur-sm`}
            >
              <div className={`p-4 rounded-2xl ${iconBg} mb-6 group-hover:scale-110 transition-transform shadow-md`}>
                <Icon className={`${iconColor} w-8 h-8`} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors">
                {title}
              </h3>
              <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">{desc}</p>
            </motion.div>
          ))}
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center text-gray-500 text-sm py-8 select-none border-t border-gray-200 bg-white/30 backdrop-blur-sm">
        <div className="flex items-center justify-center gap-2">
          © 2025 HealX — Made with <Heart className="w-4 h-4 text-red-500 animate-pulse" /> for your health and privacy.
        </div>
      </footer>
    </div>
  )
}

export default Dashboard
