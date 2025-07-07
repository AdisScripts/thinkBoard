import { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import ForgotPage from './pages/ForgotPage';
import ResetPage from './pages/ResetPage';
import HomePage from './pages/HomePage';
import CreatePage from './pages/CreatePage';
import NoteDetailPage from './pages/NoteDetailPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import toast from 'react-hot-toast';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();

  // Redirect to login if no token
  useEffect(() => {
 if (
  !token &&
  !["/login", "/register", "/forgot"].includes(window.location.pathname) &&
  !window.location.pathname.startsWith("/reset")
    ) {
  navigate("/login");
}

  }, [token, navigate]);

  // Apply saved theme to HTML tag
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  return (
    <div className="relative min-h-screen w-full">
      <Navbar isLoggedIn={!!token} setToken={setToken} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/forgot" element={<ForgotPage />} />
        <Route path="/reset/:token" element={<ResetPage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/note/:id" element={<NoteDetailPage />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
};

export default App;
