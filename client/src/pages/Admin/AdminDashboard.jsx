import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users, GraduationCap, BookOpen, Flag, TrendingUp,
  UserCheck, ShieldAlert, BarChart2, Activity, ArrowRight
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart
} from 'recharts';

const registrationData = Array.from({ length: 30 }, (_, i) => ({
  day: `${i + 1}`,
  students: Math.floor(Math.random() * 15) + 3,
  tutors: Math.floor(Math.random() * 5) + 1,
}));

const recentActivity = [
  { id: 1, action: 'New student registered', user: 'Kavindi Perera', time: '2 min ago', type: 'student' },
  { id: 2, action: 'Tutor profile submitted for verification', user: 'Nimal Silva', time: '15 min ago', type: 'tutor' },
  { id: 3, action: 'Report filed on class listing', user: 'System', time: '32 min ago', type: 'report' },
  { id: 4, action: 'New class added', user: 'Priya Mendis', time: '1 hr ago', type: 'class' },
  { id: 5, action: 'Tutor verified successfully', user: 'Admin', time: '2 hr ago', type: 'verify' },
];

const typeColors = {
  student: 'bg-emerald-100 text-emerald-700',
  tutor: 'bg-blue-100 text-blue-700',
  report: 'bg-red-100 text-red-700',
  class: 'bg-blue-100 text-blue-700',
  verify: 'bg-[#1e40af]/10 text-[#1e40af]',
};

const stats = [
  { label: 'Total Users', value: '1,284', icon: Users, color: 'from-[#1e40af] to-[#2563eb]', change: '+12%' },
  { label: 'Active Tutors', value: '214', icon: GraduationCap, color: 'from-emerald-500 to-teal-600', change: '+5%' },
  { label: 'Total Classes', value: '389', icon: BookOpen, color: 'from-blue-500 to-blue-700', change: '+18%' },
  { label: 'Pending Reports', value: '7', icon: Flag, color: 'from-red-500 to-rose-600', change: '-2' },
  { label: 'Pending Verifications', value: '23', icon: UserCheck, color: 'from-orange-500 to-amber-600', change: '+3' },
];

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }),
};

const AdminDashboard = () => {
  const user = useSelector(state => state.auth.user);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0c1a3d] via-[#1e40af] to-[#2563eb] px-6 py-10 text-white">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <p className="text-[#d9cb00] text-xs font-bold tracking-widest uppercase mb-1">Administrator Panel</p>
            <h1 className="text-3xl font-black">Welcome back, {user?.name?.split(' ')[0] || 'Admin'} 👋</h1>
            <p className="text-white/60 text-sm mt-1">Here's what's happening on EduConnect today.</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-6 pb-10 space-y-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 shadow-lg`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-black text-slate-800">{stat.value}</p>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">{stat.label}</p>
              <span className="text-xs font-bold text-emerald-600 mt-1 block">{stat.change} this week</span>
            </motion.div>
          ))}
        </div>

        {/* Chart + Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Registration Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-black text-slate-800">Registrations — Last 30 Days</h3>
                <p className="text-xs text-slate-400 mt-0.5">Students and tutors joining the platform</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <span className="flex items-center gap-1.5"><span className="w-3 h-1 bg-[#1e40af] rounded block" /> Students</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-1 bg-emerald-500 rounded block" /> Tutors</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={registrationData}>
                <defs>
                  <linearGradient id="students" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1e40af" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#1e40af" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="tutors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }} />
                <Area type="monotone" dataKey="students" stroke="#1e40af" strokeWidth={2} fill="url(#students)" />
                <Area type="monotone" dataKey="tutors" stroke="#10b981" strokeWidth={2} fill="url(#tutors)" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
          >
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-[#1e40af]" />
              <h3 className="font-black text-slate-800">Recent Activity</h3>
            </div>
            <div className="space-y-3">
              {recentActivity.map(item => (
                <div key={item.id} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize flex-shrink-0 mt-0.5 ${typeColors[item.type]}`}>
                    {item.type}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-700 truncate">{item.action}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{item.user} · {item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="font-black text-slate-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: 'Manage Users', icon: Users, path: '/admin/users', color: 'from-[#1e40af] to-[#2563eb]' },
              { label: 'Verify Tutors', icon: UserCheck, path: '/admin/tutors/verify', color: 'from-emerald-500 to-teal-600' },
              { label: 'View Reports', icon: ShieldAlert, path: '/admin/reports', color: 'from-red-500 to-rose-600' },
            ].map(({ label, icon: Icon, path, color }) => (
              <button
                key={label}
                onClick={() => navigate(path)}
                className={`bg-gradient-to-r ${color} text-white p-4 rounded-xl font-bold text-sm flex items-center justify-between hover:opacity-90 transition-opacity shadow-md`}
              >
                <span className="flex items-center gap-2"><Icon className="w-4 h-4" />{label}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
