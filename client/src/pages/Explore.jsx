import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, SlidersHorizontal, MapPin, Filter, BookOpen, Star, Users, Clock, Building2, School, ExternalLink
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchClasses } from '../store/slices/classSlice';
import api from '../services/api';

// Fix marker icon paths for bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
});

const SRI_LANKA_DISTRICTS = [
  'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
  'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
  'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
  'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
  'Moneragala', 'Ratnapura', 'Kegalle',
];

const SUBJECTS = [
  'Mathematics', 'Combined Maths', 'Science', 'Physics', 'Chemistry', 'Biology',
  'English', 'Sinhala', 'Tamil', 'History', 'Geography', 'ICT',
  'Commerce', 'Accounting', 'Economics', 'Business Studies', 'Art',
  'Music', 'Dancing', 'Buddhism',
];

const GRADES = [
  'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5',
  'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11',
  'O/L (Local)', 'A/L Science', 'A/L Commerce', 'A/L Arts',
];

const teachingMethods = [
  { value: '', label: 'All Types', icon: '📚' },
  { value: 'Physical', label: 'Physical', icon: '🏫' },
  { value: 'Online', label: 'Online', icon: '🌐' },
  { value: 'Hybrid', label: 'Hybrid', icon: '🔄' },
];

const GRADIENTS = [
  'from-blue-600 to-blue-800',
  'from-emerald-600 to-emerald-800',
  'from-purple-600 to-purple-800',
  'from-rose-600 to-rose-800',
  'from-amber-600 to-amber-800',
  'from-teal-600 to-teal-800',
  'from-indigo-600 to-indigo-800',
  'from-pink-600 to-pink-800',
];

