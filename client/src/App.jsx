import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setTheme } from "./store/slices/themeSlice";

// Pages
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import ClassDetail from "./pages/ClassDetail";
//import TutorProfile from "./pages/TutorProfile";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import TutorDashboard from "./pages/Dashboard/TutorDashboard";
import StudentDashboard from "./pages/Dashboard/StudentDashboard";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import NotFound from "./pages/NotFound";

// Components
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import ProtectedRoute from "./components/common/ProtectedRoute";

function App() {
  const dispatch = useDispatch();
  const { mode } = useSelector((state) => state.theme);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const saved = localStorage.getItem("educonnect_theme") || "dark";
    dispatch(setTheme(saved));
    if (saved === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [dispatch]);

  useEffect(() => {
    if (mode === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [mode]);

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 dark:bg-dark-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300">
        <Navbar />
        <main className="flex-grow pt-16">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/class/:id" element={<ClassDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes (Dashboard integration can be expanded later) */}
            <Route path="/tutor-dashboard" element={<TutorDashboard />} />
            <Route path="/student-dashboard" element={<StudentDashboard />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;