import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { Search, MapPin, BookOpen, Star, Users, TrendingUp, ArrowRight, Play, CheckCircle, ChevronRight, Zap, Shield, Globe } from 'lucide-react';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const STATS = [
  { value: '5,000+', label: 'Students', icon: Users, color: 'from-blue-500 to-cyan-500' },
  { value: '1,200+', label: 'Tutors', icon: BookOpen, color: 'from-violet-500 to-purple-500' },
  { value: '3,500+', label: 'Classes', icon: TrendingUp, color: 'from-orange-500 to-pink-500' },
  { value: '25+', label: 'Districts', icon: MapPin, color: 'from-emerald-500 to-teal-500' },
];

const FEATURED_TUTORS = [
  { id: '1', name: 'Dr. Kasun Perera', subject: 'Mathematics', rating: 4.9, students: 320, verified: true, avatar: 'https://i.pravatar.cc/150?img=12', district: 'Colombo', experience: 8 },
  { id: '2', name: 'Mrs. Dilani Silva', subject: 'Science', rating: 4.8, students: 210, verified: true, avatar: 'https://i.pravatar.cc/150?img=5', district: 'Kandy', experience: 6 },
  { id: '3', name: 'Mr. Nuwan Fernando', subject: 'ICT / Programming', rating: 4.9, students: 450, verified: true, avatar: 'https://i.pravatar.cc/150?img=15', district: 'Gampaha', experience: 10 },
  { id: '4', name: 'Ms. Tharaka Jayasinghe', subject: 'English', rating: 4.7, students: 185, verified: false, avatar: 'https://i.pravatar.cc/150?img=9', district: 'Colombo', experience: 4 },
];

