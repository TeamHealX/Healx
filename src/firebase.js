// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAk4wxik1MgrqtyEOY8anxAZ3fsTSTpbHA",
  authDomain: "healx-76c40.firebaseapp.com",
  projectId: "healx-76c40",
  storageBucket: "healx-76c40.appspot.com", 
  messagingSenderId: "511124876421",
  appId: "1:511124876421:web:66163b92482c68923a4dec"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
