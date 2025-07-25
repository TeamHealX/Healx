import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import CryptoJS from "crypto-js"; // 🔐 AES for decryption

const SECRET_KEY = process.env.REACT_APP_SECRET_KEY; // ✅ Uses env key

const ViewFile = () => {
  const { id } = useParams();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecord = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "records", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          // ✅ Decrypt if needed
          if (data.encrypted && data.fileData) {
            try {
              const bytes = CryptoJS.AES.decrypt(data.fileData, SECRET_KEY);
              const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
              if (decryptedData) {
                data.fileData = decryptedData;
              } else {
                console.warn(
                  "⚠️ Decryption produced empty string. Possibly not encrypted."
                );
              }
            } catch (err) {
              console.error("❌ Decryption error:", err);
              alert("Failed to decrypt file.");
            }
          }

          setRecord({ id: docSnap.id, ...data });
        } else {
          alert("❌ Record not found!");
        }
      } catch (error) {
        console.error("Error fetching record:", error);
        alert("Failed to load record.");
      }
      setLoading(false);
    };

    fetchRecord();
  }, [id]);

  const pdfBlobUrl = useMemo(() => {
    if (!record?.fileData || !record.name.toLowerCase().endsWith(".pdf"))
      return null;
    try {
      const base64Data = record.fileData.split(",")[1] || record.fileData;
      const byteCharacters = atob(base64Data);
      const byteArray = new Uint8Array(
        [...byteCharacters].map((c) => c.charCodeAt(0))
      );
      const blob = new Blob([byteArray], { type: "application/pdf" });
      return URL.createObjectURL(blob);
    } catch (err) {
      console.error("Failed to create PDF blob URL:", err);
      return null;
    }
  }, [record]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center text-green-600 text-xl font-semibold animate-pulse">
          🔄 Loading your file...
        </div>
      </div>
    );
  }

  if (!record) return null;

  const isPDF = record.name.toLowerCase().endsWith(".pdf");
  const isImage = /\.(jpg|jpeg|png|gif)$/i.test(record.name);

  return (
    <div className="min-h-screen bg-green-50 py-8 px-4 flex flex-col items-center">
      {/* Top Bar */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-green-700 truncate">
          {record.name}
        </h2>
        <Link
          to="/records"
          className="bg-white text-green-600 border border-green-500 hover:bg-green-600 hover:text-white transition px-4 py-2 rounded-md shadow"
        >
          ⬅ Back
        </Link>
      </div>

      {/* File Preview Box */}
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
        {record.fileData ? (
          <>
            {isPDF && pdfBlobUrl ? (
              <object
                data={pdfBlobUrl}
                type="application/pdf"
                width="100%"
                height="600px"
                className="rounded border"
              >
                <p className="text-center text-red-600 font-semibold">
                  PDF preview is not supported by your browser.
                </p>
              </object>
            ) : isPDF ? (
              <p className="text-center text-red-600 font-semibold">
                ❌ Failed to load PDF preview.
              </p>
            ) : isImage ? (
              <img
                src={record.fileData}
                alt={record.name}
                className="max-w-full rounded shadow-md mx-auto"
              />
            ) : (
              <p className="text-center text-gray-600 italic">
                📎 Preview not available for this file type.
              </p>
            )}
          </>
        ) : (
          <p className="text-center text-red-600 font-semibold">
            ⚠️ File data is not available.
          </p>
        )}
      </div>

      {/* File Details and Download */}
      <div className="w-full max-w-4xl mt-6 text-center">
        <p className="text-sm text-gray-500">
          📄 <span className="font-medium">File Type:</span>{" "}
          {record.name.split(".").pop().toUpperCase()}
        </p>

        <a
          href={record.fileData || "#"}
          download={record.name}
          className={`mt-4 inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-semibold transition ${
            record.fileData ? "" : "opacity-50 cursor-not-allowed"
          }`}
          onClick={(e) => !record.fileData && e.preventDefault()}
        >
          ⬇️ Download File
        </a>
      </div>
    </div>
  );
};

export default ViewFile;