const POPULAR_CLASSES = [
  { id: '1', title: 'A/L Combined Mathematics', tutor: 'Dr. Kasun Perera', subject: 'Mathematics', fee: 3500, rating: 4.9, reviews: 128, method: 'Hybrid', banner: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=200&fit=crop', grade: 'A/L' },
  { id: '2', title: 'O/L Science Mastery', tutor: 'Mrs. Dilani Silva', subject: 'Science', fee: 2800, rating: 4.8, reviews: 96, method: 'Physical', banner: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=200&fit=crop', grade: 'O/L' },
  { id: '3', title: 'Python & Web Development', tutor: 'Mr. Nuwan Fernando', subject: 'ICT', fee: 4200, rating: 4.9, reviews: 215, method: 'Online', banner: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=400&h=200&fit=crop', grade: 'A/L' },
  { id: '4', title: 'Grade 5 Scholarship Prep', tutor: 'Ms. Amaya Rathnayake', subject: 'All Subjects', fee: 2500, rating: 4.7, reviews: 64, method: 'Physical', banner: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=200&fit=crop', grade: 'Scholarship' },
  { id: '5', title: 'Advanced Physics', tutor: 'Mr. Ruwan Bandara', subject: 'Physics', fee: 3800, rating: 4.8, reviews: 102, method: 'Online', banner: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=400&h=200&fit=crop', grade: 'A/L' },
  { id: '6', title: 'English Literature & Grammar', tutor: 'Ms. Tharaka Jayasinghe', subject: 'English', fee: 2200, rating: 4.7, reviews: 78, method: 'Online', banner: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=200&fit=crop', grade: 'O/L' },
];

const SUBJECTS = ['Mathematics', 'Science', 'English', 'ICT', 'Physics', 'Chemistry', 'Biology', 'History', 'Commerce', 'Art'];
const DISTRICTS = ['Colombo', 'Gampaha', 'Kandy', 'Galle', 'Matara', 'Jaffna', 'Kurunegala', 'Ratnapura', 'Badulla', 'Anuradhapura'];
const METHODS = ['Online', 'Physical', 'Hybrid'];

// ─── Sub-components ───────────────────────────────────────────────────────────
const StarRating = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star key={s} size={12} className={s <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-slate-600'} />
    ))}
  </div>
);

const MethodBadge = ({ method }) => {
  const colors = { Online: 'badge-primary', Physical: 'badge-success', Hybrid: 'badge-warning' };
  return <span className={`badge ${colors[method] || 'badge-primary'}`}>{method}</span>;
};

const TutorCard = ({ tutor, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
    whileHover={{ y: -6 }}
    className="card card-hover p-5 group"
  >
    <Link to={`/tutor/${tutor.id}`}>
      <div className="flex items-start gap-4">
        <div className="relative flex-shrink-0">
          <img src={tutor.avatar} alt={tutor.name} className="w-16 h-16 rounded-2xl object-cover ring-2 ring-primary-100 dark:ring-primary-900/50 group-hover:ring-primary-400 transition-all duration-300" />
          {tutor.verified && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-800">
              <CheckCircle size={10} className="text-white fill-white" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {tutor.name}
            </h3>
            {tutor.verified && <span className="badge badge-verified flex-shrink-0 text-xs">✓ Verified</span>}
          </div>
          <p className="text-xs text-primary-600 dark:text-primary-400 font-medium mt-0.5">{tutor.subject}</p>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1">
              <StarRating rating={tutor.rating} />
              <span className="text-xs font-semibold text-amber-500">{tutor.rating}</span>
            </div>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">{tutor.students} students</span>
          </div>
          <div className="flex items-center gap-1 mt-1.5 text-xs text-slate-500 dark:text-slate-400">
            <MapPin size={11} />
            {tutor.district} • {tutor.experience} yrs exp
          </div>
        </div>
      </div>
    </Link>
  </motion.div>
);

const ClassCard = ({ cls, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.08 }}
    whileHover={{ y: -6 }}
    className="card card-hover overflow-hidden group flex flex-col"
  >
    <Link to={`/class/${cls.id}`} className="flex flex-col h-full">
      <div className="relative h-40 overflow-hidden">
        <img src={cls.banner} alt={cls.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-3 left-3 flex gap-1.5">
          <MethodBadge method={cls.method} />
          <span className="badge bg-black/50 text-white backdrop-blur-sm text-xs">{cls.grade}</span>
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-xs text-white/80">{cls.subject}</p>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-slate-900 dark:text-white text-sm leading-snug line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {cls.title}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">by {cls.tutor}</p>
        <div className="flex items-center gap-2 mt-2">
          <StarRating rating={cls.rating} />
          <span className="text-xs font-semibold text-amber-500">{cls.rating}</span>
          <span className="text-xs text-slate-400">({cls.reviews})</span>
        </div>
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100 dark:border-slate-700">
          <span className="font-bold text-primary-600 dark:text-primary-400">
            LKR {cls.fee.toLocaleString()}<span className="text-xs font-normal text-slate-400">/mo</span>
          </span>
          <span className="text-xs px-2.5 py-1 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium flex items-center gap-1">
            Enroll <ArrowRight size={10} />
          </span>
        </div>
      </div>
    </Link>
  </motion.div>
);

// ─── Main Home Page ───────────────────────────────────────────────────────────
const Home = () => {
  const navigate = useNavigate();
  const [subject, setSubject] = React.useState('');
  const [district, setDistrict] = React.useState('');
  const [method, setMethod] = React.useState('');

  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true });

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (subject) params.set('subject', subject);
    if (district) params.set('district', district);
    if (method) params.set('method', method);
    navigate(`/explore?${params.toString()}`);
  };

  return (
    <div className="page-enter">
      {/* ── Hero Section ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-hero-gradient">
        {/* Background mesh */}
        <div className="absolute inset-0 bg-mesh opacity-60" />

        {/* Floating orbs */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-pink-500/10 rounded-full blur-2xl animate-float" />

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />

        <div className="container-custom relative z-10 pt-24 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6"
              >
                <Zap size={14} className="text-amber-400" />
                <span className="text-sm text-white/90 font-medium">Sri Lanka's #1 Tutor Platform</span>
              </motion.div>

              <h1 className="font-display font-bold text-4xl md:text-5xl xl:text-6xl text-white leading-tight mb-6">
                Find the Best{' '}
                <span className="gradient-text-warm">Tutors</span>
                {' '}in Sri Lanka
              </h1>

              <p className="text-lg text-white/75 leading-relaxed mb-8 max-w-lg">
                Discover trusted tutors and tuition classes near you or online. Connect with over 1,200 verified educators across all 25 districts.
              </p>

              {/* Search Box */}
              <motion.form
                onSubmit={handleSearch}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass rounded-2xl p-4 space-y-3 mb-8"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    id="hero-subject"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/40 text-sm"
                  >
                    <option value="" className="text-slate-900">📚 Subject</option>
                    {SUBJECTS.map((s) => <option key={s} value={s} className="text-slate-900">{s}</option>)}
                  </select>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    id="hero-district"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/40 text-sm"
                  >
                    <option value="" className="text-slate-900">📍 District</option>
                    {DISTRICTS.map((d) => <option key={d} value={d} className="text-slate-900">{d}</option>)}
                  </select>
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                    id="hero-method"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/40 text-sm"
                  >
                    <option value="" className="text-slate-900">🖥️ Method</option>
                    {METHODS.map((m) => <option key={m} value={m} className="text-slate-900">{m}</option>)}
                  </select>
                </div>
                <button type="submit" id="hero-search-btn" className="w-full flex items-center justify-center gap-2 bg-white text-primary-700 font-bold py-3.5 rounded-xl hover:bg-primary-50 transition-all duration-200 hover:shadow-lg">
                  <Search size={18} />
                  Search Classes
                </button>
              </motion.form>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-3">
                <Link to="/explore" id="hero-find-classes" className="btn-primary flex items-center gap-2">
                  <Search size={16} /> Find Classes
                </Link>
                <Link to="/register?role=tutor" id="hero-become-tutor" className="btn-secondary flex items-center gap-2">
                  <BookOpen size={16} /> Become a Tutor
                </Link>
              </div>
            </motion.div>

            {/* Right content — illustration */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:block relative"
            >
              <div className="relative animate-float">
                {/* Main card */}
                <div className="glass rounded-3xl p-6 max-w-sm mx-auto">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
                      <GraduationCap size={24} className="text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">Dr. Kasun Perera</p>
                      <p className="text-white/70 text-sm">Mathematics Tutor</p>
                    </div>
                    <span className="ml-auto badge badge-verified text-xs">✓ Verified</span>
                  </div>
                  <div className="space-y-2 mb-4">
                    {['A/L Combined Maths', 'O/L Mathematics', 'Grade 6-9 Maths'].map((c) => (
                      <div key={c} className="flex items-center gap-2 text-sm text-white/80">
                        <CheckCircle size={14} className="text-emerald-400 flex-shrink-0" />
                        {c}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-amber-400 fill-amber-400" />
                      <span className="text-white font-semibold text-sm">4.9</span>
                      <span className="text-white/60 text-xs">(320 students)</span>
                    </div>
                    <span className="text-primary-300 font-bold text-sm">LKR 3,500/mo</span>
                  </div>
                </div>

                {/* Floating badges */}
                <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                  className="absolute -top-6 -right-6 glass rounded-2xl px-4 py-2 text-white text-sm font-semibold shadow-xl">
                  🎯 98% Pass Rate
                </motion.div>
                <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 3.5, repeat: Infinity }}
                  className="absolute -bottom-4 -left-4 glass rounded-2xl px-4 py-2 text-white text-sm font-semibold shadow-xl">
                  ⚡ Instant Booking
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            ref={statsRef}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16"
          >
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="glass rounded-2xl p-4 text-center"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-2`}>
                  <stat.icon size={18} className="text-white" />
                </div>
                <div className="font-display font-bold text-2xl text-white">{stat.value}</div>
                <div className="text-sm text-white/70 mt-0.5">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" className="w-full fill-slate-50 dark:fill-dark-950">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" />
          </svg>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="section bg-slate-50 dark:bg-dark-950">
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <span className="badge badge-primary mb-3">How It Works</span>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-slate-900 dark:text-white mb-4">
              Get Started in <span className="gradient-text">3 Simple Steps</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">Find, connect, and learn with the best tutors in Sri Lanka effortlessly.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Search & Discover', desc: 'Browse classes by subject, district, language, or teaching method. Use advanced filters to find your perfect match.', icon: Search, color: 'from-blue-500 to-cyan-500' },
              { step: '02', title: 'Connect with Tutors', desc: 'View tutor profiles, qualifications, and reviews. Contact tutors via WhatsApp or call directly from the platform.', icon: Users, color: 'from-violet-500 to-purple-500' },
              { step: '03', title: 'Start Learning', desc: 'Enroll in classes, track your progress, and achieve your academic goals with verified, experienced educators.', icon: GraduationCap, color: 'from-emerald-500 to-teal-500' },
            ].map((item, i) => (
              <motion.div key={item.step} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="relative">
                <div className="card p-6 h-full">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 shadow-lg`}>
                    <item.icon size={24} className="text-white" />
                  </div>
                  <div className="absolute top-4 right-4 font-display font-black text-5xl text-slate-100 dark:text-slate-700/50">
                    {item.step}
                  </div>
                  <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
                {i < 2 && <div className="hidden md:block absolute top-1/2 -right-4 z-10 text-slate-300 dark:text-slate-600"><ChevronRight size={24} /></div>}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Tutors ── */}
      <section className="section bg-white dark:bg-dark-900/50">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-10">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="badge badge-primary mb-2">Top Educators</span>
              <h2 className="font-display font-bold text-3xl md:text-4xl text-slate-900 dark:text-white">
                Featured <span className="gradient-text">Tutors</span>
              </h2>
            </motion.div>
            <Link to="/explore?tab=tutors" className="hidden md:flex items-center gap-1.5 text-primary-600 dark:text-primary-400 font-semibold text-sm hover:gap-2.5 transition-all">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURED_TUTORS.map((tutor, i) => <TutorCard key={tutor.id} tutor={tutor} index={i} />)}
          </div>
          <div className="text-center mt-8 md:hidden">
            <Link to="/explore?tab=tutors" className="btn-outline inline-flex items-center gap-2">
              View All Tutors <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Popular Classes ── */}
      <section className="section bg-slate-50 dark:bg-dark-950">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-10">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="badge badge-warning mb-2">🔥 Trending</span>
              <h2 className="font-display font-bold text-3xl md:text-4xl text-slate-900 dark:text-white">
                Popular <span className="gradient-text">Classes</span>
              </h2>
            </motion.div>
            <Link to="/explore" className="hidden md:flex items-center gap-1.5 text-primary-600 dark:text-primary-400 font-semibold text-sm hover:gap-2.5 transition-all">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {POPULAR_CLASSES.map((cls, i) => <ClassCard key={cls.id} cls={cls} index={i} />)}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="section bg-white dark:bg-dark-900/50">
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-slate-900 dark:text-white mb-4">
              Why Choose <span className="gradient-text">EduConnect?</span>
            </h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: 'Verified Tutors', desc: 'All tutors are manually verified with NIC and degree certificates.', color: 'from-emerald-500 to-teal-500' },
              { icon: Globe, title: 'Online & Physical', desc: 'Choose from online, physical, or hybrid learning modes across Sri Lanka.', color: 'from-blue-500 to-cyan-500' },
              { icon: Star, title: 'Student Reviews', desc: 'Make informed decisions with authentic reviews and ratings from real students.', color: 'from-amber-500 to-orange-500' },
              { icon: Zap, title: 'Instant Contact', desc: 'Contact tutors directly via WhatsApp or phone — no middleman.', color: 'from-violet-500 to-purple-500' },
              { icon: BookOpen, title: 'All Levels', desc: 'Classes for Grade 1 to University, O/L, A/L, Scholarship and more.', color: 'from-pink-500 to-rose-500' },
              { icon: TrendingUp, title: 'Real Analytics', desc: 'Tutors get powerful analytics to grow their student base and track engagement.', color: 'from-indigo-500 to-primary-500' },
            ].map((feat, i) => (
              <motion.div key={feat.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="card p-5 flex gap-4 items-start group hover:-translate-y-1 transition-transform duration-300 cursor-default">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feat.color} flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  <feat.icon size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">{feat.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{feat.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="section">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-hero-gradient p-8 md:p-14 text-center"
          >
            <div className="absolute inset-0 bg-mesh opacity-50" />
            <div className="relative z-10">
              <h2 className="font-display font-bold text-3xl md:text-4xl text-white mb-4">
                Are You a Tutor? <span className="gradient-text-warm">Join Today!</span>
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
                Reach thousands of students across Sri Lanka. Create your free profile, list your classes, and start growing your student base today.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/register?role=tutor" id="cta-become-tutor" className="bg-white text-primary-700 font-bold px-8 py-4 rounded-2xl hover:bg-primary-50 transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2">
                  <BookOpen size={18} /> Become a Tutor — It's Free
                </Link>
                <Link to="/explore" className="btn-secondary flex items-center gap-2">
                  <Search size={16} /> Browse Classes
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
