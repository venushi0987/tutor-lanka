import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Flag, CheckCircle, XCircle, Clock } from 'lucide-react';

const mockReports = [
  { id: 1, reporter: 'Kasun Perera', type: 'Class Listing', reason: 'Misleading information about course content', status: 'pending', date: '2026-06-13' },
  { id: 2, reporter: 'Amara Fernando', type: 'Tutor Profile', reason: 'Fake credentials displayed', status: 'pending', date: '2026-06-12' },
  { id: 3, reporter: 'Dinesh Kumara', type: 'Review', reason: 'Spam / Fake review posted', status: 'resolved', date: '2026-06-10' },
  { id: 4, reporter: 'Iresha Bandara', type: 'Class Listing', reason: 'Inappropriate content in description', status: 'dismissed', date: '2026-06-09' },
  { id: 5, reporter: 'Sameera Jayawardena', type: 'Tutor Profile', reason: 'Contact number does not work', status: 'pending', date: '2026-06-13' },
  { id: 6, reporter: 'Tharaka Dissanayake', type: 'Class Listing', reason: 'Price shown is different from actual', status: 'resolved', date: '2026-06-08' },
];

const statusConfig = {
  pending: { label: 'Pending', icon: Clock, bg: 'bg-amber-100 text-amber-700 border-amber-200' },
  resolved: { label: 'Resolved', icon: CheckCircle, bg: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  dismissed: { label: 'Dismissed', icon: XCircle, bg: 'bg-slate-100 text-slate-500 border-slate-200' },
};

const typeColors = {
  'Class Listing': 'bg-purple-100 text-purple-700',
  'Tutor Profile': 'bg-blue-100 text-blue-700',
  'Review': 'bg-orange-100 text-orange-700',
};

const ReportsManagement = () => {
  const [reports, setReports] = useState(mockReports);
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? reports : reports.filter(r => r.status === filter);

  const updateStatus = (id, status) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const counts = {
    pending: reports.filter(r => r.status === 'pending').length,
    resolved: reports.filter(r => r.status === 'resolved').length,
    dismissed: reports.filter(r => r.status === 'dismissed').length,
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-[#0a044a] via-[#1c0da1] to-[#2a1ab5] px-6 py-8 text-white">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#d9cb00] text-xs font-bold tracking-widest uppercase mb-1">Admin</p>
          <h1 className="text-3xl font-black">Reports Management</h1>
          <p className="text-white/60 text-sm mt-1">{counts.pending} pending reports require attention.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-4 pb-10">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mb-5">
          {[
            { label: 'Pending', count: counts.pending, color: 'from-amber-500 to-orange-500' },
            { label: 'Resolved', count: counts.resolved, color: 'from-emerald-500 to-teal-500' },
            { label: 'Dismissed', count: counts.dismissed, color: 'from-slate-400 to-slate-500' },
          ].map(({ label, count, color }) => (
            <motion.div key={label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              className={`bg-gradient-to-r ${color} text-white rounded-xl p-4 shadow-md`}>
              <p className="text-2xl font-black">{count}</p>
              <p className="text-sm font-semibold opacity-80">{label}</p>
            </motion.div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-5">
          {['all', 'pending', 'resolved', 'dismissed'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all ${
                filter === f ? 'bg-[#1c0da1] text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}>
              {f}
            </button>
          ))}
        </div>

        {/* Reports Table */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  {['Reporter', 'Content Type', 'Reason', 'Date', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => {
                  const { label, icon: Icon, bg } = statusConfig[r.status];
                  return (
                    <motion.tr key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                      className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-4 font-semibold text-slate-800">{r.reporter}</td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${typeColors[r.type]}`}>{r.type}</span>
                      </td>
                      <td className="px-5 py-4 text-slate-500 max-w-[200px] truncate">{r.reason}</td>
                      <td className="px-5 py-4 text-slate-400 text-xs">{r.date}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${bg}`}>
                          <Icon className="w-3 h-3" />{label}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {r.status === 'pending' && (
                          <div className="flex gap-2">
                            <button onClick={() => updateStatus(r.id, 'resolved')}
                              className="text-xs font-bold px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors">
                              Resolve
                            </button>
                            <button onClick={() => updateStatus(r.id, 'dismissed')}
                              className="text-xs font-bold px-3 py-1.5 bg-slate-50 text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors">
                              Dismiss
                            </button>
                          </div>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="px-5 py-10 text-center text-slate-400 text-sm font-semibold">No reports found for this filter.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ReportsManagement;
