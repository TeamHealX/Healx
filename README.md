# HealX – Smart Health Records System

HealX is a modern web application designed to help users securely upload, encrypt, store, and manage their health records. Built with React and Firebase, it provides a smooth and secure user experience for handling sensitive medical data.

---

## 🚀 Features

- 🔐 **User Authentication** (Firebase Authentication with Email/Password)  
- 📁 **Encrypted File Uploads** using AES encryption (CryptoJS)  
- 🧾 Manage health records by patient and report type  
- 📤 Shareable encrypted health reports  
- 📊 View uploaded records with ease  
- 🧑‍⚕️ Multi-patient support per user account  
- 🌐 Modern, responsive UI with animations (Framer Motion + Tailwind CSS)  
- 🔔 Toast notifications for user feedback (react-hot-toast)  
- 🗃 Firestore used as the backend database  
- 🌩 Ready for deployment on Firebase Hosting  

---

## 🛠 Tech Stack

| Layer           | Technology                |
|-----------------|---------------------------|
| Frontend        | React.js                  |
| Styling         | Tailwind CSS + Lucide Icons |
| Animations      | Framer Motion             |
| Notifications   | react-hot-toast           |
| Authentication  | Firebase Authentication   |
| Backend/DB      | Firebase Firestore        |
| Storage & Hosting | Firebase Hosting         |
| Encryption      | CryptoJS (AES encryption) |
| Routing         | React Router DOM          |

---

## 📂 Project Structure

```HealX/
├── .github/
│   └── workflows/
│       ├── firebase-hosting-merge.yml
│       └── firebase-hosting-pull-request.yml
├── public/
│   ├── _redirects
│   └── index.html
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/               # Main views/pages
│   ├── utils/               # Utility functions (e.g., encryption)
│   ├── App.js               # Main React component
│   ├── firebase.js          # Firebase config and initialization
│   ├── index.css            # Global styles (Tailwind CSS)
│   └── index.js             # React app entry point
├── .firebaserc              # Firebase project config
├── .gitignore
├── README.md
├── firebase.json            # Firebase hosting & functions config
├── package-lock.json
├── package.json
├── postcss.config.js        # PostCSS config for Tailwind CSS
└── tailwind.config.js       # Tailwind CSS config
```
---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/TeamHealX/Healx.git
cd Healx
```

### 2. Install dependencies

```bash
npm install
```

### 3. Firebase Setup

Create a Firebase project at Firebase Console.

Enable Authentication with Email/Password sign-in method.

Enable Cloud Firestore in test mode (for development).

Add a new Web app to your Firebase project and copy the Firebase config.

Create src/firebase.js and add the following code:

// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
apiKey: "YOUR_API_KEY",
authDomain: "YOUR_AUTH_DOMAIN",
projectId: "YOUR_PROJECT_ID",
storageBucket: "YOUR_STORAGE_BUCKET",
messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

### 4. Set up environment variables for encryption key
Create a .env file in the project root (do not commit this file):

REACT_APP_ENCRYPTION_KEY=your_super_secret_key_here

### 5. Run the app
```bash
npm start
```
Open http://localhost:3000 in your browser.

---

## 📺 Demo Video

🎥 Check out our demo video on YouTube to see HealX in action:  
👉  Watch the Demo(https://youtu.be/pVy62u48rSI)


---


## 🛡 Security Notes
All health records are encrypted using AES encryption via CryptoJS before uploading.

Encryption keys must be stored securely using environment variables (.env) and never committed to source control.

Firestore security rules should be configured to restrict data access only to authorized users.
