import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, SlidersHorizontal, Star, MapPin, CheckCircle, BookOpen, Users, ChevronDown } from 'lucide-react';

const SUBJECTS = ['Mathematics', 'Science', 'English', 'ICT', 'Physics', 'Chemistry', 'Biology', 'History', 'Commerce', 'Art', 'Music', 'Sinhala', 'Tamil', 'Geography'];
const DISTRICTS = ['Colombo', 'Gampaha', 'Kandy', 'Galle', 'Matara', 'Jaffna', 'Kurunegala', 'Ratnapura', 'Badulla', 'Anuradhapura', 'Polonnaruwa', 'Batticaloa', 'Trincomalee', 'Vavuniya', 'Mannar', 'Mullaitivu', 'Kilinochchi', 'Puttalam', 'Hambantota', 'Moneragala', 'Nuwara Eliya', 'Kegalle', 'Ampara', 'Kalutara', 'Gampaha'];
const LANGUAGES = ['Sinhala', 'English', 'Tamil', 'Bilingual'];
const METHODS = ['Online', 'Physical', 'Hybrid'];
const GRADES = ['Grade 1-5', 'Grade 6-9', 'Scholarship', 'O/L', 'A/L', 'University'];
const EXAM_TYPES = ['Scholarship', 'O/L', 'A/L', 'University', 'None'];

const MOCK_CLASSES = Array.from({ length: 18 }, (_, i) => ({
  id: String(i + 1),
  title: ['Advanced A/L Mathematics', 'O/L Science Mastery', 'Python & Web Dev', 'Grade 5 Scholarship', 'A/L Physics', 'English Grammar & Literature', 'Chemistry for A/L', 'Sinhala Language', 'Biology A/L', 'ICT Fundamentals', 'Commerce O/L', 'History Grade 10', 'Art for Beginners', 'Music Theory', 'Geography A/L', 'Tamil Language', 'Mathematics Grade 6-9', 'English for Beginners'][i],
  subject: SUBJECTS[i % SUBJECTS.length],
  tutor: ['Dr. Kasun Perera', 'Mrs. Dilani Silva', 'Mr. Nuwan Fernando', 'Ms. Amaya Rathnayake', 'Mr. Ruwan Bandara', 'Ms. Tharaka Jayasinghe'][i % 6],
  tutorAvatar: `https://i.pravatar.cc/150?img=${(i * 3) % 70 + 1}`,
  fee: [2500, 3500, 4200, 2800, 3800, 2200][i % 6],
  rating: [4.9, 4.8, 4.7, 4.6, 4.9, 4.8][i % 6],
  reviews: [128, 96, 215, 64, 102, 78][i % 6],
  method: METHODS[i % 3],
  language: LANGUAGES[i % 4],
  grade: GRADES[i % 6],
  district: DISTRICTS[i % 10],
  verified: i % 3 !== 0,
  banner: `https://images.unsplash.com/photo-${['1635070041078', '1532094349884', '1587620962725', '1503676260728', '1636466497217', '1456513080510', '1562654501664', '1509228627965', '1551288049', '1594312915251'][i % 10]}?w=400&h=200&fit=crop`,
}));

const MOCK_TUTORS = Array.from({ length: 12 }, (_, i) => ({
  id: String(i + 1),
  name: ['Dr. Kasun Perera', 'Mrs. Dilani Silva', 'Mr. Nuwan Fernando', 'Ms. Amaya Rathnayake', 'Mr. Ruwan Bandara', 'Ms. Tharaka Jayasinghe', 'Mr. Priya Kumar', 'Ms. Sanduni Wijesinghe', 'Dr. Mahesh Rajapaksha', 'Mr. Chamara Dissanayake', 'Ms. Nimali Bandara', 'Mr. Isuru Perera'][i],
  subject: SUBJECTS[i % SUBJECTS.length],
  rating: [4.9, 4.8, 4.7, 4.6, 4.9, 4.8, 4.7, 4.9, 4.8, 4.6, 4.7, 4.9][i],
  students: [320, 210, 450, 185, 290, 160, 380, 220, 140, 310, 175, 260][i],
  verified: i % 4 !== 0,
  avatar: `https://i.pravatar.cc/150?img=${(i * 5) % 70 + 2}`,
  district: DISTRICTS[i % 10],
  experience: [8, 6, 10, 4, 7, 5, 9, 3, 12, 6, 4, 8][i],
  classes: [3, 2, 4, 1, 3, 2, 3, 2, 2, 3, 1, 4][i],
}));

