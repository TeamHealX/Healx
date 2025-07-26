"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { db, auth } from "../firebase"
import { collection, getDocs, doc, deleteDoc, addDoc } from "firebase/firestore"
import { onAuthStateChanged } from "firebase/auth"
import { v4 as uuidv4 } from "uuid"
import {
  Search,
  ArrowLeft,
  Calendar,
  User,
  CheckSquare,
  ArrowUpDown,
  Copy,
  X,
  Shield,
  FolderOpen,
  Users,
} from "lucide-react"
import toast from "react-hot-toast"

const ViewRecords = () => {
  const [records, setRecords] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [selectedIds, setSelectedIds] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const [sortOrder, setSortOrder] = useState("desc")
  const [showShareModal, setShowShareModal] = useState(false)
  const [pin, setPin] = useState("")
  const [expiryTime, setExpiryTime] = useState("1")
  const [shareLink, setShareLink] = useState("")
  const [copySuccess, setCopySuccess] = useState("")
  const [activePatient, setActivePatient] = useState("all")

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
      } else {
        setUser(null)
        setRecords([])
        setLoading(false)
      }
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (!user) {
      setRecords([])
      setLoading(false)
      return
    }
    const fetchRecords = async () => {
      setLoading(true)
      try {
        const snapshot = await getDocs(collection(db, "records"))
        const userRecords = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((record) => record.userId === user.uid)
        setRecords(userRecords)
      } catch (error) {
        console.error("Error fetching records:", error)
        toast.error("Failed to fetch records. Please try again.")
      }
      setLoading(false)
    }
    fetchRecords()
  }, [user])
