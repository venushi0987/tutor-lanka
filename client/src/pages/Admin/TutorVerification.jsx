import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Clock, MapPin, BookOpen, User } from 'lucide-react';

const mockTutors = [
  { id: 1, name: 'Nimal Silva', email: 'nimal@example.com', subject: 'Combined Mathematics', district: 'Colombo', applied: '2026-06-10', completion: 85, status: 'pending' },
  { id: 2, name: 'Priya Mendis', email: 'priya@example.com', subject: 'Biology & Chemistry', district: 'Kandy', applied: '2026-06-11', completion: 72, status: 'pending' },
  { id: 3, name: 'Sumudu Rathnayake', email: 'sumudu@example.com', subject: 'English Language', district: 'Galle', applied: '2026-06-08', completion: 90, status: 'approved' },
  { id: 4, name: 'Malitha Gunasekara', email: 'malitha@example.com', subject: 'Physics', district: 'Gampaha', applied: '2026-06-12', completion: 65, status: 'pending' },
  { id: 5, name: 'Chathu Perera', email: 'chathu@example.com', subject: 'ICT', district: 'Matara', applied: '2026-06-09', completion: 78, status: 'rejected' },
];

const statusConfig = {
  pending: { label: 'Pending', icon: Clock, class: 'bg-amber-100 text-amber-700 border-amber-200' },
  approved: { label: 'Approved', icon: CheckCircle, class: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  rejected: { label: 'Rejected', icon: XCircle, class: 'bg-red-100 text-red-700 border-red-200' },
};

const TutorVerification = () => {
  const [tutors, setTutors] = useState(mockTutors);
  const [filter, setFilter] = useState('all');
  const [confirm, setConfirm] = useState(null); // { id, action }

  const filtered = filter === 'all' ? tutors : tutors.filter(t => t.status === filter);

  const applyAction = () => {
    setTutors(prev => prev.map(t => t.id === confirm.id ? { ...t, status: confirm.action } : t));
    setConfirm(null);
  };

  const getInitials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0a044a] via-[#1c0da1] to-[#2a1ab5] px-6 py-8 text-white">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#d9cb00] text-xs font-bold tracking-widest uppercase mb-1">Admin</p>
          <h1 className="text-3xl font-black">Tutor Verification</h1>
          <p className="text-white/60 text-sm mt-1">Review and approve tutor profile submissions.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-4 pb-10">
        {/* Filter Tabs */}
        <div className="flex gap-2 mb-5 flex-wrap">
          {['all', 'pending', 'approved', 'rejected'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all ${
                filter === f ? 'bg-[#1c0da1] text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {f} {f === 'pending' && <span className="ml-1 bg-amber-500 text-white text-xs rounded-full px-1.5 py-0.5">{tutors.filter(t => t.status === 'pending').length}</span>}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((tutor, i) => {
            const { label, icon: Icon, class: cls } = statusConfig[tutor.status];
            return (
              <motion.div
                key={tutor.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#1c0da1] to-[#3d2bc4] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {getInitials(tutor.name)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{tutor.name}</p>
                      <p className="text-xs text-slate-400">{tutor.email}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${cls}`}>
                    <Icon className="w-3 h-3" />{label}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-500 mb-4">
                  <div className="flex items-center gap-2"><BookOpen className="w-3.5 h-3.5 text-[#1c0da1]" />{tutor.subject}</div>
                  <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-[#1c0da1]" />{tutor.district}</div>
                  <div className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-[#1c0da1]" />Applied: {tutor.applied}</div>
                </div>

                {/* Profile completion bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1">
                    <span>Profile Complete</span><span className={tutor.completion >= 80 ? 'text-emerald-600' : 'text-amber-600'}>{tutor.completion}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${tutor.completion >= 80 ? 'bg-emerald-500' : 'bg-amber-400'}`}
                      style={{ width: `${tutor.completion}%` }}
                    />
                  </div>
                </div>

                {tutor.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setConfirm({ id: tutor.id, action: 'approved' })}
                      className="flex-1 py-2 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-xl border border-emerald-200 hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Approve
                    </button>
                    <button
                      onClick={() => setConfirm({ id: tutor.id, action: 'rejected' })}
                      className="flex-1 py-2 bg-red-50 text-red-700 font-bold text-xs rounded-xl border border-red-200 hover:bg-red-100 transition-colors flex items-center justify-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Reject
                    </button>
                  </div>
                )}
              </motion.div>
            );
          })}
          {filtered.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-400 text-sm font-semibold">
              No tutor applications found for this filter.
            </div>
          )}
        </div>
      </div>

      {/* Confirm Modal */}
      <AnimatePresence>
        {confirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${confirm.action === 'approved' ? 'bg-emerald-100' : 'bg-red-100'}`}>
                {confirm.action === 'approved' ? <CheckCircle className="w-6 h-6 text-emerald-600" /> : <XCircle className="w-6 h-6 text-red-600" />}
              </div>
              <h3 className="font-black text-slate-800 text-lg capitalize">{confirm.action === 'approved' ? 'Approve' : 'Reject'} this tutor?</h3>
              <p className="text-sm text-slate-500 mt-2 mb-5">This will update the tutor's verification status.</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirm(null)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold hover:bg-slate-50">Cancel</button>
                <button onClick={applyAction} className={`flex-1 py-2.5 text-white rounded-xl text-sm font-bold ${confirm.action === 'approved' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'}`}>Confirm</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TutorVerification;
