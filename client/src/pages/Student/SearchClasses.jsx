import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Search, MapPin, Filter, BookOpen, Star, Users, Building2, Clock, SlidersHorizontal } from 'lucide-react';
import { fetchClasses } from '../../store/slices/classSlice';

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

const SearchClasses = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { classes, loading } = useSelector(state => state.classes);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ subject: '', district: '', grade: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [view, setView] = useState('list');

  useEffect(() => {
    const params = { limit: 50 };
    if (search) params.search = search;
    if (filters.subject) params.subject = filters.subject;
    if (filters.district) params.district = filters.district;
    if (filters.grade) params.grade = filters.grade;
    dispatch(fetchClasses(params));
  }, [dispatch, filters, search]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-[#0a044a] via-[#1c0da1] to-[#2a1ab5] px-6 py-8 text-white">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-black">Search Tuition Classes</h1>
          <p className="text-sm text-slate-300 mt-1">Find classes near you from top institutes</p>
          <div className="mt-4 flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by subject, teacher, or institute..."
                className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 outline-none focus:bg-white/20 text-sm" />
            </div>
            <button onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-3 rounded-xl border text-sm font-bold flex items-center gap-2 ${showFilters ? 'bg-[#d9cb00] text-[#1c0da1]' : 'bg-white/10 text-white border-white/20'}`}>
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>
            <div className="flex bg-white/10 rounded-xl p-1 border border-white/20">
              <button onClick={() => setView('list')} className={`px-3 py-2 rounded-lg text-xs font-bold ${view === 'list' ? 'bg-white text-[#1c0da1]' : 'text-white/70'}`}>List</button>
              <button onClick={() => setView('map')} className={`px-3 py-2 rounded-lg text-xs font-bold ${view === 'map' ? 'bg-white text-[#1c0da1]' : 'text-white/70'}`}>Map</button>
            </div>
          </div>
          {showFilters && (
            <div className="mt-3 grid grid-cols-3 gap-2">
              <select value={filters.subject} onChange={(e) => setFilters(prev => ({ ...prev, subject: e.target.value }))}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-xs text-white outline-none">
                <option value="">All Subjects</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science</option>
                <option value="English">English</option>
                <option value="ICT">ICT</option>
              </select>
              <select value={filters.grade} onChange={(e) => setFilters(prev => ({ ...prev, grade: e.target.value }))}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-xs text-white outline-none">
                <option value="">All Grades</option>
                <option value="Grade 6">Grade 6</option>
                <option value="Grade 10">Grade 10</option>
                <option value="O/L (Local)">O/L</option>
                <option value="A/L Science">A/L Science</option>
              </select>
              <select value={filters.district} onChange={(e) => setFilters(prev => ({ ...prev, district: e.target.value }))}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-xs text-white outline-none">
                <option value="">All Districts</option>
                {SRI_LANKA_DISTRICTS.slice(0, 10).map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {view === 'map' ? (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <div className="h-[500px] rounded-xl overflow-hidden">
              <MapContainer center={[6.9, 79.86]} zoom={10} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />
                {classes.map(cls => {
                  const lat = cls.location?.coordinates?.coordinates?.[1];
                  const lng = cls.location?.coordinates?.coordinates?.[0];
                  if (!lat || !lng) return null;
                  return (
                    <Marker key={cls._id} position={[lat, lng]}>
                      <Popup>
                        <div className="cursor-pointer" onClick={() => navigate(`/class/${cls._id}`)}>
                          <p className="font-bold text-sm">{cls.title}</p>
                          <p className="text-xs text-slate-500">{cls.location?.city || ''}</p>
                          <p className="text-xs font-bold text-[#1c0da1] mt-1">Rs {cls.fee?.toLocaleString()}/mo</p>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm text-slate-500 mb-4">{loading ? 'Searching...' : `${classes.length} classes found`}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {classes.map(cls => (
                <div key={cls._id} onClick={() => navigate(`/class/${cls._id}`)}
                  className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Building2 className="w-3 h-3 text-[#1c0da1]" />
                    <span className="text-[10px] font-bold text-[#1c0da1]">{cls.instituteId?.name || 'Institute'}</span>
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700">{cls.teachingMethod}</span>
                    <span className="text-xs font-black text-[#1c0da1]">Rs {cls.fee?.toLocaleString()}<span className="text-[10px] text-slate-400 font-normal">/mo</span></span>
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm">{cls.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{cls.subject} · {cls.grade} · {cls.language}</p>
                  <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-400">
                    {cls.location?.city && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {cls.location.city}</span>}
                    {cls.enrollCount > 0 && <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {cls.enrollCount}</span>}
                  </div>
                </div>
              ))}
            </div>
            {classes.length === 0 && !loading && (
              <div className="text-center py-20">
                <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-500">No classes match your search</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchClasses;
