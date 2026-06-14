import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Eye, Phone, Star, Users, BookOpen, Edit3, Plus,
  CheckCircle, Clock, MessageSquare, TrendingUp, Award
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const viewsData = Array.from({ length: 30 }, (_, i) => ({
  day: `${i + 1}`,
  views: Math.floor(Math.random() * 60) + 20,
}));

const myClasses = [
  { id: 1, title: 'Combined Maths – A/L 2026', subject: 'Mathematics', fee: 3500, students: 18, status: 'active' },
  { id: 2, title: 'Physics Revision – O/L', subject: 'Physics', fee: 2800, students: 12, status: 'active' },
  { id: 3, title: 'Online Combined Maths Theory', subject: 'Mathematics', fee: 2000, students: 25, status: 'active' },
];

const inquiries = [
  { id: 1, name: 'Kasun Perera', message: 'Is the class available for students starting from scratch?', time: '2 hrs ago' },
  { id: 2, name: 'Amara Fernando', message: 'What are the available timeslots for weekend classes?', time: '5 hrs ago' },
  { id: 3, name: 'Dinesh Kumara', message: 'Do you provide study materials and past papers?', time: '1 day ago' },
];

const completionSteps = [
  { label: 'Profile Photo', done: true },
  { label: 'Bio', done: true },
  { label: 'Subjects Listed', done: true },
  { label: 'Qualifications', done: false },
  { label: 'Location Set', done: true },
];

const stats = [
  { label: 'Profile Views', value: '1,240', icon: Eye, color: 'from-[#1c0da1] to-[#3d2bc4]', change: '+8%' },
  { label: 'Contact Clicks', value: '89', icon: Phone, color: 'from-emerald-500 to-teal-600', change: '+15%' },
  { label: 'Total Students', value: '55', icon: Users, color: 'from-purple-500 to-purple-700', change: '+3' },
  { label: 'Reviews', value: '32', icon: Star, color: 'from-amber-500 to-orange-500', change: '+4' },
  { label: 'Avg Rating', value: '4.8', icon: Award, color: 'from-pink-500 to-rose-500', change: '★★★★★' },
];

const TutorDashboard = () => {
  const user = useSelector(state => state.auth.user);
  const navigate = useNavigate();
  const done = completionSteps.filter(s => s.done).length;
  const percent = Math.round((done / completionSteps.length) * 100);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0a044a] via-[#1c0da1] to-[#2a1ab5] px-6 py-10 text-white">
        <div className="max-w-7xl mx-auto flex items-start justify-between flex-wrap gap-4">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-[#d9cb00] text-xs font-bold tracking-widest uppercase mb-1">Tutor Dashboard</p>
            <h1 className="text-3xl font-black">Hi, {user?.name?.split(' ')[0] || 'Tutor'} 👋</h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="flex items-center gap-1 text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2.5 py-1 rounded-full">
                <Clock className="w-3 h-3" /> Verification Pending
              </span>
            </div>
          </motion.div>
          <div className="flex gap-3">
            <button onClick={() => navigate('/tutor/profile/edit')}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-sm font-bold transition-colors">
              <Edit3 className="w-4 h-4" /> Edit Profile
            </button>
            <button onClick={() => navigate('/add-class')}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#d9cb00] text-[#1c0da1] rounded-xl text-sm font-black hover:bg-yellow-300 transition-colors shadow-lg">
              <Plus className="w-4 h-4" /> Add Class
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-6 pb-10 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
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
          {/* Views Chart */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="font-black text-slate-800 mb-1">Profile Views — Last 30 Days</h3>
            <p className="text-xs text-slate-400 mb-4">Daily views of your tutor profile</p>
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

          {/* Profile Completion */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="font-black text-slate-800 mb-1">Profile Completion</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className={`text-3xl font-black ${percent === 100 ? 'text-emerald-600' : 'text-[#1c0da1]'}`}>{percent}%</div>
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#1c0da1] to-[#3d2bc4] rounded-full transition-all" style={{ width: `${percent}%` }} />
              </div>
            </div>
            <div className="space-y-2">
              {completionSteps.map(step => (
                <div key={step.label} className="flex items-center gap-2.5">
                  {step.done
                    ? <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    : <div className="w-4 h-4 rounded-full border-2 border-slate-300 flex-shrink-0" />}
                  <span className={`text-xs font-semibold ${step.done ? 'text-slate-700' : 'text-slate-400'}`}>{step.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* My Classes */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-slate-800">My Classes</h3>
              <button onClick={() => navigate('/add-class')} className="text-xs font-bold text-[#1c0da1] hover:underline flex items-center gap-1">
                <Plus className="w-3 h-3" /> Add New
              </button>
            </div>
            <div className="space-y-3">
              {myClasses.map(cls => (
                <div key={cls.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-[#1c0da1]/5 transition-colors">
                  <div>
                    <p className="text-sm font-bold text-slate-800">{cls.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{cls.subject} · Rs {cls.fee.toLocaleString()}/mo · {cls.students} students</p>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full capitalize">{cls.status}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Inquiries */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-4 h-4 text-[#1c0da1]" />
              <h3 className="font-black text-slate-800">Recent Inquiries</h3>
            </div>
            <div className="space-y-3">
              {inquiries.map(inq => (
                <div key={inq.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-bold text-slate-800">{inq.name}</p>
                    <p className="text-[10px] text-slate-400">{inq.time}</p>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{inq.message}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TutorDashboard;
