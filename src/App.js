import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Upload from "./components/Upload";
import ViewRecords from "./components/ViewRecords";
import Settings from "./components/Settings";
import SharePage from "./components/Share";
import ViewFile from "./components/ViewFile";
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/records" element={<ViewRecords />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/sharePage/:token" element={<SharePage/>} />
        <Route path="/viewfile/:id" element={<ViewFile />} />
        
        {/* Add other routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
