import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Facebook, Instagram, Youtube, Twitter, Heart, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 dark:bg-dark-950 text-slate-300">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
                <BookOpen size={18} className="text-white" />
              </div>
              <div>
                <span className="font-display font-bold text-lg text-white">EduConnect</span>
                <p className="text-xs text-primary-400 -mt-0.5">Sri Lanka</p>
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              Connecting students with the best tutors and tuition classes across Sri Lanka. Your journey to academic excellence starts here.
            </p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Youtube, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-primary-600 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200 hover:scale-110">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4">Platform</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Find Classes', href: '/explore' },
                { label: 'Find Tutors', href: '/explore?tab=tutors' },
                { label: 'Become a Tutor', href: '/register?role=tutor' },
                { label: 'For Students', href: '/register' },
                { label: 'Pricing', href: '#' },
              ].map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-slate-400 hover:text-primary-400 transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Subjects */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4">Popular Subjects</h4>
            <ul className="space-y-2.5">
              {['Mathematics', 'Science', 'English', 'ICT', 'Physics', 'Chemistry', 'Biology', 'Sinhala'].map((s) => (
                <li key={s}>
                  <Link to={`/explore?subject=${s}`} className="text-sm text-slate-400 hover:text-primary-400 transition-colors duration-200">
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2.5 text-sm text-slate-400">
                <MapPin size={15} className="text-primary-400 flex-shrink-0" />
                Colombo, Sri Lanka
              </li>
              <li className="flex items-center gap-2.5 text-sm text-slate-400">
                <Mail size={15} className="text-primary-400 flex-shrink-0" />
                hello@educonnect.lk
              </li>
              <li className="flex items-center gap-2.5 text-sm text-slate-400">
                <Phone size={15} className="text-primary-400 flex-shrink-0" />
                +94 11 234 5678
              </li>
            </ul>
            <div className="mt-6">
              <h5 className="text-sm font-medium text-white mb-2">Get the app</h5>
              <div className="flex gap-2">
                <div className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-400 border border-slate-700">Google Play</div>
                <div className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-400 border border-slate-700">App Store</div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} EduConnect Sri Lanka. All rights reserved.
          </p>
          <p className="text-sm text-slate-500 flex items-center gap-1">
            Made with <Heart size={13} className="text-red-400 fill-current" /> in Sri Lanka
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
              <a key={item} href="#" className="text-xs text-slate-500 hover:text-primary-400 transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
