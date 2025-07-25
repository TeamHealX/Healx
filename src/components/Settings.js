"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { auth } from "../firebase"
import { onAuthStateChanged } from "firebase/auth"
import {
  ArrowLeft,
  User,
  Heart,
  Edit3,
  Save,
  Calendar,
  Phone,
  Mail,
  Users,
  Droplets,
  AlertTriangle,
  Pill,
  FileText,
  Settings,
  Plus,
} from "lucide-react"

const SettingsPage = () => {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState("profile")
  const [activePatient, setActivePatient] = useState("Self")
  const [patients, setPatients] = useState(["Self"])
  const [showAddPatient, setShowAddPatient] = useState(false)
  const [newPatientName, setNewPatientName] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [loading, setLoading] = useState(true)

  const defaultProfile = {
    fullName: "",
    dob: "",
    gender: "",
    mobile: "",
    email: "",
  }

  const defaultHealth = {
    bloodGroup: "",
    conditions: "",
    allergies: "",
    medications: "",
  }

  // Get current user's email
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && currentUser.email) {
        setUserEmail(currentUser.email)
        setLoading(false)
      } else {
        setUserEmail("")
        setLoading(false)
        // Redirect to login if no user
        navigate("/login")
      }
    })
    return () => unsubscribe()
  }, [navigate])

  // Load patients list from localStorage (user-specific)
  useEffect(() => {
    if (userEmail) {
      const savedPatients = localStorage.getItem(`${userEmail}_patients`)
      if (savedPatients) {
        setPatients(JSON.parse(savedPatients))
      }
    }
  }, [userEmail])

  // Get profile data for active patient
  const [profileData, setProfileData] = useState(defaultProfile)

  // Get health data for active patient
  const [healthData, setHealthData] = useState(defaultHealth)

  // Get editing states for active patient
  const [isEditingProfile, setIsEditingProfile] = useState(true)

  const [isEditingHealth, setIsEditingHealth] = useState(true)

  // Initial data load for the default patient
  useEffect(() => {
    if (userEmail) {
      const savedProfile = localStorage.getItem(`${userEmail}_profileData_${activePatient}`)
      const savedHealth = localStorage.getItem(`${userEmail}_healthData_${activePatient}`)
      const savedEditingProfile = localStorage.getItem(`${userEmail}_isEditingProfile_${activePatient}`)
      const savedEditingHealth = localStorage.getItem(`${userEmail}_isEditingHealth_${activePatient}`)

      setProfileData(savedProfile ? JSON.parse(savedProfile) : { ...defaultProfile })
      setHealthData(savedHealth ? JSON.parse(savedHealth) : { ...defaultHealth })
      setIsEditingProfile(savedEditingProfile ? JSON.parse(savedEditingProfile) : true)
      setIsEditingHealth(savedEditingHealth ? JSON.parse(savedEditingHealth) : true)
    }
  }, [userEmail]) // Run when userEmail is available

  // Update data when active patient changes
  useEffect(() => {
    if (userEmail) {
      const savedProfile = localStorage.getItem(`${userEmail}_profileData_${activePatient}`)
      const savedHealth = localStorage.getItem(`${userEmail}_healthData_${activePatient}`)
      const savedEditingProfile = localStorage.getItem(`${userEmail}_isEditingProfile_${activePatient}`)
      const savedEditingHealth = localStorage.getItem(`${userEmail}_isEditingHealth_${activePatient}`)

      // Always reset to defaults first, then load saved data if it exists
      setProfileData(savedProfile ? JSON.parse(savedProfile) : { ...defaultProfile })
      setHealthData(savedHealth ? JSON.parse(savedHealth) : { ...defaultHealth })
      setIsEditingProfile(savedEditingProfile ? JSON.parse(savedEditingProfile) : true)
      setIsEditingHealth(savedEditingHealth ? JSON.parse(savedEditingHealth) : true)
    }
  }, [activePatient, userEmail])

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value })
  }

  const handleHealthChange = (e) => {
    setHealthData({ ...healthData, [e.target.name]: e.target.value })
  }

  const handleSave = (section) => {
    if (!userEmail) return

    if (section === "Profile Settings") {
      localStorage.setItem(`${userEmail}_profileData_${activePatient}`, JSON.stringify(profileData))
      setIsEditingProfile(false)
      localStorage.setItem(`${userEmail}_isEditingProfile_${activePatient}`, "false")
    } else if (section === "Health Information") {
      localStorage.setItem(`${userEmail}_healthData_${activePatient}`, JSON.stringify(healthData))
      setIsEditingHealth(false)
      localStorage.setItem(`${userEmail}_isEditingHealth_${activePatient}`, "false")
    }
    console.log(`${section} saved successfully for ${activePatient}!`)
  }

  const handleEditProfile = () => {
    if (!userEmail) return
    setIsEditingProfile(true)
    localStorage.setItem(`${userEmail}_isEditingProfile_${activePatient}`, "true")
  }

  const handleEditHealth = () => {
    if (!userEmail) return
    setIsEditingHealth(true)
    localStorage.setItem(`${userEmail}_isEditingHealth_${activePatient}`, "true")
  }

  const handleAddPatient = () => {
    if (!userEmail) return
    if (newPatientName.trim() && !patients.includes(newPatientName.trim())) {
      const updatedPatients = [...patients, newPatientName.trim()]
      setPatients(updatedPatients)
      localStorage.setItem(`${userEmail}_patients`, JSON.stringify(updatedPatients))
      setNewPatientName("")
      setShowAddPatient(false)
      setActivePatient(newPatientName.trim())
    }
  }

  const getPatientIcon = (patient) => {
    switch (patient?.toLowerCase()) {
      case "mom":
      case "mother":
        return "👩"
      case "dad":
      case "father":
        return "👨"
      case "son":
        return "👦"
      case "daughter":
        return "👧"
      case "self":
        return "👤"
      default:
        return "👤"
    }
  }

  const sections = [
    {
      label: "Profile Settings",
      key: "profile",
      icon: User,
      description: "Manage personal information",
    },
    {
      label: "Health Information",
      key: "health",
      icon: Heart,
      description: "Update medical details",
    },
  ]

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="p-4 bg-emerald-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Settings className="w-8 h-8 text-emerald-600 animate-spin" />
          </div>
          <p className="text-xl text-gray-600 font-medium">Loading settings...</p>
          <p className="text-gray-500 mt-2">Please wait while we load your data</p>
        </div>
      </div>
    )
  }

  // Show error state if no user email
  if (!userEmail) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="p-4 bg-red-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <User className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-xl text-gray-600 font-medium">Authentication required</p>
          <p className="text-gray-500 mt-2">Please log in to access your settings</p>
          <button
            onClick={() => navigate("/login")}
            className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Header */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-xl">
                <Settings className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
                <p className="text-sm text-gray-500">Manage account preferences • {userEmail}</p>
              </div>
            </div>
            <button
              onClick={() => navigate("/dashboard")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Patient Selection Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-700">Select Person</h3>
                <button
                  onClick={() => setShowAddPatient(true)}
                  className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <nav className="space-y-2">
                {patients.map((patient) => (
                  <button
                    key={patient}
                    onClick={() => setActivePatient(patient)}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                      activePatient === patient
                        ? "bg-emerald-50 border-2 border-emerald-200 text-emerald-700"
                        : "bg-white border-2 border-gray-100 text-gray-600 hover:bg-gray-50 hover:border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getPatientIcon(patient)}</span>
                      <div>
                        <h4 className="font-medium text-sm">
                          {patient === "Self" ? "My Settings" : `${patient}'s Settings`}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {patient === "Self" ? "Your personal info" : `Settings for ${patient}`}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </nav>

              {/* Add Patient Modal */}
              {showAddPatient && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
                    <h3 className="text-lg font-semibold mb-4">Add Family Member</h3>
                    <input
                      type="text"
                      value={newPatientName}
                      onChange={(e) => setNewPatientName(e.target.value)}
                      placeholder="Enter name (e.g., Mom, Dad, Son)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 mb-4"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleAddPatient}
                        className="flex-1 bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => {
                          setShowAddPatient(false)
                          setNewPatientName("")
                        }}
                        className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Settings Navigation */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              {sections.map(({ label, key, icon: Icon, description }) => (
                <button
                  key={key}
                  onClick={() => setActiveSection(key)}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${
                    activeSection === key
                      ? "bg-emerald-50 border-2 border-emerald-200 text-emerald-700"
                      : "bg-white border-2 border-gray-100 text-gray-600 hover:bg-gray-50 hover:border-gray-200"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${activeSection === key ? "bg-emerald-100" : "bg-gray-100"}`}>
                      <Icon className={`w-5 h-5 ${activeSection === key ? "text-emerald-600" : "text-gray-500"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm">{label}</h3>
                      <p className="text-xs text-gray-500 mt-1">{description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {activeSection === "profile" && (
                <motion.div
                  key={`profile-${activePatient}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200"
                >
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-100 rounded-xl">
                          <span className="text-2xl">{getPatientIcon(activePatient)}</span>
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900">
                            {activePatient === "Self" ? "My Profile" : `${activePatient}'s Profile`}
                          </h2>
                          <p className="text-gray-600">Manage personal information and preferences</p>
                        </div>
                      </div>
                      {!isEditingProfile && (
                        <button
                          onClick={handleEditProfile}
                          className="inline-flex items-center gap-2 px-4 py-2 text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                          Edit Profile
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="p-6">
                    {isEditingProfile ? (
                      <form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                              <User className="w-4 h-4" />
                              Full Name
                            </label>
                            <input
                              type="text"
                              name="fullName"
                              value={profileData.fullName}
                              onChange={handleProfileChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                              placeholder="Enter full name"
                            />
                          </div>

                          <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                              <Calendar className="w-4 h-4" />
                              Date of Birth
                            </label>
                            <input
                              type="date"
                              name="dob"
                              value={profileData.dob}
                              onChange={handleProfileChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                            />
                          </div>

                          <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                              <Users className="w-4 h-4" />
                              Gender
                            </label>
                            <select
                              name="gender"
                              value={profileData.gender}
                              onChange={handleProfileChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                            >
                              <option value="">Select gender</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>

                          <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                              <Phone className="w-4 h-4" />
                              Mobile Number
                            </label>
                            <input
                              type="tel"
                              name="mobile"
                              value={profileData.mobile}
                              onChange={handleProfileChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                              placeholder="Enter mobile number"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                              <Mail className="w-4 h-4" />
                              Email Address
                            </label>
                            <input
                              type="email"
                              name="email"
                              value={profileData.email}
                              onChange={handleProfileChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                              placeholder="Enter email address"
                            />
                          </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                          <button
                            type="button"
                            onClick={() => handleSave("Profile Settings")}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                          >
                            <Save className="w-4 h-4" />
                            Save Profile
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsEditingProfile(false)}
                            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <User className="w-4 h-4 text-gray-500" />
                              <span className="text-sm font-medium text-gray-700">Full Name</span>
                            </div>
                            <p className="text-gray-900 font-medium">{profileData.fullName || "Not provided"}</p>
                          </div>

                          <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Calendar className="w-4 h-4 text-gray-500" />
                              <span className="text-sm font-medium text-gray-700">Date of Birth</span>
                            </div>
                            <p className="text-gray-900 font-medium">{profileData.dob || "Not provided"}</p>
                          </div>

                          <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Users className="w-4 h-4 text-gray-500" />
                              <span className="text-sm font-medium text-gray-700">Gender</span>
                            </div>
                            <p className="text-gray-900 font-medium">{profileData.gender || "Not provided"}</p>
                          </div>

                          <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Phone className="w-4 h-4 text-gray-500" />
                              <span className="text-sm font-medium text-gray-700">Mobile</span>
                            </div>
                            <p className="text-gray-900 font-medium">{profileData.mobile || "Not provided"}</p>
                          </div>

                          <div className="md:col-span-2 p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Mail className="w-4 h-4 text-gray-500" />
                              <span className="text-sm font-medium text-gray-700">Email</span>
                            </div>
                            <p className="text-gray-900 font-medium">{profileData.email || "Not provided"}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeSection === "health" && (
                <motion.div
                  key={`health-${activePatient}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200"
                >
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 rounded-xl">
                          <Heart className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900">
                            {activePatient === "Self"
                              ? "My Health Information"
                              : `${activePatient}'s Health Information`}
                          </h2>
                          <p className="text-gray-600">Manage medical details and health records</p>
                        </div>
                      </div>
                      {!isEditingHealth && (
                        <button
                          onClick={handleEditHealth}
                          className="inline-flex items-center gap-2 px-4 py-2 text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                          Edit Health Info
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="p-6">
                    {isEditingHealth ? (
                      <form className="space-y-6">
                        <div>
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <Droplets className="w-4 h-4" />
                            Blood Group
                          </label>
                          <select
                            name="bloodGroup"
                            value={healthData.bloodGroup}
                            onChange={handleHealthChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                          >
                            <option value="">Select blood group</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                          </select>
                        </div>

                        <div>
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <FileText className="w-4 h-4" />
                            Medical Conditions
                          </label>
                          <textarea
                            name="conditions"
                            value={healthData.conditions}
                            onChange={handleHealthChange}
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all resize-none"
                            placeholder="List any medical conditions..."
                          />
                        </div>

                        <div>
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <AlertTriangle className="w-4 h-4" />
                            Allergies
                          </label>
                          <textarea
                            name="allergies"
                            value={healthData.allergies}
                            onChange={handleHealthChange}
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all resize-none"
                            placeholder="List any allergies..."
                          />
                        </div>

                        <div>
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <Pill className="w-4 h-4" />
                            Current Medications
                          </label>
                          <textarea
                            name="medications"
                            value={healthData.medications}
                            onChange={handleHealthChange}
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all resize-none"
                            placeholder="List current medications..."
                          />
                        </div>

                        <div className="flex gap-3 pt-4">
                          <button
                            type="button"
                            onClick={() => handleSave("Health Information")}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                          >
                            <Save className="w-4 h-4" />
                            Save Health Info
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsEditingHealth(false)}
                            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="p-4 bg-red-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Droplets className="w-4 h-4 text-red-500" />
                              <span className="text-sm font-medium text-gray-700">Blood Group</span>
                            </div>
                            <p className="text-gray-900 font-medium">{healthData.bloodGroup || "Not provided"}</p>
                          </div>

                          <div className="p-4 bg-red-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <FileText className="w-4 h-4 text-red-500" />
                              <span className="text-sm font-medium text-gray-700">Medical Conditions</span>
                            </div>
                            <p className="text-gray-900 font-medium">{healthData.conditions || "None reported"}</p>
                          </div>

                          <div className="p-4 bg-red-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <AlertTriangle className="w-4 h-4 text-red-500" />
                              <span className="text-sm font-medium text-gray-700">Allergies</span>
                            </div>
                            <p className="text-gray-900 font-medium">{healthData.allergies || "None reported"}</p>
                          </div>

                          <div className="p-4 bg-red-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Pill className="w-4 h-4 text-red-500" />
                              <span className="text-sm font-medium text-gray-700">Current Medications</span>
                            </div>
                            <p className="text-gray-900 font-medium">{healthData.medications || "None reported"}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
