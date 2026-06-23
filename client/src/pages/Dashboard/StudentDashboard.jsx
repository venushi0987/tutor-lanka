import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const StudentDashboard = () => {
  const { user, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrollModal, setEnrollModal] = useState(null); // holds course object
  const [enrolling, setEnrolling] = useState(false);

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        setLoading(true);
        // Fetch courses recommended based on student's grade
        const gradeParam = user?.grade ? `?grade=${encodeURIComponent(user.grade)}` : '';
        const res = await axios.get(`${API}/courses${gradeParam}`, { headers });
        if (res.data.success) setCourses(res.data.courses);
      } catch (err) {
        console.error('Could not load courses:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRecommended();
  }, [user?.grade]);

  const handleEnroll = async (course) => {
    if (!token) { navigate('/login'); return; }
    setEnrolling(true);
    try {
      await axios.post(`${API}/enrollments`, { courseId: course._id }, { headers });
      toast.success(`Successfully enrolled in "${course.title}"!`);
      setEnrollModal(null);
    } catch (err) {
      const msg = err.response?.data?.message || 'Enrollment failed. Try again.';
      toast.error(msg);
    } finally {
      setEnrolling(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 dark:bg-dark-950">

      {/* ── Enroll Modal ── */}
      {enrollModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-dark-900 rounded-[28px] shadow-2xl max-w-md w-full border border-slate-100 dark:border-dark-800 p-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs font-bold text-[#1c0da1] dark:text-[#d9cb00] uppercase tracking-wider mb-1">{enrollModal.subject}</p>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">{enrollModal.title}</h3>
                <p className="text-sm text-slate-500 mt-0.5">{enrollModal.gradeLevel}</p>
              </div>
              <button onClick={() => setEnrollModal(null)} className="text-slate-400 hover:text-slate-600 text-xl font-bold leading-none">✕</button>
            </div>

            {enrollModal.tutor && (
              <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-dark-800 rounded-xl border border-slate-100 dark:border-dark-700 mb-5">
                <div className="w-10 h-10 rounded-full bg-[#1c0da1] flex items-center justify-center text-white font-black overflow-hidden flex-shrink-0">
                  {enrollModal.tutor.avatar
                    ? <img src={enrollModal.tutor.avatar} alt="" className="w-full h-full object-cover" />
                    : enrollModal.tutor.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-slate-800 dark:text-white text-sm">{enrollModal.tutor.name}</p>
                  {enrollModal.tutor.phone && <p className="text-xs text-slate-500">📞 {enrollModal.tutor.phone}</p>}
                  {enrollModal.tutor.address && <p className="text-xs text-slate-500">📍 {enrollModal.tutor.address}</p>}
                </div>
              </div>
            )}

            {enrollModal.description && (
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-5 leading-relaxed">{enrollModal.description}</p>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-dark-800">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Monthly Fee</p>
                <p className="text-2xl font-black text-[#1c0da1] dark:text-[#d9cb00]">
                  {enrollModal.isPaid ? `Rs. ${enrollModal.price?.toLocaleString()}` : <span className="text-green-600">FREE</span>}
                </p>
              </div>
              <button
                onClick={() => handleEnroll(enrollModal)}
                disabled={enrolling}
                className="bg-[#1c0da1] text-white font-bold px-8 py-3 rounded-xl hover:bg-[#0a044a] transition-all shadow-md disabled:opacity-60 flex items-center gap-2"
              >
                {enrolling && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                {enrolling ? 'Enrolling...' : 'Confirm Enroll'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-[#1c0da1] to-[#0a044a] px-8 py-10 shadow-xl">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-black text-white">
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-slate-300 mt-1 text-sm">
            {user?.grade ? `Showing classes suggested for ${user.grade}` : 'Discover the perfect class for you.'}
          </p>
          <button
            onClick={() => navigate('/search-classes')}
            className="mt-5 inline-flex items-center gap-2 bg-[#d9cb00] text-[#0a044a] font-black px-6 py-2.5 rounded-xl hover:bg-yellow-400 transition-all shadow-lg text-sm"
          >
            🔍 Search All Classes
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Following Tutors', value: user?.following?.length || 0 },
            { label: 'Enrolled Courses', value: user?.enrolledCourses?.length || 0 },
            { label: 'Your Grade', value: user?.grade || 'Not Set' },
            { label: 'Account Status', value: '✅ Active' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white dark:bg-dark-900 rounded-2xl p-5 border border-slate-200 dark:border-dark-800 shadow-sm">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
              <p className="text-xl font-black text-[#1c0da1] dark:text-[#d9cb00] mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black dark:text-white">
            {user?.grade ? `Recommended for ${user.grade}` : 'All Available Classes'}
          </h2>
          <button onClick={() => navigate('/search-classes')} className="text-[#1c0da1] dark:text-[#d9cb00] font-bold text-sm hover:underline">
            Browse All →
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-[#1c0da1] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : courses.length === 0 ? (
          <div className="bg-white dark:bg-dark-900 rounded-3xl p-16 text-center border border-dashed border-slate-200 dark:border-dark-800">
            <p className="text-5xl mb-4">🔍</p>
            <h3 className="text-xl font-black text-slate-700 dark:text-white">No classes found yet</h3>
            <p className="text-slate-400 text-sm mt-2 mb-6">
              {user?.grade ? `No classes matching "${user.grade}" yet. Explore all classes below.` : 'No classes are published yet. Check back soon!'}
            </p>
            <button onClick={() => navigate('/search-classes')} className="bg-[#1c0da1] text-white font-bold px-8 py-3 rounded-xl hover:bg-[#0a044a] transition-all">
              Browse All Classes
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses.map((c) => (
              <div key={c._id} className="bg-white dark:bg-dark-900 p-6 rounded-3xl border border-slate-200 dark:border-dark-800 shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col">
                {/* Top badges */}
                <div className="flex justify-between items-start mb-3">
                  <span className={`text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full ${c.type === 'Online' ? 'bg-emerald-50 text-emerald-600' : c.type === 'Home Visit' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
                    {c.type || 'Physical'}
                  </span>
                  {c.isPaid
                    ? <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">Paid</span>
                    : <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded-md">FREE</span>
                  }
                </div>

                {/* Subject + Title */}
                <p className="text-[10px] font-bold text-[#1c0da1] dark:text-[#d9cb00] uppercase tracking-wider">{c.subject}</p>
                <h3 className="font-black text-lg mt-0.5 dark:text-white group-hover:text-[#1c0da1] transition-colors leading-snug">{c.title}</h3>
                <p className="text-xs text-slate-400 font-semibold mt-1">{c.gradeLevel}</p>

                {/* Tutor Info */}
                {c.tutor && (
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-dark-800 space-y-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-[#1c0da1]/10 flex items-center justify-center text-sm font-bold text-[#1c0da1] overflow-hidden flex-shrink-0 border border-slate-100 shadow-sm">
                        {c.tutor.avatar ? <img src={c.tutor.avatar} alt={c.tutor.name} className="w-full h-full object-cover" /> : c.tutor.name?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{c.tutor.name}</span>
                          {c.tutor.isVerified && <span className="text-green-500 text-xs" title="Verified">✅</span>}
                        </div>
                        {c.tutor.phone && (
                          <p className="text-[11px] text-slate-500 font-semibold flex items-center gap-0.5">📞 {c.tutor.phone}</p>
                        )}
                      </div>
                    </div>
                    {c.tutor.address && (
                      <p className="text-xs text-slate-500 flex items-center gap-1 font-semibold">📍 {c.tutor.address}</p>
                    )}
                    {c.tutor.qualifications?.length > 0 && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-1 font-medium bg-slate-50 dark:bg-dark-800 px-2 py-1.5 rounded-lg border border-slate-100 dark:border-dark-800">
                        <span className="text-sm leading-none">🎓</span>
                        <span>{c.tutor.qualifications.join(', ')}</span>
                      </p>
                    )}
                    {c.tutor.bio && (
                      <p className="text-[11px] text-slate-400 italic line-clamp-2 px-1">{c.tutor.bio}</p>
                    )}
                  </div>
                )}

                {/* Price + Enroll */}
                <div className="mt-auto pt-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Monthly Fee</p>
                      <span className="font-black text-lg dark:text-white">
                        {c.isPaid ? `Rs. ${c.price?.toLocaleString()}` : 'Free'}
                      </span>
                    </div>
                    <button className="bg-slate-100 dark:bg-dark-800 text-slate-900 dark:text-white font-bold text-sm px-5 py-2.5 rounded-xl group-hover:bg-[#1c0da1] group-hover:text-white transition-colors">
                      Enroll
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
