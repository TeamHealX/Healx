import CryptoJS from "crypto-js";

// Get the secret key from environment variables
const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;

/**
 * Encrypts a base64 string using AES.
 * @param {string} base64 - The base64 string of the file.
 * @returns {string} - Encrypted string.
 */
export const encryptData = (base64) => {
  if (!SECRET_KEY) {
    throw new Error("Missing encryption key. Check .env file.");
  }
  return CryptoJS.AES.encrypt(base64, SECRET_KEY).toString();
};

/**
 * Decrypts an encrypted string to base64.
 * @param {string} encrypted - The encrypted string.
 * @returns {string} - Decrypted base64 string.
 */
export const decryptData= (encrypted) => {
  if (!SECRET_KEY) {
    throw new Error("Missing decryption key. Check .env file.");
  }
  const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};
