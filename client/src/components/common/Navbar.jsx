import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';import { GraduationCap, Menu, X, ChevronDown, User, LayoutDashboard,
  Settings, LogOut, Shield, BookOpen, Home, Compass, Building2 } from 'lucide-react';
import { logout } from '../../store/slices/authSlice';
import { initSocket } from '../../services/socket';
import NotificationsDropdown from './NotificationsDropdown';
import toast from 'react-hot-toast';

const roleColors = {
  student: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  tutor: 'bg-blue-100 text-blue-700 border-blue-200',
  admin: 'bg-red-100 text-red-700 border-red-200',
};

const dashboardPaths = {
  student: '/dashboard/student',
  tutor: '/dashboard/tutor',
  institute: '/dashboard/institute',
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
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null);
  const unreadCount = useSelector(s => s.notifications.unreadCount);

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
      if (notificationsRef.current && !notificationsRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
    setNotificationsOpen(false);
  }, [location.pathname]);

  // initialize socket when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const s = initSocket();
      return () => { if (s) s.disconnect(); };
    }
  }, [isAuthenticated]);

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
      {/* Skip link for keyboard users */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:sr-only focus:px-4 focus:py-2 focus:bg-white focus:text-slate-900 focus:rounded-md">Skip to content</a>
      <nav role="navigation" aria-label="Main navigation" className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-xl shadow-lg shadow-slate-200/50 border-b border-slate-200/50'
          : 'bg-white/80 backdrop-blur-md'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 bg-gradient-to-br from-[#1e40af] to-[#2563eb] rounded-xl flex items-center justify-center shadow-md shadow-[#1e40af]/30 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-black text-[#1e40af] text-base tracking-tight">EduConnect</span>
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
                        ? 'bg-[#1e40af]/10 text-[#1e40af]'
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
                    className="px-4 py-2 text-sm font-semibold text-[#1e40af] hover:bg-[#1e40af]/5 rounded-xl transition-all"
                  >
                    Sign In
                  </Link>          <Link to="/register" className="px-5 py-2 text-sm font-bold bg-[#1e40af] text-white rounded-xl hover:bg-[#0c1a3d] transition-all shadow-md shadow-[#1e40af]/30"
                    >
                      Register
                    </Link>
                    <Link
                      to="/institute/login"
                      className="px-4 py-2 text-sm font-semibold text-[#1e40af] hover:bg-[#1e40af]/5 rounded-xl transition-all flex items-center gap-1.5"
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      Institute
                    </Link>
                </div>
              ) : (
                <div className="relative flex items-center" ref={dropdownRef}>
                  {/* Notifications bell */}
                  <div className="relative mr-3">
                    <button aria-label="Notifications" onClick={() => setNotificationsOpen(!notificationsOpen)} className="p-2 rounded-xl hover:bg-slate-100">
                      <svg className="w-5 h-5 text-slate-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                      {/* badge */}
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{unreadCount}</span>
                      )}
                    </button>
                    {/* notifications dropdown */}
                    {notificationsOpen && <div ref={notificationsRef} className="absolute right-0 mt-2 z-50"><NotificationsDropdown /></div>}
                  </div>

                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    aria-haspopup="menu"
                    aria-expanded={dropdownOpen}
                    className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-xl hover:bg-slate-100 transition-all group focus:outline-none focus:ring-2 focus:ring-primary-400"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1e40af] to-[#2563eb] flex items-center justify-center text-white text-xs font-bold shadow-md">
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
                        <div className="px-4 py-3 bg-gradient-to-br from-[#1e40af]/5 to-transparent border-b border-slate-100">
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
                aria-label="Toggle menu"
                aria-expanded={mobileOpen}
                className="md:hidden p-2 rounded-xl hover:bg-slate-100 transition-all text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-400"
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
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-[#1e40af]/5 hover:text-[#1e40af] transition-all"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Icon className="w-4 h-4" /> {label}
                  </Link>
                ) : (
                  <button
                    key={label}
                    onClick={action}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-[#1e40af]/5 hover:text-[#1e40af] transition-all"
                  >
                    <Icon className="w-4 h-4" /> {label}
                  </button>
                )
              ))}

              <div className="border-t border-slate-100 pt-3 mt-3 space-y-1">
                {!isAuthenticated ? (
                  <>
                    <Link to="/login" className="block px-4 py-3 rounded-xl text-sm font-semibold text-[#1e40af] hover:bg-[#1e40af]/5 transition-all" onClick={() => setMobileOpen(false)}>
                      Sign In
                    </Link>
                    <Link to="/register" className="block px-4 py-3 rounded-xl text-sm font-bold bg-[#1e40af] text-white hover:bg-[#0c1a3d] transition-all text-center" onClick={() => setMobileOpen(false)}>
                      Register
                    </Link>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1e40af] to-[#2563eb] flex items-center justify-center text-white text-xs font-bold">
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
    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#1e40af] transition-colors"
  >
    <Icon className="w-4 h-4" />
    {label}
  </button>
);

export default Navbar;