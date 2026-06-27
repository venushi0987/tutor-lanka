import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';

// Lazy-loaded pages for better initial load and modern UX
const Home = lazy(() => import('./pages/Home'));
const Explore = lazy(() => import('./pages/Explore'));
const ClassDetail = lazy(() => import('./pages/ClassDetail'));
const Login = lazy(() => import('./pages/Auth/Login'));
const Register = lazy(() => import('./pages/Auth/Register'));
const NotFound = lazy(() => import('./pages/NotFound'));
const ForgotPassword = lazy(() => import('./pages/Auth/ForgotPassword'));

// NEW PAGES (lazy)
const SearchClasses = lazy(() => import('./pages/Student/SearchClasses'));
const MapSearch = lazy(() => import('./pages/Student/MapSearch'));
const AddClass = lazy(() => import('./pages/Tutor/AddClass'));
const TutorDashboard = lazy(() => import('./pages/Tutor/TutorDashboard'));
const AddHall = lazy(() => import('./pages/Hall/AddHall'));
const UserProfile = lazy(() => import('./pages/Profile/UserProfile'));
const InstituteDashboard = lazy(() => import('./pages/InstituteDashboard'));
const InstituteProfileEdit = lazy(() => import('./pages/InstituteProfileEdit'));
const InstituteClasses = lazy(() => import('./pages/Institute/InstituteClasses'));
const InstituteAddClass = lazy(() => import('./pages/Institute/InstituteAddClass'));
const InstitutePublicProfile = lazy(() => import('./pages/Institute/InstitutePublicProfile'));
const Branches = lazy(() => import('./pages/Institute/Branches'));
const InstituteLogin = lazy(() => import('./pages/Auth/InstituteLogin'));

// Admin Pages (lazy)
const AdminLogin = lazy(() => import('./pages/Auth/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard'));
const UserManagement = lazy(() => import('./pages/Admin/UserManagement'));
const TutorVerification = lazy(() => import('./pages/Admin/TutorVerification'));
const ReportsManagement = lazy(() => import('./pages/Admin/ReportsManagement'));

// Placeholder dashboards for pages not yet implemented
const StudentDashboard = () => (
  <div className="p-10 text-center"><h1 className="text-2xl font-black text-[#1c0da1]">Student Dashboard</h1><p className="text-slate-400 text-sm mt-2">Coming Soon...</p></div>
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
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/unauthorized" element={<div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="text-center"><h1 className="text-2xl font-black text-red-600">Unauthorized</h1><p className="text-slate-400 text-sm mt-2">You do not have permission to access this page.</p></div></div>} />
              <Route path="/settings" element={<div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="text-center"><h1 className="text-2xl font-black text-[#1c0da1]">Settings</h1><p className="text-slate-400 text-sm mt-2">Coming Soon...</p></div></div>} />

              {/* =========================================================
                  🔓 UNPROTECTED DASHBOARDS & PAGES (Open for Testing)
                 ========================================================= */}

              {/* 1. Admin Area */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/dashboard/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/admin/users" element={<AdminRoute><UserManagement /></AdminRoute>} />
              <Route path="/admin/tutors/verify" element={<AdminRoute><TutorVerification /></AdminRoute>} />
              <Route path="/admin/reports" element={<AdminRoute><ReportsManagement /></AdminRoute>} />

              {/* 2. Student Area */}
              <Route path="/dashboard/student" element={<StudentDashboard />} />
              <Route path="/search-classes" element={<MapSearch />} />
              <Route path="/search-classes/list" element={<SearchClasses />} />

              {/* 3. Tutor Area */}
              <Route path="/dashboard/tutor" element={<TutorDashboard />} />
              <Route path="/add-class" element={<AddClass />} />
              <Route path="/tutor/profile/edit" element={<div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="text-center"><h1 className="text-2xl font-black text-[#1c0da1]">Edit Tutor Profile</h1><p className="text-slate-400 text-sm mt-2">Coming Soon...</p></div></div>} />

              {/* 4. Class Hall / Institute Owner Area */}
              <Route path="/dashboard/hall" element={<HallDashboard />} />
              <Route path="/add-hall" element={<AddHall />} />

              {/* Institute Portal */}
              <Route path="/institute/login" element={<InstituteLogin />} />
              <Route path="/institute/:slug" element={<InstitutePublicProfile />} />
              <Route path="/dashboard/institute" element={<ProtectedRoute allowedRoles={["institute"]}><InstituteDashboard /></ProtectedRoute>} />
              <Route path="/dashboard/institute/profile" element={<ProtectedRoute allowedRoles={["institute"]}><InstituteProfileEdit /></ProtectedRoute>} />
              <Route path="/dashboard/institute/classes" element={<ProtectedRoute allowedRoles={["institute"]}><InstituteClasses /></ProtectedRoute>} />
              <Route path="/dashboard/institute/add-class" element={<ProtectedRoute allowedRoles={["institute"]}><InstituteAddClass /></ProtectedRoute>} />
              <Route path="/dashboard/institute/branches" element={<ProtectedRoute allowedRoles={["institute"]}><Branches /></ProtectedRoute>} />
              <Route path="/edit-class/:id" element={<div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="text-center"><h1 className="text-2xl font-black text-[#1c0da1]">Edit Class</h1><p className="text-slate-400 text-sm mt-2">Coming Soon...</p></div></div>} />

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