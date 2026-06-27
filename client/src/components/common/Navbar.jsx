import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap, Menu, X, ChevronDown, User, LayoutDashboard,
  Settings, LogOut, Shield, BookOpen, Home, Compass
} from 'lucide-react';
import { logout } from '../../store/slices/authSlice';
import toast from 'react-hot-toast';

const roleColors = {
  student: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  tutor: 'bg-blue-100 text-blue-700 border-blue-200',
  hall_owner: 'bg-amber-100 text-amber-700 border-amber-200',
  admin: 'bg-red-100 text-red-700 border-red-200',
};

const dashboardPaths = {
  student: '/dashboard/student',
  tutor: '/dashboard/tutor',
  hall_owner: '/dashboard/hall',
  admin: '/dashboard/admin',
};

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);

  // 1. 👈 මෙන්න මෙතනින් Redux state එකෙන් isAuthenticated සහ user ලස්සනට ගත්තා
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Intelligent navigation function for smooth scroll
  const handleNavClick = (sectionId) => {
    if (location.pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element) {
        window.scrollTo({
          top: element.offsetTop - 64,
          behavior: 'smooth',
        });
      }
    } else {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          window.scrollTo({
            top: element.offsetTop - 64,
            behavior: 'smooth',
          });
        }
      }, 150);
    }
  };

  const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  // 2. 👈 scrollToSection වෙනුවට handleNavClick පාවිච්චි වන විදිහට හැදුවා
  const navLinks = [
    { label: 'Home', action: () => { navigate('/'); window.scrollTo({ top: 0, behavior: 'smooth' }); }, icon: Home },
    { label: 'Explore', href: '/explore', icon: Compass },
    { label: 'About Us', action: () => handleNavClick('about-section'), icon: BookOpen },
  ];

  if (isAuthenticated && user) {
    navLinks.push({
      label: 'Dashboard',
      href: dashboardPaths[user.role] || '/',
      icon: LayoutDashboard,
    });
  }

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 z-50 px-6 flex items-center justify-between">
      {/* Brand Logo */}
      <div 
        onClick={() => { navigate('/'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
        className="text-xl font-black text-[#1c0da1] tracking-tight cursor-pointer"
      >
        🎓 Tutor-Lanka
      </div>

      {/* Navigation Options and Action Buttons */}
      <div className="flex items-center gap-12">
        {/* Section Scroll Buttons */}
        <div className="hidden md:flex items-center gap-8 font-semibold text-sm text-slate-600">
          <button onClick={() => { navigate('/'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-[#1c0da1] transition-colors">Home</button>
          <button onClick={() => navigate('/explore')} className="hover:text-[#1c0da1] transition-colors">Explore</button>
          <button onClick={() => handleNavClick('about-section')} className="hover:text-[#1c0da1] transition-colors">About Us</button>
          <button onClick={() => handleNavClick('reviews-section')} className="hover:text-[#1c0da1] transition-colors">Reviews</button>
        </div>

        {/* Authentication Routes Trigger */}
        <div className="flex items-center gap-4 text-sm font-semibold">
          {isAuthenticated && user ? (
            // 3. 👈 User ලොග් වෙලා ඉන්නවා නම් එයාගේ Initials පෙන්වන කොටස
            <div className="flex items-center gap-3 relative" ref={menuRef}>
              <span className={`px-2 py-1 text-xs font-bold border rounded-lg uppercase ${roleColors[user.role] || ''}`}>
                {user.role}
              </span>
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-9 h-9 rounded-full bg-[#1c0da1] text-white flex items-center justify-center cursor-pointer hover:opacity-90 shadow-sm transition-all"
                title={user.name}
              >
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  getInitials(user.name)
                )}
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 top-12 bg-white border border-slate-200 rounded-xl shadow-xl z-50 w-48 py-2"
                >
                  <button
                    onClick={() => {
                      navigate('/profile');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-slate-50 flex items-center gap-3 text-slate-700 font-semibold text-sm transition-colors"
                  >
                    <User size={16} /> View Profile
                  </button>
                  <button
                    onClick={() => {
                      navigate(dashboardPaths[user.role] || '/');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-slate-50 flex items-center gap-3 text-slate-700 font-semibold text-sm transition-colors"
                  >
                    <LayoutDashboard size={16} /> Dashboard
                  </button>
                  <div className="border-t border-slate-100 my-1" />
                  <button
                    onClick={() => {
                      dispatch(logout());
                      setShowUserMenu(false);
                      toast.success('Logged out successfully');
                      navigate('/');
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-red-50 flex items-center gap-3 text-red-600 font-semibold text-sm transition-colors"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </motion.div>
              )}
            </div>
          ) : (
            // User ලොග් වෙලා නැත්නම් Sign In / Register පෙන්වන කොටස
            <>
              <button 
                onClick={() => navigate('/login')} 
                className="text-slate-600 hover:text-[#1c0da1] transition-colors px-3 py-2"
              >
                Sign In
              </button>
              <button 
                onClick={() => navigate('/register')} 
                className="bg-[#1c0da1] text-white px-4 py-2 rounded-xl hover:bg-[#d9cb00] transition-all shadow-md shadow-[#1c0da1]/10 text-center"
              >
                Register
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;