import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  Building2, BookOpen, MapPin, Users, Plus, Edit3,
  GraduationCap, Phone, Mail, CheckCircle, AlertCircle
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import api from '../services/api';

const viewsData = Array.from({ length: 30 }, (_, i) => ({
  day: `${i + 1}`,
  views: Math.floor(Math.random() * 80) + 30,
}));

const InstituteDashboard = () => {
  const navigate = useNavigate();
  const user = useSelector(state => state.auth.user);
  const [profile, setProfile] = useState(null);
  const [classes, setClasses] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, classesRes, analyticsRes] = await Promise.all([
          api.get(`/institutes/${user?._id}`).catch(() => ({ data: { success: false, profile: null } })),
          api.get('/classes/my').catch(() => ({ data: { success: false, classes: [] } })),
          api.get('/institutes/analytics/me').catch(() => ({ data: { success: false, analytics: null } })),
        ]);
        setProfile(profileRes.data.profile);
        setClasses(classesRes.data.classes || []);
        setAnalytics(analyticsRes.data.analytics);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#1c0da1] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-slate-500 mt-3 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Total Classes', value: analytics?.totalClasses || classes.length || 0, icon: BookOpen, color: 'from-[#1c0da1] to-[#3d2bc4]', change: `${classes.filter(c => c.isActive).length} active` },
    { label: 'Total Halls', value: profile?.locations?.length || 0, icon: MapPin, color: 'from-emerald-500 to-teal-600', change: 'branch locations' },
    { label: 'Followers', value: analytics?.followers || profile?.followers?.length || 0, icon: Users, color: 'from-purple-500 to-purple-700', change: 'institute followers' },
    { label: 'Enrollments', value: analytics?.totalEnrollments || 0, icon: GraduationCap, color: 'from-amber-500 to-orange-500', change: 'total students' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-[#0a044a] via-[#1c0da1] to-[#2a1ab5] px-6 py-10 text-white">
        <div className="max-w-7xl mx-auto flex items-start justify-between flex-wrap gap-4">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-2">
              {profile?.logo ? (
                <img src={profile.logo} alt={profile.name} className="w-12 h-12 rounded-xl object-cover border-2 border-white/20" />
              ) : (
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-[#d9cb00]" />
                </div>
              )}
              <div>
                <p className="text-[#d9cb00] text-xs font-bold tracking-widest uppercase">Institute Dashboard</p>
                <h1 className="text-3xl font-black">{profile?.name || user?.name}</h1>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {profile?.contact?.phone && (
                <span className="flex items-center gap-1 text-xs bg-white/10 px-2.5 py-1 rounded-full">
                  <Phone className="w-3 h-3" /> {profile.contact.phone}
                </span>
              )}
              {profile?.contact?.email && (
                <span className="flex items-center gap-1 text-xs bg-white/10 px-2.5 py-1 rounded-full">
                  <Mail className="w-3 h-3" /> {profile.contact.email}
                </span>
              )}
              {profile?.isVerified ? (
                <span className="flex items-center gap-1 text-xs bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full">
                  <CheckCircle className="w-3 h-3" /> Verified
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded-full">
                  <AlertCircle className="w-3 h-3" /> Not Verified
                </span>
              )}
            </div>
          </motion.div>
          <div className="flex gap-3">
            <button onClick={() => navigate('/dashboard/institute/profile')}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-sm font-bold transition-colors">
              <Edit3 className="w-4 h-4" /> Edit Profile
            </button>
            <button onClick={() => navigate('/dashboard/institute/add-class')}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#d9cb00] text-[#1c0da1] rounded-xl text-sm font-black hover:bg-yellow-300 transition-colors shadow-lg">
              <Plus className="w-4 h-4" /> Add Class
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-6 pb-10 space-y-6">
        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-sm text-rose-700 font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3 shadow-md`}>
                <s.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-black text-slate-800">{s.value}</p>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">{s.label}</p>
              <p className="text-xs font-bold text-emerald-600 mt-1">{s.change}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="font-black text-slate-800 mb-1">Institute Activity — Last 30 Days</h3>
            <p className="text-xs text-slate-400 mb-4">Profile views and class inquiries</p>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={viewsData}>
                <defs>
                  <linearGradient id="views" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1c0da1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#1c0da1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="views" stroke="#1c0da1" strokeWidth={2.5} fill="url(#views)" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="font-black text-slate-800 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { label: 'Add New Class', icon: Plus, path: '/dashboard/institute/add-class', color: 'text-[#1c0da1]' },
                { label: 'Manage Classes', icon: BookOpen, path: '/dashboard/institute/classes', color: 'text-emerald-600' },
                { label: 'Add Branch Location', icon: MapPin, path: '/dashboard/institute/branches', color: 'text-purple-600' },
                { label: 'Edit Institute Profile', icon: Edit3, path: '/dashboard/institute/profile', color: 'text-amber-600' },
              ].map((action) => (
                <button key={action.label} onClick={() => navigate(action.path)}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left">
                  <action.icon className={`w-4 h-4 ${action.color}`} />
                  <span className="text-sm font-semibold text-slate-700">{action.label}</span>
                </button>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Institute Details</h4>
              <div className="space-y-1.5 text-xs text-slate-600">
                <p><span className="font-semibold">Branches:</span> {profile?.locations?.length || 0}</p>
                <p><span className="font-semibold">Rating:</span> {profile?.rating || 'N/A'} / 5</p>
                <p><span className="font-semibold">Reviews:</span> {profile?.totalReviews || 0}</p>
                {profile?.slug && (
                  <p className="truncate">
                    <span className="font-semibold">Public URL:</span>{' '}
                    <Link to={`/institute/${profile.slug}`} className="text-[#1c0da1] hover:underline">/institute/{profile.slug}</Link>
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-slate-800 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#1c0da1]" /> My Classes
              </h3>
              <button onClick={() => navigate('/dashboard/institute/add-class')}
                className="text-xs font-bold text-[#1c0da1] hover:underline flex items-center gap-1">
                <Plus className="w-3 h-3" /> Add New
              </button>
            </div>
            {classes.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500">No classes yet</p>
                <button onClick={() => navigate('/dashboard/institute/add-class')}
                  className="mt-3 text-xs font-bold text-[#1c0da1] hover:underline">
                  Create your first class →
                </button>
              </div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto scrollbar-hide">
                {classes.slice(0, 6).map(cls => (
                  <div key={cls._id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-[#1c0da1]/5 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate">{cls.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {cls.subject} · {cls.grade} · Rs {cls.fee?.toLocaleString()}/mo · {cls.enrollCount || 0} enrolled
                      </p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ml-2 ${cls.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {cls.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                ))}
                {classes.length > 6 && (
                  <button onClick={() => navigate('/dashboard/institute/classes')}
                    className="w-full text-center text-xs font-bold text-[#1c0da1] py-2 hover:underline">
                    View all {classes.length} classes →
                  </button>
                )}
              </div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-slate-800 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" /> Branch Locations
              </h3>
              <button onClick={() => navigate('/dashboard/institute/branches')}
                className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1">
                <Plus className="w-3 h-3" /> Add Branch
              </button>
            </div>
            {!profile?.locations || profile.locations.length === 0 ? (
              <div className="text-center py-8">
                <MapPin className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500">No branch locations</p>
                <button onClick={() => navigate('/dashboard/institute/branches')}
                  className="mt-3 text-xs font-bold text-emerald-600 hover:underline">
                  Add your first branch →
                </button>
              </div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto scrollbar-hide">
                {profile.locations.map((loc, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-800">{loc.name || `Branch ${i + 1}`}</p>
                        <p className="text-xs text-slate-400 truncate">
                          {[loc.city, loc.district, loc.address].filter(Boolean).join(' · ') || 'Location set'}
                        </p>
                      </div>
                      <button onClick={() => navigate('/dashboard/institute/branches')}
                        className="text-xs text-slate-400 hover:text-[#1c0da1] ml-2">
                        <Edit3 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default InstituteDashboard;
