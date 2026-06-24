import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

// Lazy-loaded pages for better initial load and modern UX
const Home = lazy(() => import('./pages/Home'));
const Explore = lazy(() => import('./pages/Explore'));
const ClassDetail = lazy(() => import('./pages/ClassDetail'));
const Login = lazy(() => import('./pages/Auth/Login'));
const Register = lazy(() => import('./pages/Auth/Register'));
const NotFound = lazy(() => import('./pages/NotFound'));

// NEW PAGES (lazy)
const SearchClasses = lazy(() => import('./pages/Student/SearchClasses'));
const AddClass = lazy(() => import('./pages/Tutor/AddClass'));
const AddHall = lazy(() => import('./pages/Hall/AddHall'));
const UserProfile = lazy(() => import('./pages/Profile/UserProfile'));
const InstituteDashboard = lazy(() => import('./pages/InstituteDashboard'));
const InstituteProfileEdit = lazy(() => import('./pages/InstituteProfileEdit'));
const InstituteClasses = lazy(() => import('./pages/Institute/InstituteClasses'));
const Branches = lazy(() => import('./pages/Institute/Branches'));
const MapSearch = lazy(() => import('./pages/Student/MapSearch'));

// =========================================================
// 🛠️ TEMPORARY DASHBOARD PLACEHOLDERS (To prevent Vite import errors)
// =========================================================
const AdminDashboard = () => (
  <div className="p-10 text-center"><h1 className="text-2xl font-black text-[#1c0da1]">Admin Dashboard</h1><p className="text-slate-400 text-sm mt-2">Coming Soon...</p></div>
);
const StudentDashboard = () => (
  <div className="p-10 text-center"><h1 className="text-2xl font-black text-[#1c0da1]">Student Dashboard</h1><p className="text-slate-400 text-sm mt-2">Coming Soon...</p></div>
);
const TutorDashboard = () => (
  <div className="p-10 text-center"><h1 className="text-2xl font-black text-[#1c0da1]">Tutor Dashboard</h1><p className="text-slate-400 text-sm mt-2">Coming Soon...</p></div>
);
const HallDashboard = () => (
  <div className="p-10 text-center"><h1 className="text-2xl font-black text-[#1c0da1]">Hall Owner Dashboard</h1><p className="text-slate-400 text-sm mt-2">Coming Soon...</p></div>
);

const App = () => {
  return (
    <Router>
      <div className="w-full min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased">
        
        {/* Global Navigation Bar - Renders on EVERY single page */}
        <Navbar />

        {/* Dynamic Pages Area */}
        <main className="flex-grow pt-16"> 
          <Suspense fallback={
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-primary-400 border-t-transparent rounded-full animate-spin" />
            </div>
          }>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/class/:id" element={<ClassDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* =========================================================
                  🔓 UNPROTECTED DASHBOARDS & PAGES (Open for Testing)
                 ========================================================= */}

              {/* 1. Admin Area */}
              <Route path="/dashboard/admin" element={<AdminDashboard />} />

              {/* 2. Student Area */}
              <Route path="/dashboard/student" element={<StudentDashboard />} />
              <Route path="/search-classes" element={<MapSearch />} />

              {/* 3. Tutor Area */}
              <Route path="/dashboard/tutor" element={<TutorDashboard />} />
              <Route path="/add-class" element={<AddClass />} />

              {/* 4. Class Hall / Institute Owner Area */}
              <Route path="/dashboard/hall" element={<HallDashboard />} />
              <Route path="/add-hall" element={<AddHall />} />

              {/* Institute area */}
              <Route path="/dashboard/institute" element={<ProtectedRoute allowedRoles={["institute"]}><InstituteDashboard /></ProtectedRoute>} />
              <Route path="/dashboard/institute/profile" element={<ProtectedRoute allowedRoles={["institute"]}><InstituteProfileEdit /></ProtectedRoute>} />
              <Route path="/dashboard/institute/classes" element={<ProtectedRoute allowedRoles={["institute"]}><InstituteClasses /></ProtectedRoute>} />
              <Route path="/dashboard/institute/branches" element={<ProtectedRoute allowedRoles={["institute"]}><Branches /></ProtectedRoute>} />
              <Route path="/search-classes" element={<MapSearch />} />

              {/* 5. Common User Profile Route */}
              <Route path="/profile" element={<UserProfile />} />

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>

        <Footer />

      </div>
    </Router>
  );
};

export default App;