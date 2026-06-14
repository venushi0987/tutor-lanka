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
  admin: 'bg-red-100 text-red-700 border-red-200',
};

const dashboardPaths = {
  student: '/dashboard/student',
  tutor: '/dashboard/tutor',
  admin: '/dashboard/admin',
};

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useSelector(state => state.auth);

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/');
  };

  const scrollToSection = (sectionId) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileOpen(false);
  };

  const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  const navLinks = [
    { label: 'Home', action: () => scrollToSection('home-section'), icon: Home },
    { label: 'Explore', href: '/explore', icon: Compass },
    { label: 'About Us', action: () => scrollToSection('about-section'), icon: BookOpen },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-xl shadow-lg shadow-slate-200/50 border-b border-slate-200/50'
          : 'bg-white/80 backdrop-blur-md'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 bg-gradient-to-br from-[#1c0da1] to-[#3d2bc4] rounded-xl flex items-center justify-center shadow-md shadow-[#1c0da1]/30 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-black text-[#1c0da1] text-base tracking-tight">EduConnect</span>
                <span className="text-[10px] font-semibold text-[#d9cb00] tracking-widest uppercase -mt-0.5">Sri Lanka</span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(({ label, href, action, icon: Icon }) => (
                href ? (
                  <Link
                    key={label}
                    to={href}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      location.pathname === href
                        ? 'bg-[#1c0da1]/10 text-[#1c0da1]'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </Link>
                ) : (
                  <button
                    key={label}
                    onClick={action}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all"
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                )
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {!isAuthenticated ? (
                <div className="hidden md:flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-semibold text-[#1c0da1] hover:bg-[#1c0da1]/5 rounded-xl transition-all"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-5 py-2 text-sm font-bold bg-[#1c0da1] text-white rounded-xl hover:bg-[#0a044a] transition-all shadow-md shadow-[#1c0da1]/30"
                  >
                    Register
                  </Link>
                </div>
              ) : (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-xl hover:bg-slate-100 transition-all group"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1c0da1] to-[#3d2bc4] flex items-center justify-center text-white text-xs font-bold shadow-md">
                      {user?.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        getInitials(user?.name)
                      )}
                    </div>
                    <div className="hidden md:flex flex-col items-start leading-none">
                      <span className="text-sm font-bold text-slate-800">{user?.name?.split(' ')[0]}</span>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border mt-0.5 capitalize ${roleColors[user?.role] || 'bg-slate-100 text-slate-600'}`}>
                        {user?.role}
                      </span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform hidden md:block ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden z-50"
                      >
                        <div className="px-4 py-3 bg-gradient-to-br from-[#1c0da1]/5 to-transparent border-b border-slate-100">
                          <p className="text-sm font-bold text-slate-900">{user?.name}</p>
                          <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                        </div>
                        <div className="py-1.5">
                          <DropdownItem icon={User} label="My Profile" onClick={() => navigate('/profile')} />
                          <DropdownItem
                            icon={LayoutDashboard}
                            label="Dashboard"
                            onClick={() => navigate(dashboardPaths[user?.role] || '/')}
                          />
                          <DropdownItem icon={Settings} label="Settings" onClick={() => navigate('/settings')} />
                        </div>
                        <div className="border-t border-slate-100 py-1.5">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Mobile Hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-xl hover:bg-slate-100 transition-all text-slate-600"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-xl md:hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map(({ label, href, action, icon: Icon }) => (
                href ? (
                  <Link
                    key={label}
                    to={href}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-[#1c0da1]/5 hover:text-[#1c0da1] transition-all"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Icon className="w-4 h-4" /> {label}
                  </Link>
                ) : (
                  <button
                    key={label}
                    onClick={action}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-[#1c0da1]/5 hover:text-[#1c0da1] transition-all"
                  >
                    <Icon className="w-4 h-4" /> {label}
                  </button>
                )
              ))}

              <div className="border-t border-slate-100 pt-3 mt-3 space-y-1">
                {!isAuthenticated ? (
                  <>
                    <Link to="/login" className="block px-4 py-3 rounded-xl text-sm font-semibold text-[#1c0da1] hover:bg-[#1c0da1]/5 transition-all" onClick={() => setMobileOpen(false)}>
                      Sign In
                    </Link>
                    <Link to="/register" className="block px-4 py-3 rounded-xl text-sm font-bold bg-[#1c0da1] text-white hover:bg-[#0a044a] transition-all text-center" onClick={() => setMobileOpen(false)}>
                      Register
                    </Link>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1c0da1] to-[#3d2bc4] flex items-center justify-center text-white text-xs font-bold">
                        {getInitials(user?.name)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{user?.name}</p>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border capitalize ${roleColors[user?.role]}`}>{user?.role}</span>
                      </div>
                    </div>
                    <button onClick={() => { navigate('/profile'); setMobileOpen(false); }} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-all">
                      <User className="w-4 h-4" /> My Profile
                    </button>
                    <button onClick={() => { navigate(dashboardPaths[user?.role] || '/'); setMobileOpen(false); }} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-all">
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </button>
                    <button onClick={() => { navigate('/settings'); setMobileOpen(false); }} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-all">
                      <Settings className="w-4 h-4" /> Settings
                    </button>
                    <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-all">
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const DropdownItem = ({ icon: Icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#1c0da1] transition-colors"
  >
    <Icon className="w-4 h-4" />
    {label}
  </button>
);

export default Navbar;