import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const SearchClasses = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialQuery = params.get('q') || '';

  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [gradeFilter, setGradeFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const grades = ['Grade 1-5', 'Grade 6-9', 'G.C.E O/L', 'G.C.E A/L', 'University'];
  const types = ['Online', 'Physical', 'Home Visit'];

  const fetchClasses = async (q = searchTerm, grade = gradeFilter, type = typeFilter) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (q) queryParams.set('search', q);
      if (grade) queryParams.set('grade', grade);
      if (type) queryParams.set('type', type);
      const res = await axios.get(`${API}/courses?${queryParams.toString()}`);
      if (res.data.success) setClasses(res.data.courses);
    } catch (err) {
      console.error('Search failed:', err.message);
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses(initialQuery);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchClasses();
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 dark:bg-dark-950 p-6 sm:p-10">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Search Header */}
        <div className="bg-gradient-to-r from-[#1c0da1] to-[#0a044a] rounded-3xl p-8 text-white shadow-xl">
          <h2 className="text-3xl font-black tracking-wide">Find Your Perfect Class</h2>
          <p className="text-xs text-slate-300 mt-1">Search through premium classes across Sri Lanka</p>
          <form onSubmit={handleSearch} className="flex gap-2 mt-5 max-w-2xl">
            <div className="flex flex-1 bg-white rounded-2xl overflow-hidden shadow-md items-center px-4">
              <span className="text-slate-400">🔍</span>
              <input
                type="text"
                placeholder="Search by subject, teacher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 py-3.5 px-3 outline-none text-slate-800 text-sm font-medium"
              />
            </div>
            <button type="submit" className="bg-[#d9cb00] text-[#0a044a] font-black px-8 rounded-2xl hover:bg-yellow-400 transition-all">
              Search
            </button>
          </form>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <select
            value={gradeFilter}
            onChange={(e) => { setGradeFilter(e.target.value); fetchClasses(searchTerm, e.target.value, typeFilter); }}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-dark-700 bg-white dark:bg-dark-900 text-slate-800 dark:text-white text-sm font-semibold outline-none focus:border-[#1c0da1]"
          >
            <option value="">All Grades</option>
            {grades.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
          <select
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); fetchClasses(searchTerm, gradeFilter, e.target.value); }}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-dark-700 bg-white dark:bg-dark-900 text-slate-800 dark:text-white text-sm font-semibold outline-none focus:border-[#1c0da1]"
          >
            <option value="">All Types</option>
            {types.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          {(gradeFilter || typeFilter || searchTerm) && (
            <button
              onClick={() => { setSearchTerm(''); setGradeFilter(''); setTypeFilter(''); fetchClasses('', '', ''); }}
              className="px-4 py-2.5 rounded-xl bg-red-50 text-red-600 font-bold text-sm hover:bg-red-100 transition-all"
            >
              ✕ Clear Filters
            </button>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-[#1c0da1] border-t-transparent rounded-full animate-spin" /></div>
        ) : classes.length === 0 ? (
          <div className="bg-white dark:bg-dark-900 rounded-3xl p-16 text-center border border-dashed border-slate-200 dark:border-dark-800">
            <p className="text-5xl mb-4">🔍</p>
            <h3 className="text-xl font-black text-slate-700 dark:text-white">No classes found</h3>
            <p className="text-slate-400 text-sm mt-2">Try adjusting your search or clearing filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((item) => (
              <div key={item._id} className="bg-white dark:bg-dark-900 rounded-3xl p-6 border border-slate-100 dark:border-dark-800 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${item.type === 'Online' ? 'bg-emerald-50 text-emerald-600' : item.type === 'Physical' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'}`}>
                      {item.type || 'Physical'}
                    </span>
                    {item.isPaid ? null : <span className="text-[10px] font-black text-green-700 bg-green-100 px-2 py-1 rounded-full">FREE</span>}
                  </div>
                  <h4 className="text-lg font-black text-slate-800 dark:text-white group-hover:text-[#1c0da1] transition-colors">{item.title}</h4>
                  <p className="text-xs font-semibold text-[#1c0da1] dark:text-[#d9cb00] mt-1">{item.subject} • {item.gradeLevel}</p>
                  {item.tutor?.name && <p className="text-xs text-slate-400 mt-1">By {item.tutor.name}</p>}
                  {item.tutor?.qualifications?.length > 0 && (
                    <p className="text-xs text-slate-500 mt-0.5">{item.tutor.qualifications[0]}</p>
                  )}
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-dark-800 flex justify-between items-center">
                  <span className="text-sm font-black text-[#1c0da1] dark:text-[#d9cb00]">
                    {item.isPaid ? `Rs. ${item.price?.toLocaleString()}` : 'Free'}
                    {item.isPaid && <span className="text-[10px] text-slate-400 font-normal"> /month</span>}
                  </span>
                  <button className="px-4 py-2 bg-slate-100 dark:bg-dark-800 text-slate-700 dark:text-white font-bold text-xs rounded-xl hover:bg-[#d9cb00] hover:text-slate-900 transition-all">
                    Enroll Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchClasses;