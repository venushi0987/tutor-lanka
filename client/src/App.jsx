import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

import Home from './pages/Home';
import Explore from './pages/Explore';
import ClassDetail from './pages/ClassDetail';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import NotFound from './pages/NotFound';

<<<<<<< Updated upstream
// NEW PAGES IMPORTS
import SearchClasses from './pages/Student/SearchClasses'; // 🎓 Student: Search
import AddClass from './pages/Tutor/AddClass';             // 👨‍🏫 Tutor: Add Class
import AddHall from './pages/Hall/AddHall';               // 🏫 Hall: Add Hall
import UserProfile from './pages/Profile/UserProfile';     // 👤 Common: Profile Page
=======
// Profile
const UserProfile = lazy(() => import('./pages/Profile/UserProfile'));
>>>>>>> Stashed changes

// Student Pages
const StudentDashboard = lazy(() => import('./pages/Dashboard/StudentDashboard'));
const SearchClasses = lazy(() => import('./pages/Student/SearchClasses'));

// Tutor Pages
const TutorDashboard = lazy(() => import('./pages/Dashboard/TutorDashboard'));
const AddClass = lazy(() => import('./pages/Tutor/AddClass'));

// Hall Owner Pages
const HallDashboard = lazy(() => import('./pages/Hall/HallDashboard'));
const AddHall = lazy(() => import('./pages/Hall/AddHall'));

// Admin Pages
const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard'));
const UserManagement = lazy(() => import('./pages/Admin/UserManagement'));
const TutorVerification = lazy(() => import('./pages/Admin/TutorVerification'));


const App = () => {
  return (
    <Router>
      <div className="w-full min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased">
        
        {/* Global Navigation Bar - Renders on EVERY single page */}
        <Navbar />

        {/* Dynamic Pages Area */}
        <main className="flex-grow pt-16"> 
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/class/:id" element={<ClassDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

<<<<<<< Updated upstream
            {/* =========================================================
                🔓 UNPROTECTED DASHBOARDS & PAGES (Open for Testing)
               ========================================================= */}

            {/* 1. Admin Area */}
            <Route path="/dashboard/admin" element={<AdminDashboard />} />
=======
              {/* 1. Admin Area */}
              <Route path="/dashboard/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/verifications" element={<TutorVerification />} />
>>>>>>> Stashed changes

            {/* 2. Student Area */}
            <Route path="/dashboard/student" element={<StudentDashboard />} />
            <Route path="/search-classes" element={<SearchClasses />} />

            {/* 3. Tutor Area */}
            <Route path="/dashboard/tutor" element={<TutorDashboard />} />
            <Route path="/add-class" element={<AddClass />} />

<<<<<<< Updated upstream
            {/* 4. Class Hall / Institute Owner Area */}
            <Route path="/dashboard/hall" element={<HallDashboard />} />
            <Route path="/add-hall" element={<AddHall />} />

            {/* 5. Common User Profile Route */}
            <Route path="/profile" element={<UserProfile />} />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
=======
              {/* 4. Hall Owner Area */}
              <Route path="/dashboard/hall" element={<HallDashboard />} />
              <Route path="/add-hall" element={<AddHall />} />

              {/* 5. Common Profile */}
              <Route path="/profile" element={<UserProfile />} />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
>>>>>>> Stashed changes
        </main>

        <Footer />

      </div>
    </Router>
  );
};

export default App;