const StarRating = ({ rating, size = 12 }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star key={s} size={size} className={s <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-slate-600'} />
    ))}
  </div>
);

const Explore = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tab, setTab] = useState(searchParams.get('tab') || 'classes');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [filters, setFilters] = useState({
    subject: searchParams.get('subject') || '',
    district: searchParams.get('district') || '',
    language: '',
    method: searchParams.get('method') || '',
    grade: '',
    examType: '',
    minFee: '',
    maxFee: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [results, setResults] = useState(MOCK_CLASSES);

  useEffect(() => {
    // Filter mock data based on current filters
    let data = tab === 'classes' ? MOCK_CLASSES : MOCK_TUTORS;
    if (search) data = data.filter(d => d.title?.toLowerCase().includes(search.toLowerCase()) || d.name?.toLowerCase().includes(search.toLowerCase()) || d.subject?.toLowerCase().includes(search.toLowerCase()));
    if (filters.subject) data = data.filter(d => d.subject?.toLowerCase().includes(filters.subject.toLowerCase()));
    if (filters.district) data = data.filter(d => d.district === filters.district);
    if (filters.method && tab === 'classes') data = data.filter(d => d.method === filters.method);
    if (filters.language && tab === 'classes') data = data.filter(d => d.language === filters.language);
    setResults(data);
  }, [search, filters, tab]);

  const clearFilters = () => {
    setFilters({ subject: '', district: '', language: '', method: '', grade: '', examType: '', minFee: '', maxFee: '' });
    setSearch('');
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length + (search ? 1 : 0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-950 pt-20">
      {/* Header */}
      <div className="bg-hero-gradient py-10 px-4">
        <div className="container-custom">
          <h1 className="font-display font-bold text-3xl md:text-4xl text-white mb-2">Explore Classes & Tutors</h1>
          <p className="text-white/70 mb-6">Discover {results.length}+ results matching your criteria</p>

          {/* Search Bar */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60" />
              <input
                id="explore-search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Search ${tab === 'classes' ? 'classes' : 'tutors'}...`}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40"
              />
            </div>
            <button
              id="toggle-filters-btn"
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-5 py-3.5 rounded-xl border transition-all duration-200 font-medium text-sm ${showFilters ? 'bg-white text-primary-700 border-white' : 'bg-white/10 border-white/20 text-white hover:bg-white/20'}`}
            >
              <SlidersHorizontal size={16} />
              Filters
              {activeFilterCount > 0 && <span className="w-5 h-5 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center">{activeFilterCount}</span>}
            </button>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white dark:bg-slate-800 rounded-xl p-1 w-fit shadow-sm border border-slate-200 dark:border-slate-700">
          {['classes', 'tutors'].map((t) => (
            <button
              key={t}
              id={`tab-${t}`}
              onClick={() => { setTab(t); setResults(t === 'classes' ? MOCK_CLASSES : MOCK_TUTORS); }}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${tab === t ? 'bg-primary-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
            >
              {t === 'classes' ? <><BookOpen size={14} className="inline mr-1.5" />Classes</> : <><Users size={14} className="inline mr-1.5" />Tutors</>}
            </button>
          ))}
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden mb-6"
            >
              <div className="card p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2"><Filter size={16} /> Advanced Filters</h3>
                  {activeFilterCount > 0 && (
                    <button onClick={clearFilters} className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 font-medium">
                      <X size={14} /> Clear All
                    </button>
                  )}
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="input-label">Subject</label>
                    <select id="filter-subject" className="input text-sm" value={filters.subject} onChange={(e) => setFilters({ ...filters, subject: e.target.value })}>
                      <option value="">All Subjects</option>
                      {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="input-label">District</label>
                    <select id="filter-district" className="input text-sm" value={filters.district} onChange={(e) => setFilters({ ...filters, district: e.target.value })}>
                      <option value="">All Districts</option>
                      {DISTRICTS.map(d => <option key={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="input-label">Language</label>
                    <select id="filter-language" className="input text-sm" value={filters.language} onChange={(e) => setFilters({ ...filters, language: e.target.value })}>
                      <option value="">All Languages</option>
                      {LANGUAGES.map(l => <option key={l}>{l}</option>)}
                    </select>
                  </div>
                  {tab === 'classes' && (
                    <div>
                      <label className="input-label">Method</label>
                      <select id="filter-method" className="input text-sm" value={filters.method} onChange={(e) => setFilters({ ...filters, method: e.target.value })}>
                        <option value="">All Methods</option>
                        {METHODS.map(m => <option key={m}>{m}</option>)}
                      </select>
                    </div>
                  )}
                  {tab === 'classes' && (
                    <div>
                      <label className="input-label">Grade</label>
                      <select id="filter-grade" className="input text-sm" value={filters.grade} onChange={(e) => setFilters({ ...filters, grade: e.target.value })}>
                        <option value="">All Grades</option>
                        {GRADES.map(g => <option key={g}>{g}</option>)}
                      </select>
                    </div>
                  )}
                  <div>
                    <label className="input-label">Min Fee (LKR)</label>
                    <input id="filter-min-fee" type="number" className="input text-sm" placeholder="0" value={filters.minFee} onChange={(e) => setFilters({ ...filters, minFee: e.target.value })} />
                  </div>
                  <div>
                    <label className="input-label">Max Fee (LKR)</label>
                    <input id="filter-max-fee" type="number" className="input text-sm" placeholder="10000" value={filters.maxFee} onChange={(e) => setFilters({ ...filters, maxFee: e.target.value })} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-900 dark:text-white">{results.length}</span> results found
          </p>
          <select className="input text-sm w-auto py-2 px-3" id="sort-select">
            <option>Sort: Recommended</option>
            <option>Highest Rated</option>
            <option>Most Students</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Newest First</option>
          </select>
        </div>

        {/* Results Grid */}
        {results.length === 0 ? (
          <div className="text-center py-20">
            <Search size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
            <h3 className="font-semibold text-slate-900 dark:text-white text-lg mb-2">No results found</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-4">Try adjusting your search or filters</p>
            <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
          </div>
        ) : tab === 'classes' ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {results.map((cls, i) => (
              <motion.div key={cls.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="card card-hover overflow-hidden group flex flex-col">
                <Link to={`/class/${cls.id}`} className="flex flex-col h-full">
                  <div className="relative h-36 overflow-hidden">
                    <img src={cls.banner} alt={cls.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=200&fit=crop'; }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
                      <span className={`badge text-xs ${cls.method === 'Online' ? 'badge-primary' : cls.method === 'Physical' ? 'badge-success' : 'badge-warning'}`}>{cls.method}</span>
                    </div>
                  </div>
                  <div className="p-3.5 flex flex-col flex-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white text-sm leading-snug line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors mb-1">{cls.title}</h3>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <img src={cls.tutorAvatar} alt={cls.tutor} className="w-4 h-4 rounded-full" onError={(e) => { e.target.style.display = 'none'; }} />
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{cls.tutor}</p>
                      {cls.verified && <CheckCircle size={10} className="text-emerald-500 fill-emerald-500 flex-shrink-0" />}
                    </div>
                    <div className="flex items-center gap-1 mb-auto">
                      <StarRating rating={cls.rating} />
                      <span className="text-xs font-semibold text-amber-500">{cls.rating}</span>
                      <span className="text-xs text-slate-400">({cls.reviews})</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-100 dark:border-slate-700">
                      <span className="font-bold text-primary-600 dark:text-primary-400 text-sm">LKR {cls.fee.toLocaleString()}</span>
                      <span className="text-xs flex items-center gap-1 text-slate-500"><MapPin size={10} />{cls.district}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {results.map((tutor, i) => (
              <motion.div key={tutor.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="card card-hover p-5 group">
                <Link to={`/tutor/${tutor.id}`}>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="relative flex-shrink-0">
                      <img src={tutor.avatar} alt={tutor.name} className="w-14 h-14 rounded-2xl object-cover ring-2 ring-primary-100 dark:ring-primary-900/50 group-hover:ring-primary-400 transition-all" onError={(e) => { e.target.src = 'https://i.pravatar.cc/150?img=1'; }} />
                      {tutor.verified && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-800">
                          <CheckCircle size={10} className="text-white fill-white" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-slate-900 dark:text-white text-sm truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{tutor.name}</h3>
                      <p className="text-xs text-primary-600 dark:text-primary-400 font-medium mt-0.5">{tutor.subject}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <StarRating rating={tutor.rating} />
                    <span className="text-xs font-semibold text-amber-500">{tutor.rating}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1"><Users size={11} />{tutor.students} students</span>
                    <span className="flex items-center gap-1"><MapPin size={11} />{tutor.district}</span>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400">
                    <span>{tutor.experience} yrs experience</span>
                    <span className="text-primary-600 dark:text-primary-400 font-medium">{tutor.classes} classes</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