const Explore = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { classes, loading, total, pages } = useSelector(state => state.classes);

  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    subject: '', grade: '', district: '', method: '', language: '', minFee: '', maxFee: '',
  });
  const [page, setPage] = useState(1);

  // Institutes state
  const [institutes, setInstitutes] = useState([]);
  const [instLoading, setInstLoading] = useState(true);

  useEffect(() => {
    const params = { page, limit: 12 };
    if (search) params.search = search;
    if (filters.subject) params.subject = filters.subject;
    if (filters.grade) params.grade = filters.grade;
    if (filters.district) params.district = filters.district;
    if (filters.method) params.method = filters.method;
    if (filters.language) params.language = filters.language;
    if (filters.minFee) params.minFee = filters.minFee;
    if (filters.maxFee) params.maxFee = filters.maxFee;
    dispatch(fetchClasses(params));
  }, [dispatch, page, filters, search]);

  // Fetch all institutes for the map
  useEffect(() => {
    const fetchInstitutes = async () => {
      try {
        const res = await api.get('/institutes');
        setInstitutes(res.data.institutes || []);
      } catch (err) {
        console.error('Failed to fetch institutes', err);
      } finally {
        setInstLoading(false);
      }
    };
    fetchInstitutes();
  }, []);

  const clearFilters = () => {
    setFilters({ subject: '', grade: '', district: '', method: '', language: '', minFee: '', maxFee: '' });
    setSearch('');
    setPage(1);
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== '');
  const getMethodBadge = (method) => {
    switch(method) {
      case 'Online': return { icon: '🌐', color: 'bg-blue-50 text-blue-700' };
      case 'Physical': return { icon: '🏫', color: 'bg-amber-50 text-amber-700' };
      case 'Hybrid': return { icon: '🔄', color: 'bg-purple-50 text-purple-700' };
      default: return { icon: '📚', color: 'bg-slate-50 text-slate-600' };
    }
  };

  // Collect all valid markers from institutes
  const mapMarkers = [];
  institutes.forEach((inst) => {
    if (inst.locations && inst.locations.length > 0) {
      inst.locations.forEach((loc) => {
        const lng = loc.coordinates?.coordinates?.[0];
        const lat = loc.coordinates?.coordinates?.[1];
        if (lng && lat && (lng !== 0 || lat !== 0)) {
          mapMarkers.push({ lat, lng, institute: inst, location: loc });
        }
      });
    }
  });

  const mapCenter = mapMarkers.length > 0
    ? [mapMarkers[0].lat, mapMarkers[0].lng]
    : [7.8731, 80.7718]; // Center of Sri Lanka

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-[#0a044a] via-[#1c0da1] to-[#2a1ab5] px-6 py-12 text-white">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-[#d9cb00] text-xs font-bold tracking-widest uppercase mb-1">Explore Classes</p>
            <h1 className="text-3xl md:text-4xl font-black">Find Your Perfect Tuition Class</h1>
            <p className="text-slate-300 text-sm mt-2 max-w-2xl">
              Browse classes from leading institutes across Sri Lanka. Explore institutes on the map below!
            </p>
          </motion.div>
          <div className="mt-6 flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search classes by subject, title, or teacher..."
                className="w-full pl-11 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 outline-none focus:bg-white/20 text-sm backdrop-blur-sm" />
            </div>
            <button onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-5 py-3.5 rounded-xl border text-sm font-bold transition-all ${
                showFilters || hasActiveFilters
                  ? 'bg-[#d9cb00] text-[#1c0da1] border-[#d9cb00]'
                  : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
              }`}>
              <SlidersHorizontal className="w-4 h-4" /> Filters
              {hasActiveFilters && <span className="w-2 h-2 bg-[#1c0da1] rounded-full" />}
            </button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {teachingMethods.map(m => (
              <button key={m.value} onClick={() => setFilters(prev => ({ ...prev, method: prev.method === m.value ? '' : m.value }))}
                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                  filters.method === m.value
                    ? 'bg-[#d9cb00] text-[#1c0da1] border-[#d9cb00]'
                    : 'bg-white/10 text-white/80 border-white/20 hover:bg-white/20'
                }`}>{m.icon} {m.label}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-4 pb-10">
        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 mb-6 overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-black text-slate-800 flex items-center gap-2"><Filter className="w-4 h-4" /> Advanced Filters</h3>
                <button onClick={clearFilters} className="text-xs font-bold text-[#1c0da1] hover:underline">Clear all</button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Subject</label>
                  <select value={filters.subject} onChange={(e) => setFilters(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none">
                    <option value="">All Subjects</option>
                    {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Grade</label>
                  <select value={filters.grade} onChange={(e) => setFilters(prev => ({ ...prev, grade: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none">
                    <option value="">All Grades</option>
                    {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">District</label>
                  <select value={filters.district} onChange={(e) => setFilters(prev => ({ ...prev, district: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none">
                    <option value="">All Districts</option>
                    {SRI_LANKA_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Language</label>
                  <select value={filters.language} onChange={(e) => setFilters(prev => ({ ...prev, language: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none">
                    <option value="">All Languages</option>
                    <option value="Sinhala">Sinhala</option>
                    <option value="English">English</option>
                    <option value="Tamil">Tamil</option>
                    <option value="Bilingual">Bilingual</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-slate-500 font-medium">
            {loading ? 'Searching...' : `${total || 0} classes found`}{hasActiveFilters && ' (filtered)'}
          </p>
        </div>

        {loading && classes.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm animate-pulse">
                <div className="h-4 bg-slate-200 rounded w-1/3 mb-3" /><div className="h-5 bg-slate-200 rounded w-2/3 mb-2" />
                <div className="h-3 bg-slate-100 rounded w-1/2 mb-1" /><div className="h-3 bg-slate-100 rounded w-1/3 mb-4" /><div className="h-8 bg-slate-200 rounded w-full" />
              </div>
            ))}
          </div>
        ) : classes.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-black text-slate-700">No classes found</h3>
            <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filters</p>
            <button onClick={clearFilters} className="mt-4 px-4 py-2 bg-[#1c0da1] text-white rounded-xl text-sm font-bold">Clear Filters</button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {classes.map((cls, i) => {
                const badge = getMethodBadge(cls.teachingMethod);
                const instName = cls.instituteId?.name || '';
                return (
                  <motion.div key={cls._id}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden group cursor-pointer"
                    onClick={() => navigate(`/class/${cls._id}`)}>
                    {cls.bannerImage && (
                      <div className="h-32 overflow-hidden">
                        <img src={cls.bannerImage} alt={cls.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    )}
                    <div className="p-5">
                      {instName && (
                        <div className="flex items-center gap-1.5 mb-2">
                          <Building2 className="w-3 h-3 text-[#1c0da1]" />
                          <span className="text-[10px] font-bold text-[#1c0da1] uppercase tracking-wider">{instName}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${badge.color}`}>{badge.icon} {cls.teachingMethod}</span>
                        <span className="text-sm font-black text-[#1c0da1]">Rs {cls.fee?.toLocaleString()}<span className="text-[10px] text-slate-400 font-normal">/{cls.feeType === 'free' ? 'free' : 'mo'}</span></span>
                      </div>
                      <h3 className="text-base font-black text-slate-800 leading-tight group-hover:text-[#1c0da1] transition-colors">{cls.title}</h3>
                      <p className="text-xs text-slate-500 mt-1">{cls.subject} · {cls.grade}</p>
                      <div className="flex items-center gap-3 mt-3 text-[10px] text-slate-400 font-medium">
                        {cls.location?.city && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {cls.location.city}</span>}
                        {cls.schedule?.days?.length > 0 && <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {cls.schedule.days[0]}{cls.schedule.days.length > 1 ? ` +${cls.schedule.days.length - 1}` : ''}</span>}
                        {cls.language && <span>{cls.language}</span>}
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50">
                        <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1"><Users className="w-3 h-3" /> {cls.enrollCount || 0} enrolled</span>
                        {cls.rating > 0 && <span className="text-[10px] font-bold text-amber-600 flex items-center gap-1"><Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {cls.rating}</span>}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            {pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${page === p ? 'bg-[#1c0da1] text-white' : 'bg-white text-slate-600 border border-slate-200 hover:border-[#1c0da1]'}`}>{p}</button>
                ))}
              </div>
            )}
          </>
        )}

        {/* Institute Map Section */}
        <div className="mt-12 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-black text-slate-800 mb-1 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#1c0da1]" /> Institutes on Map
            </h2>
            <p className="text-sm text-slate-500 mb-4">
              {instLoading ? 'Loading institutes...' : `Explore ${institutes.length} institute${institutes.length !== 1 ? 's' : ''} and their ${mapMarkers.length} location${mapMarkers.length !== 1 ? 's' : ''} across Sri Lanka`}
            </p>
          </div>

          {instLoading ? (
            <div className="h-96 bg-slate-100 animate-pulse flex items-center justify-center">
              <Building2 className="w-12 h-12 text-slate-300" />
            </div>
          ) : institutes.length === 0 ? (
            <div className="h-96 bg-slate-50 flex items-center justify-center border-t border-slate-100">
              <div className="text-center">
                <School className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-500">No institutes with locations found yet</p>
                <p className="text-xs text-slate-400 mt-1">Institutes will appear here once they add branch locations</p>
              </div>
            </div>
          ) : (
            <>
              <div className="h-[500px] relative">
                <MapContainer
                  center={mapCenter}
                  zoom={mapMarkers.length > 0 ? 11 : 8}
                  style={{ height: '100%', width: '100%' }}
                  scrollWheelZoom={true}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  />
                  {mapMarkers.map((marker, idx) => (
                    <Marker key={`${marker.institute._id}-${idx}`} position={[marker.lat, marker.lng]}>
                      <Popup maxWidth={280} minWidth={220}>
                        <div className="p-1">
                          <div className="flex items-center gap-2 mb-2">
                            {marker.institute.logo ? (
                              <img src={marker.institute.logo} alt={marker.institute.name} className="w-8 h-8 rounded-lg object-cover" />
                            ) : (
                              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${GRADIENTS[idx % GRADIENTS.length]} flex items-center justify-center`}>
                                <span className="text-white text-xs font-bold">{marker.institute.name?.[0] || 'I'}</span>
                              </div>
                            )}
                            <div>
                              <p className="font-bold text-sm text-slate-800 leading-tight">{marker.institute.name}</p>
                              {marker.institute.isVerified && (
                                <span className="text-[10px] text-emerald-600 font-bold">✓ Verified</span>
                              )}
                            </div>
                          </div>
                          <div className="space-y-1 text-xs text-slate-600">
                            <p className="font-medium text-slate-700">{marker.location.name || marker.location.city || 'Main Branch'}</p>
                            <p className="text-slate-500">
                              {[marker.location.address, marker.location.city, marker.location.district].filter(Boolean).join(', ')}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100">
                            {marker.institute.rating > 0 && (
                              <span className="text-[10px] font-bold text-amber-600 flex items-center gap-0.5">
                                <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {marker.institute.rating}
                              </span>
                            )}
                            {marker.institute.contact?.phone && (
                              <span className="text-[10px] text-slate-400">{marker.institute.contact.phone}</span>
                            )}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/institute/${marker.institute.slug}`);
                            }}
                            className="mt-2 w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#1c0da1] text-white text-xs font-bold rounded-lg hover:bg-[#0a044a] transition-colors"
                          >
                            View Institute <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>

              {/* Institute list below map */}
              <div className="p-6 border-t border-slate-100">
                <h3 className="text-sm font-black text-slate-700 mb-3">All Institutes ({institutes.length})</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {institutes.map((inst, i) => (
                    <div key={inst._id}
                      className="p-4 rounded-xl border border-slate-200 hover:border-[#1c0da1] hover:shadow-md transition-all cursor-pointer group"
                      onClick={() => navigate(`/institute/${inst.slug}`)}>
                      <div className="flex items-center gap-3">
                        {inst.logo ? (
                          <img src={inst.logo} alt={inst.name} className="w-10 h-10 rounded-xl object-cover border border-slate-100" />
                        ) : (
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]} flex items-center justify-center flex-shrink-0`}>
                            <span className="text-white text-sm font-bold">{inst.name?.[0] || 'I'}</span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-700 group-hover:text-[#1c0da1] truncate">{inst.name}</p>
                          <p className="text-[10px] text-slate-400">
                            {inst.locations?.length || 0} location{(inst.locations?.length || 0) !== 1 ? 's' : ''}
                            {inst.rating > 0 && ` · ⭐ ${inst.rating}`}
                            {inst.isVerified && ' · ✓ Verified'}
                          </p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-[#1c0da1] transition-colors flex-shrink-0" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Explore;
