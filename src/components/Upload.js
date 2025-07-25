import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import CryptoJS from "crypto-js";

const Upload = () => {
  const [file, setFile] = useState(null);
  const [reportType, setReportType] = useState("");
  const [patient, setPatient] = useState("");
  const [reportDate, setReportDate] = useState("");
  const navigate = useNavigate();

  const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file");
    if (!reportType.trim()) return alert("Please enter the report type");
    if (!patient) return alert("Please select the patient");
    if (!reportDate.trim()) return alert("Please enter the date of report");

    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return alert("User not logged in");

      const base64String = await fileToBase64(file);

      // 🔐 Encrypt the base64 string
      const encryptedData = CryptoJS.AES.encrypt(
        base64String,
        SECRET_KEY
      ).toString();

      await addDoc(collection(db, "records"), {
        userId,
        name: file.name,
        fileData: encryptedData,
        reportType: reportType.trim(),
        patient: patient,
        reportDate,
        encrypted: true, // ✅ Important!
        createdAt: serverTimestamp(),
      });

      alert("Uploaded successfully!");
      setFile(null);
      setReportType("");
      setPatient("");
      setReportDate("");
      e.target.reset();
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex flex-col items-center px-6 py-16 relative">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 right-12 border border-green-500 text-green-600 px-4 py-2 rounded-md hover:bg-green-600 hover:text-white transition"
        style={{ paddingRight: "2rem" }}
      >
        ⬅ Back
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-10 rounded-xl shadow-md w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">
          Upload Medical Records
        </h2>

        <form onSubmit={handleUpload} className="space-y-6">
          <input
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.jpg,.png"
            className="w-full border border-green-300 rounded-md p-2 cursor-pointer"
          />

          <input
            type="text"
            placeholder="Report Type (e.g., Blood Test)"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="w-full border border-green-300 rounded-md p-2"
          />

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Patient:
            </label>
            <select
              value={patient}
              onChange={(e) => setPatient(e.target.value)}
              className="w-full border border-green-300 rounded-md p-2"
            >
              <option value="">Select Patient</option>
              <option value="Self">Self</option>
              <option value="Dad">Dad</option>
              <option value="Mom">Mom</option>
              <option value="Spouse">Spouse</option>
              <option value="Child">Child</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Date of Report:
            </label>
            <input
              type="date"
              value={reportDate}
              onChange={(e) => setReportDate(e.target.value)}
              className="w-full border border-green-300 rounded-md p-2"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-full shadow"
          >
            Upload
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Upload;
