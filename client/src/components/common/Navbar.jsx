import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap, Menu, X, ChevronDown, User, LayoutDashboard,
  Settings, LogOut, Shield, BookOpen, Home, Compass, Building2
} from 'lucide-react';
import { logout } from '../../store/slices/authSlice';
import { initSocket } from '../../services/socket';
import NotificationsDropdown from './NotificationsDropdown';
import toast from 'react-hot-toast';

const roleColors = {
  student:   'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  tutor:     'bg-blue-500/20 text-blue-300 border-blue-500/30',
  admin:     'bg-red-500/20 text-red-300 border-red-500/30',
  institute: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
};

const dashboardPaths = {
  student:   '/dashboard/student',
  tutor:     '/dashboard/tutor',
  institute: '/dashboard/institute',
  admin:     '/dashboard/admin',
};

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useSelector(state => state.auth);

  const [scrolled, setScrolled]               = useState(false);
  const [mobileOpen, setMobileOpen]           = useState(false);
  const [dropdownOpen, setDropdownOpen]       = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dropdownRef      = useRef(null);
  const notificationsRef = useRef(null);
  const unreadCount      = useSelector(s => s.notifications.unreadCount);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))         setDropdownOpen(false);
      if (notificationsRef.current && !notificationsRef.current.contains(e.target)) setNotificationsOpen(false);
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

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

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

  const getInitials = (name) =>
    name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  const isActive = (href) => location.pathname === href;

  const navLinks = [
    { label: 'Home',     action: () => scrollToSection('home-section'), icon: Home    },
    { label: 'Explore',  href: '/explore',                               icon: Compass },
    { label: 'About',    action: () => scrollToSection('about-section'), icon: BookOpen },
  ];

  /* ── nav bar style based on scroll / page ── */
  const navStyle = scrolled
    ? 'bg-dark-950/90 backdrop-blur-xl border-b border-white/8 shadow-elevation-3'
    : 'bg-dark-950/60 backdrop-blur-md border-b border-white/5';

  return (
    <>
      {/* Skip link for keyboard users */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:px-4 focus:py-2 focus:bg-white focus:text-slate-900 focus:rounded-md focus:fixed focus:top-4 focus:left-4 focus:z-[9999]">
        Skip to content
      </a>

      <nav
        role="navigation"
        aria-label="Main navigation"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navStyle}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* ── Logo ── */}
            <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0" id="navbar-logo">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-700 to-primary-500 rounded-xl flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-all duration-300 group-hover:scale-105">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-black text-white text-base tracking-tight">EduConnect</span>
                <span className="text-[10px] font-bold text-gold-400 tracking-[0.2em] uppercase -mt-0.5">Sri Lanka</span>
              </div>
            </Link>

            {/* ── Desktop Nav Links ── */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(({ label, href, action, icon: Icon }) => {
                const active = href ? isActive(href) : false;
                return href ? (
                  <Link
                    key={label}
                    to={href}
                    id={`nav-link-${label.toLowerCase()}`}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      active
                        ? 'text-primary-300 bg-primary-500/10 border border-primary-500/20'
                        : 'text-slate-300 hover:text-white hover:bg-white/6'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </Link>
                ) : (
                  <button
                    key={label}
                    onClick={action}
                    id={`nav-btn-${label.toLowerCase().replace(/\s/g, '-')}`}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/6 transition-all duration-200"
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                );
              })}
            </div>

            {/* ── Right Side ── */}
            <div className="flex items-center gap-3">
              {!isAuthenticated ? (
                <div className="hidden md:flex items-center gap-2">
                  <Link
                    to="/login"
                    id="nav-signin-btn"
                    className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/6 rounded-xl transition-all"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    id="nav-register-btn"
                    className="btn-primary btn-sm"
                  >
                    Register
                  </Link>
                  <Link
                    to="/institute/login"
                    id="nav-institute-btn"
                    className="px-3 py-2 text-sm font-semibold text-slate-400 hover:text-white hover:bg-white/6 rounded-xl transition-all flex items-center gap-1.5 border border-white/10"
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    Institute
                  </Link>
                </div>
              ) : (
                <div className="relative flex items-center" ref={dropdownRef}>
                  {/* Notifications Bell */}
                  <div className="relative mr-2" ref={notificationsRef}>
                    <button
                      aria-label="Notifications"
                      id="nav-notifications-btn"
                      onClick={() => setNotificationsOpen(!notificationsOpen)}
                      className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/8 transition-all relative"
                    >
                      <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                      {unreadCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[9px] font-black min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center">
                          {unreadCount}
                        </span>
                      )}
                    </button>
                    {notificationsOpen && (
                      <div className="absolute right-0 mt-2 z-50">
                        <NotificationsDropdown />
                      </div>
                    )}
                  </div>

                  {/* User button */}
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    aria-haspopup="menu"
                    aria-expanded={dropdownOpen}
                    id="nav-user-menu-btn"
                    className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl hover:bg-white/8 transition-all group border border-transparent hover:border-white/10"
                  >
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-700 to-primary-500 flex items-center justify-center text-white text-xs font-black shadow-glow overflow-hidden">
                      {user?.avatar
                        ? <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-xl object-cover" />
                        : getInitials(user?.name)
                      }
                    </div>
                    <div className="hidden md:flex flex-col items-start leading-none">
                      <span className="text-sm font-bold text-white">{user?.name?.split(' ')[0]}</span>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border mt-0.5 capitalize ${roleColors[user?.role] || 'bg-slate-700 text-slate-300 border-slate-600'}`}>
                        {user?.role}
                      </span>
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform hidden md:block ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className="absolute right-0 top-full mt-2 w-56 glass-dark rounded-2xl overflow-hidden border border-white/10 shadow-elevation-3 z-50"
                        style={{ top: '100%' }}
                      >
                        {/* User info header */}
                        <div className="px-4 py-3 border-b border-white/8 bg-gradient-to-br from-primary-800/30 to-transparent">
                          <p className="text-sm font-black text-white truncate">{user?.name}</p>
                          <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                        </div>

                        <div className="py-1.5">
                          <DropdownItem icon={User}           label="My Profile"  onClick={() => navigate('/profile')} id="dropdown-profile" />
                          <DropdownItem icon={LayoutDashboard} label="Dashboard"  onClick={() => navigate(dashboardPaths[user?.role] || '/')} id="dropdown-dashboard" />
                          <DropdownItem icon={Settings}       label="Settings"    onClick={() => navigate('/settings')} id="dropdown-settings" />
                        </div>

                        <div className="border-t border-white/8 py-1.5">
                          <button
                            onClick={handleLogout}
                            id="dropdown-logout"
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
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

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle mobile menu"
                aria-expanded={mobileOpen}
                id="nav-hamburger-btn"
                className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/8 transition-all border border-transparent hover:border-white/10"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Mobile Full-Screen Menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-dark-950/80 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 250 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 md:hidden flex flex-col"
              style={{ background: 'linear-gradient(160deg, #0c1a3d 0%, #060d24 100%)' }}
            >
              {/* Panel header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-700 to-primary-500 rounded-xl flex items-center justify-center shadow-glow">
                    <GraduationCap className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-black text-white text-sm tracking-tight">EduConnect</span>
                </div>
                <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/8 transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Nav Links */}
              <div className="flex-1 overflow-y-auto px-4 py-5 space-y-1">
                {navLinks.map(({ label, href, action, icon: Icon }) => (
                  href ? (
                    <Link
                      key={label}
                      to={href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                        isActive(href)
                          ? 'text-primary-300 bg-primary-500/10 border border-primary-500/20'
                          : 'text-slate-300 hover:text-white hover:bg-white/6'
                      }`}
                      onClick={() => setMobileOpen(false)}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </Link>
                  ) : (
                    <button
                      key={label}
                      onClick={action}
                      className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/6 transition-all"
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </button>
                  )
                ))}

                {/* Divider */}
                <div className="divider-gradient my-4" />

                {/* Auth actions */}
                {!isAuthenticated ? (
                  <div className="space-y-2 pt-2">
                    <Link
                      to="/login"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/6 transition-all border border-white/10"
                      onClick={() => setMobileOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-white transition-all text-center"
                      style={{ background: 'linear-gradient(135deg, #1e40af, #2563eb)' }}
                      onClick={() => setMobileOpen(false)}
                    >
                      Create Account
                    </Link>
                    <Link
                      to="/institute/login"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-white/6 transition-all border border-white/8"
                      onClick={() => setMobileOpen(false)}
                    >
                      <Building2 className="w-4 h-4" />
                      Institute Login
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-1 pt-2">
                    {/* User card */}
                    <div className="glass-card rounded-2xl px-4 py-3 mb-3 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-700 to-primary-500 flex items-center justify-center text-white text-xs font-black shadow-glow overflow-hidden flex-shrink-0">
                        {user?.avatar ? <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-xl object-cover" /> : getInitials(user?.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-black text-white truncate">{user?.name}</p>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border capitalize ${roleColors[user?.role] || 'bg-slate-700 text-slate-300 border-slate-600'}`}>
                          {user?.role}
                        </span>
                      </div>
                    </div>

                    {[
                      { icon: User,            label: 'My Profile',  action: () => { navigate('/profile'); setMobileOpen(false); } },
                      { icon: LayoutDashboard, label: 'Dashboard',   action: () => { navigate(dashboardPaths[user?.role] || '/'); setMobileOpen(false); } },
                      { icon: Settings,        label: 'Settings',    action: () => { navigate('/settings'); setMobileOpen(false); } },
                    ].map(({ icon: Icon, label, action }) => (
                      <button
                        key={label}
                        onClick={action}
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/6 transition-all"
                      >
                        <Icon className="w-4 h-4" />
                        {label}
                      </button>
                    ))}

                    <div className="divider-gradient my-2" />

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

const DropdownItem = ({ icon: Icon, label, onClick, id }) => (
  <button
    onClick={onClick}
    id={id}
    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-semibold text-slate-300 hover:bg-white/6 hover:text-white transition-colors"
  >
    <Icon className="w-4 h-4 text-slate-400" />
    {label}
  </button>
);

export default Navbar;