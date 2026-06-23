import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const TutorDashboard = () => {
  const { user, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [qualifications, setQualifications] = useState([]);
  const [newQual, setNewQual] = useState('');
  const [loading, setLoading] = useState(true);
  const [savingQual, setSavingQual] = useState(false);
  const [activeTab, setActiveTab] = useState('courses');

  const headers = { Authorization: `Bearer ${token}` };

  // Fetch real courses from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch this tutor's courses
        const res = await axios.get(`${API}/courses/my`, { headers });
        if (res.data.success) setCourses(res.data.courses);
      } catch (err) {
        console.error('Could not load courses:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    // Pre-fill qualifications from logged-in user
    if (user?.qualifications) setQualifications(user.qualifications);
  }, []);

  const handleAddQual = async (e) => {
    e.preventDefault();
    if (!newQual.trim()) return;
    const updated = [...qualifications, newQual.trim()];
    setSavingQual(true);
    try {
      await axios.put(`${API}/auth/profile`, { qualifications: updated }, { headers });
      setQualifications(updated);
      setNewQual('');
    } catch (err) {
      alert('Failed to save qualification. Please try again.');
    } finally {
      setSavingQual(false);
    }
  };

  const handleRemoveQual = async (index) => {
    const updated = qualifications.filter((_, i) => i !== index);
    try {
      await axios.put(`${API}/auth/profile`, { qualifications: updated }, { headers });
      setQualifications(updated);
    } catch (err) {
      alert('Failed to remove qualification.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 dark:bg-dark-950">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1c0da1] to-[#0a044a] px-8 py-10 shadow-xl">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-black text-white">Tutor Dashboard</h1>
          <p className="text-slate-300 mt-1 text-sm">Welcome back, {user?.name?.split(' ')[0]}! Manage your courses and profile.</p>
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => navigate('/add-class')}
              className="flex items-center gap-2 bg-[#d9cb00] text-[#0a044a] font-black px-6 py-3 rounded-xl hover:bg-yellow-400 transition-all shadow-lg text-sm"
            >
              ＋ Add New Course
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center gap-2 bg-white/10 text-white font-bold px-6 py-3 rounded-xl hover:bg-white/20 transition-all text-sm"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Published Courses', value: courses.length },
            { label: 'Qualifications', value: qualifications.length },
            { label: 'Profile Status', value: user?.isVerified ? '✅ Verified' : '⏳ Pending' },
            { label: 'Account Role', value: 'Tutor' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white dark:bg-dark-900 rounded-2xl p-5 border border-slate-200 dark:border-dark-800 shadow-sm">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-black text-[#1c0da1] dark:text-[#d9cb00] mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Courses Section */}
        <div>
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-[#1c0da1] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : courses.length === 0 ? (
            <div className="bg-white dark:bg-dark-900 rounded-3xl p-16 text-center border border-dashed border-slate-200 dark:border-dark-800">
              <p className="text-5xl mb-4">📚</p>
              <h3 className="text-xl font-black text-slate-700 dark:text-white">No courses yet</h3>
              <p className="text-slate-400 text-sm mt-2 mb-6">Add your first course to start attracting students.</p>
              <button onClick={() => navigate('/add-class')} className="bg-[#1c0da1] text-white font-bold px-8 py-3 rounded-xl hover:bg-[#0a044a] transition-all">
                + Create First Course
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {courses.map((c) => (
                <div key={c._id} className="bg-white dark:bg-dark-900 p-6 rounded-3xl border border-slate-200 dark:border-dark-800 shadow-sm hover:shadow-xl transition-all relative overflow-hidden">
                  <div className={`absolute top-0 right-0 text-[10px] font-black px-3 py-1 rounded-bl-xl ${c.status === 'Published' ? 'bg-green-500 text-white' : 'bg-amber-400 text-amber-900'}`}>
                    {c.status || 'Draft'}
                  </div>
                  <p className="text-xs font-bold text-[#1c0da1] dark:text-[#d9cb00] uppercase tracking-wider">{c.subject}</p>
                  <h3 className="font-black text-lg mt-1 dark:text-white pr-10">{c.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{c.gradeLevel}</p>
                  <p className="font-black text-xl text-[#1c0da1] dark:text-[#d9cb00] mt-4">
                    {c.isPaid ? `Rs. ${c.price?.toLocaleString()}` : <span className="text-green-600">FREE</span>}
                  </p>
                  <button className="mt-4 w-full py-2 bg-slate-100 dark:bg-dark-800 rounded-xl text-sm font-bold dark:text-white hover:bg-slate-200 dark:hover:bg-dark-700 transition-all">
                    Manage
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TutorDashboard;
