import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Intelligent navigation function for smooth scroll
  const handleNavClick = (sectionId) => {
    if (location.pathname === '/') {
      // If already on Home page, just smooth scroll down
      const element = document.getElementById(sectionId);
      if (element) {
        window.scrollTo({
          top: element.offsetTop - 64,
          behavior: 'smooth',
        });
      }
    } else {
      // If on login or register page, go to home page first, then scroll
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

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 z-50 px-6 flex items-center justify-between">
      {/* Brand Logo - Goes directly to top of Home */}
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
          <button onClick={() => handleNavClick('explore-section')} className="hover:text-[#1c0da1] transition-colors">Explore</button>
          <button onClick={() => handleNavClick('about-section')} className="hover:text-[#1c0da1] transition-colors">About Us</button>
          <button onClick={() => handleNavClick('reviews-section')} className="hover:text-[#1c0da1] transition-colors">Reviews</button>
        </div>

        {/* Authentication Routes Trigger */}
        <div className="flex items-center gap-4 text-sm font-semibold">
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;