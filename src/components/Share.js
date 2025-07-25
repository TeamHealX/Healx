import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import CryptoJS from "crypto-js"; // 🔐 Import CryptoJS

const SharePage = () => {
  const { token } = useParams();

  const [records, setRecords] = useState([]);
  const [pinInput, setPinInput] = useState("");
  const [pinRequired, setPinRequired] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [recordsLoading, setRecordsLoading] = useState(true); // ✅ Added state
  const [sessionData, setSessionData] = useState(null);

  const secretKey = process.env.REACT_APP_SECRET_KEY; // 🔑 Use the same key used during encryption

  const decryptFileData = (encryptedData) => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return decrypted;
    } catch (err) {
      console.error("Decryption error:", err);
      return null;
    }
  };

  // Fetch share session
  useEffect(() => {
    const fetchSession = async () => {
      setLoading(true);
      try {
        const sessionsRef = collection(db, "shareSessions");
        const q = query(sessionsRef, where("token", "==", token));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          setError("Invalid or expired share link.");
          setLoading(false);
          return;
        }

        const sessionDoc = snapshot.docs[0];
        const data = sessionDoc.data();

        if (data.expiresAt && Date.now() > data.expiresAt) {
          setError("This share link has expired.");
          setLoading(false);
          return;
        }

        setSessionData(data);
        setPinRequired(!!data.pin);

        if (!data.pin) {
          setAccessGranted(true);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load session. Please try again later.");
      }
      setLoading(false);
    };

    fetchSession();
  }, [token]);

  // Fetch records after PIN access
  useEffect(() => {
    const fetchRecords = async () => {
      if (!accessGranted || !sessionData) return;
      setRecordsLoading(true); // ✅ Start loading
      try {
        const recordIds = sessionData.recordIds || [];

        if (recordIds.length === 0) {
          setError("No records available in this shared session.");
          setRecordsLoading(false); // ✅ Stop loading on error
          return;
        }

        const recordPromises = recordIds.map(async (id) => {
          const docRef = doc(db, "records", id);
          const recordDoc = await getDoc(docRef);
          if (!recordDoc.exists()) return null;

          const data = recordDoc.data();
          const decryptedFile = decryptFileData(data.fileData);

          return {
            id: recordDoc.id,
            ...data,
            fileData: decryptedFile || null,
          };
        });

        const result = (await Promise.all(recordPromises)).filter(Boolean);
        setRecords(result);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch shared records.");
      }
      setRecordsLoading(false); // ✅ Stop loading after fetch
    };

    fetchRecords();
  }, [accessGranted, sessionData]);

  const handlePinSubmit = async (e) => {
    e.preventDefault();
    if (!pinInput.trim()) {
      setError("Please enter the PIN.");
      return;
    }
    if (sessionData && pinInput === sessionData.pin) {
      setAccessGranted(true);
      setError("");
    } else {
      setError("Incorrect PIN. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <motion.div
          className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        />
        <p className="ml-4 text-green-600 text-lg font-semibold">
          Loading shared records...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white p-8 rounded-xl shadow-md max-w-md text-center"
        >
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Access Denied
          </h2>
          <p className="mb-6">{error}</p>
        </motion.div>
      </div>
    );
  }

  if (pinRequired && !accessGranted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-xl shadow-md max-w-md w-full"
        >
          <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
            Enter PIN to Access Records
          </h2>
          <form onSubmit={handlePinSubmit} className="flex flex-col gap-4">
            <input
              type="password"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="Enter PIN"
              className="border border-green-300 rounded-md p-2 text-center text-xl tracking-widest"
            />
            {error && <p className="text-red-600">{error}</p>}
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-full font-semibold"
            >
              Submit
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex flex-col items-center py-16 px-6 space-y-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-10 rounded-xl shadow-md max-w-4xl w-full"
      >
        <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">
          Shared Medical Records
        </h1>

        {recordsLoading ? (
          <div className="min-h-screen flex items-center justify-center bg-white">
        <motion.div
          className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        />
        <p className="ml-4 text-green-600 text-lg font-semibold">
          Loading shared records...
        </p>
      </div>
        ) : records.length === 0 ? (
          <p className="text-center text-gray-600">No records to display.</p>
        ) : (
          records.map((rec) => (
            <div
              key={rec.id}
              className="bg-green-50 p-6 rounded-lg border border-green-200 mb-8 shadow-sm"
            >
              <h2 className="text-2xl font-semibold mb-2 text-green-800">
                {rec.name}
              </h2>
              <p className="text-sm mb-1">
                <strong>Report Type:</strong> {rec.reportType}
              </p>
              <p className="text-sm mb-1">
                <strong>Patient:</strong> {rec.patient}
              </p>
              <p className="text-sm mb-3">
                <strong>Date:</strong> {rec.reportDate}
              </p>

              <div className="mt-4">
                {rec.fileData?.startsWith("data:image") ? (
                  <img
                    src={rec.fileData}
                    alt={rec.name}
                    className="max-w-full max-h-[400px] rounded shadow-md mx-auto"
                  />
                ) : rec.fileData?.startsWith("data:application/pdf") ? (
                  <iframe
                    src={rec.fileData}
                    title={rec.name}
                    className="w-full h-[600px] rounded border"
                  />
                ) : (
                  <p className="text-center text-gray-600 italic">
                    Preview not available for this file type.
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </motion.div>
    </div>
  );
};

export default SharePage;
