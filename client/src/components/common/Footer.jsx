import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

const Footer = () => {
  const year = new Date().getFullYear();

  const links = {
    Platform: [
      { label: 'Find Classes',    to: '/explore' },
      { label: 'Become a Tutor', to: '/register' },
      { label: 'Map Search',     to: '/search-classes' },
    ],
    'For Tutors': [
      { label: 'Add a Class',    to: '/add-class' },
      { label: 'Tutor Dashboard', to: '/dashboard/tutor' },
    ],
    Support: [
      { label: 'About Us',        to: '/#about-section' },
      { label: 'Contact',         to: '/#about-section' },
    ],
  };

  const socials = [
    {
      label: 'Facebook',
      href:  'https://facebook.com',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.8z" />
        </svg>
      ),
    },
    {
      label: 'YouTube',
      href:  'https://youtube.com',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
    {
      label: 'Instagram',
      href:  'https://instagram.com',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
  ];

  return (
    <footer
      className="relative overflow-hidden border-t border-white/6"
      style={{ background: 'linear-gradient(180deg, #060d24 0%, #030a1a 100%)' }}
    >
      {/* Background decorations */}
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(37,99,235,0.08) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">

          {/* Brand col (spans 2) */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-700 to-primary-500 rounded-xl flex items-center justify-center shadow-glow">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-black text-white text-lg tracking-tight">EduConnect</span>
                <span className="text-[10px] font-bold text-gold-400 tracking-[0.2em] uppercase -mt-0.5">Sri Lanka</span>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Sri Lanka's premium educational network connecting students with verified
              expert tutors and institutes across all 25 districts.
            </p>

            {/* Social icons */}
            <div className="flex gap-3 mt-6">
              {socials.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`EduConnect on ${label}`}
                  className="w-9 h-9 glass-card rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:border-primary-500/30 transition-all hover:-translate-y-0.5"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 className="text-white font-black text-sm mb-4 uppercase tracking-widest">{title}</h4>
              <ul className="space-y-3">
                {items.map(({ label, to }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="text-slate-400 text-sm hover:text-primary-300 transition-colors flex items-center gap-1.5 group"
                    >
                      <span className="w-1 h-1 rounded-full bg-primary-600 group-hover:bg-primary-400 transition-colors" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Divider ── */}
        <div className="divider-gradient mb-6" />

        {/* ── Bottom bar ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {year} EduConnect Sri Lanka. All rights reserved.</p>
          <div className="flex items-center gap-1.5">
            <span>Made with</span>
            <span className="text-red-400 text-sm">❤️</span>
            <span>in Sri Lanka 🇱🇰</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;