const handleDelete = async (id) => {
  toast.custom((t) => (
    <div className="bg-white p-4 rounded shadow-md border border-gray-200 flex flex-col items-start gap-2">
      <p className="text-sm text-gray-800">Are you sure you want to delete this record?</p>
      <div className="flex gap-2 mt-2">
        <button
          className="px-3 py-1 bg-red-500 text-white text-sm rounded"
          onClick={async () => {
            toast.dismiss(t.id); // Close the toast
            try {
              await deleteDoc(doc(db, "records", id));
              setRecords((prev) => prev.filter((r) => r.id !== id));
              setSelectedIds((prev) => prev.filter((sid) => sid !== id));
              toast.success("Record deleted");
            } catch (error) {
              console.error("Failed to delete record:", error);
              toast.error("Failed to delete record. Please try again.");
            }
          }}
        >
          Yes
        </button>
        <button
          className="px-3 py-1 bg-gray-300 text-sm rounded"
          onClick={() => toast.dismiss(t.id)}
        >
          No
        </button>
      </div>
    </div>
  ));
};


  const filteredRecords = records.filter((rec) => {
    const lowerSearch = searchTerm.toLowerCase()
    const matchesSearch =
      rec.name?.toLowerCase().includes(lowerSearch) ||
      rec.reportType?.toLowerCase().includes(lowerSearch) ||
      rec.patient?.toLowerCase().includes(lowerSearch)

    if (activePatient === "all") return matchesSearch

    const patientName = rec.patient || "Self"
    return matchesSearch && patientName === activePatient
  })

  const uniquePatients = [...new Set(records.map((rec) => rec.patient || "Self"))]

  const sortedRecords = [...filteredRecords].sort((a, b) =>
    sortOrder === "asc"
      ? new Date(a.reportDate) - new Date(b.reportDate)
      : new Date(b.reportDate) - new Date(a.reportDate),
  )

  const toggleSelect = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([])
    } else {
      const allIds = filteredRecords.map((rec) => rec.id)
      setSelectedIds(allIds)
    }
    setSelectAll(!selectAll)
  }

  useEffect(() => {
    setSelectAll(selectedIds.length === filteredRecords.length && filteredRecords.length > 0)
  }, [selectedIds, filteredRecords])

  const handleShare = () => {
    if (selectedIds.length === 0) {
      toast.error("Please select at least one record to share.")
      return
    }
    setShowShareModal(true)
  }

  const generateShareLink = async () => {
    if (!pin || pin.trim().length === 0) {
      toast.error("Please select at least one record to share.")("Please enter a PIN to protect the link.")
      return
    }
    if (pin.trim().length < 4) {
      toast.error("PIN must be at least 4 characters long.")
      return
    }
    const token = uuidv4()
    const expiryTimestamp = Date.now() + Number.parseInt(expiryTime, 10) * 3600000
    try {
      await addDoc(collection(db, "shareSessions"), {
        token,
        pin,
        expiresAt: expiryTimestamp,
        recordIds: selectedIds,
        createdAt: Date.now(),
        ownerId: user.uid,
      })
      const baseUrl = ${window.location.origin}/sharePage/${token}
      setShareLink(baseUrl)
      setCopySuccess("")
    } catch (err) {
      console.error("Failed to create share session:", err)
      toast.error("Failed to generate share link. Please try again.")
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareLink)
      setCopySuccess("Link copied to clipboard!")
      setTimeout(() => {
        setShowShareModal(false)
        setPin("")
        setExpiryTime("1")
        setShareLink("")
        setCopySuccess("")
      }, 1500)
    } catch {
      setCopySuccess("Failed to copy link.")
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    if (isNaN(date)) return "Invalid date"
    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear()
    return ${day}/${month}/${year}
  }

  const getReportTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "laboratory":
        return "🧪"
      case "radiology":
        return "📸"
      case "general":
        return "📋"
      case "prescription":
        return "💊"
      case "surgery":
        return "🏥"
      default:
        return "📄"
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
      default:
        return "👤"
    }
  }

  const getRecordCountForPatient = (patient) => {
    if (patient === "all") return records.length
    return records.filter((rec) => (rec.patient || "Self") === patient).length
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="p-4 bg-emerald-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <User className="w-8 h-8 text-emerald-600" />
          </div>
          <p className="text-xl text-gray-600 font-medium">Please log in to view your medical records</p>
          <p className="text-gray-500 mt-2">Access your health documents securely</p>
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
                <FolderOpen className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Medical Records</h1>
                <p className="text-sm text-gray-500">Manage your health documents</p>
              </div>
            </div>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              {/* All Records */}
              <button
                onClick={() => setActivePatient("all")}
                className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${
                  activePatient === "all"
                    ? "bg-emerald-50 border-2 border-emerald-200 text-emerald-700"
                    : "bg-white border-2 border-gray-100 text-gray-600 hover:bg-gray-50 hover:border-gray-200"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={p-2 rounded-lg ${activePatient === "all" ? "bg-emerald-100" : "bg-gray-100"}}>
                    <Users className={w-5 h-5 ${activePatient === "all" ? "text-emerald-600" : "text-gray-500"}} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm">All Records</h3>
                    <p className="text-xs text-gray-500 mt-1">View all medical records</p>
                    <span className="inline-block mt-2 px-2 py-1 text-xs bg-gray-200 rounded-full">
                      {getRecordCountForPatient("all")} records
                    </span>
                  </div>
                </div>
              </button>

              {/* Individual Patients */}
              {uniquePatients.map((patient) => (
                <button
                  key={patient}
                  onClick={() => setActivePatient(patient)}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${
                    activePatient === patient
                      ? "bg-emerald-50 border-2 border-emerald-200 text-emerald-700"
                      : "bg-white border-2 border-gray-100 text-gray-600 hover:bg-gray-50 hover:border-gray-200"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={p-2 rounded-lg ${activePatient === patient ? "bg-emerald-100" : "bg-gray-100"}}>
                      <span className="text-lg">{getPatientIcon(patient)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm capitalize">
                        {patient === "Self" ? "My Records" : ${patient}'s Records}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {patient === "Self" ? "Your personal records" : Medical records for ${patient}}
                      </p>
                      <span className="inline-block mt-2 px-2 py-1 text-xs bg-gray-200 rounded-full">
                        {getRecordCountForPatient(patient)} records
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePatient}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-200"
              >
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-100 rounded-xl">
                        {activePatient === "all" ? (
                          <Users className="w-6 h-6 text-emerald-600" />
                        ) : (
                          <span className="text-2xl">{getPatientIcon(activePatient)}</span>
                        )}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          {activePatient === "all"
                            ? "All Medical Records"
                            : activePatient === "Self"
                              ? "My Records"
                              : ${activePatient}'s Records}
                        </h2>
                        <p className="text-gray-600">
                          {filteredRecords.length} record{filteredRecords.length !== 1 ? "s" : ""} found
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Search Bar */}
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search records..."
                      className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  {/* Controls */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <div className="relative">
                          <input type="checkbox" checked={selectAll} onChange={toggleSelectAll} className="sr-only" />
                          <div
                            className={`w-4 h-4 rounded border-2 transition-all ${
                              selectAll
                                ? "bg-emerald-500 border-emerald-500"
                                : "border-gray-300 group-hover:border-emerald-400"
                            }`}
                          >
                            {selectAll && <CheckSquare className="w-4 h-4 text-white absolute inset-0" />}
                          </div>
                        </div>
                        <span className="text-sm font-medium text-gray-700">Select All</span>
                      </label>
                      <div className="text-xs text-gray-500">
                        {selectedIds.length} of {filteredRecords.length} selected
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors"
                      >
                        <ArrowUpDown className="w-3 h-3" />
                        {sortOrder === "desc" ? "Newest" : "Oldest"}
                      </button>
                      <button
                        onClick={handleShare}
                        disabled={selectedIds.length === 0}
                        className="bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-xs font-medium"
                      >
                        Share Selected
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {/* Loading State */}
                  {loading ? (
                    <motion.div
                      className="flex flex-col items-center justify-center py-16"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <motion.div
                        className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, ease: "linear" }}
                      />
                      <p className="mt-4 text-emerald-600 font-semibold text-lg">Loading records...</p>
                    </motion.div>
                  ) : sortedRecords.length === 0 ? (
                    <div className="text-center py-16">
                      <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-xl text-gray-500">No records found</p>
                      <p className="text-gray-400 mt-2">
                        {searchTerm ? "Try adjusting your search criteria" : "No records available for this selection"}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {sortedRecords.map((rec) => (
                        <motion.div
                          key={rec.id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-all duration-200"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          whileHover={{ y: -1 }}
                        >
                          <div className="flex items-start gap-3">
                            <div className="relative mt-1">
                              <input
                                type="checkbox"
                                checked={selectedIds.includes(rec.id)}
                                onChange={() => toggleSelect(rec.id)}
                                className="sr-only"
                              />
                              <div
                                className={`w-4 h-4 rounded border-2 cursor-pointer transition-all ${
                                  selectedIds.includes(rec.id)
                                    ? "bg-emerald-500 border-emerald-500"
                                    : "border-gray-300 hover:border-emerald-400"
                                }`}
                                onClick={() => toggleSelect(rec.id)}
                              >
                                {selectedIds.includes(rec.id) && (
                                  <CheckSquare className="w-4 h-4 text-white absolute inset-0" />
                                )}
                              </div>
                            </div>

                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 mb-2">{rec.name}</h4>

                              <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-3">
                                <div className="flex items-center gap-1">
                                  <span>{getReportTypeIcon(rec.reportType)}</span>
                                  <span>{rec.reportType}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <User className="w-3 h-3" />
                                  <span>{rec.patient || "Self"}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  <span>{formatDate(rec.reportDate)}</span>
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-2">
                                <Link
                                  to={/viewfile/${rec.id}}
                                  className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 transition-colors"
                                >
                                  View Report
                                </Link>
                                <button
                                  onClick={() => handleDelete(rec.id)}
                                  className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700 transition-colors"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto m-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-xl">
                    <Shield className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Share Selected Records</h3>
                </div>
                <button
                  onClick={() => {
                    setShowShareModal(false)
                    setPin("")
                    setExpiryTime("1")
                    setShareLink("")
                    setCopySuccess("")
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Create PIN</label>
                  <input
                    type="password"
                    name="pin_code_field"
                    autoComplete="new-password"
                    value={pin}
                    onChange={(e) => {
                      const value = e.target.value
                      if (value.length <= 4) {
                        setPin(value)
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                    placeholder="e.g. 1234"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Link Expiry (hours)</label>
                  <select
                    value={expiryTime}
                    onChange={(e) => setExpiryTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  >
                    <option value="1">1 hour</option>
                    <option value="3">3 hours</option>
                    <option value="6">6 hours</option>
                    <option value="12">12 hours</option>
                    <option value="24">24 hours</option>
                    <option value="48">48 hours</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={generateShareLink}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Generate Link
                  </button>
                  <button
                    onClick={() => setShowShareModal(false)}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>

                {shareLink && (
                  <motion.div
                    className="mt-6 p-4 bg-gray-50 rounded-xl"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">Share Link</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={shareLink}
                        readOnly
                        className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                      />
                      <button
                        onClick={copyToClipboard}
                        className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>

                    {copySuccess && (
                      <motion.div
                        className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        <span className="text-sm text-green-700 font-medium">{copySuccess}</span>
                        <button
                          onClick={() => setCopySuccess("")}
                          className="text-green-700 hover:text-green-900 font-bold text-lg leading-none"
                        >
                          ×
                        </button>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default ViewRecords
