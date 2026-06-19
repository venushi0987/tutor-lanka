import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Trash2, X, Shield, ChevronLeft, ChevronRight } from 'lucide-react';

const mockUsers = [
  { id: 1, name: 'Kasun Perera', email: 'kasun@example.com', role: 'student', active: true, avatar: '' },
  { id: 2, name: 'Nimal Silva', email: 'nimal@example.com', role: 'tutor', active: true, avatar: '' },
  { id: 3, name: 'Priya Mendis', email: 'priya@example.com', role: 'tutor', active: false, avatar: '' },
  { id: 4, name: 'Amara Fernando', email: 'amara@example.com', role: 'student', active: true, avatar: '' },
  { id: 5, name: 'Sameera Jayawardena', email: 'sameera@example.com', role: 'admin', active: true, avatar: '' },
  { id: 6, name: 'Dinesh Kumara', email: 'dinesh@example.com', role: 'student', active: true, avatar: '' },
  { id: 7, name: 'Sumudu Rathnayake', email: 'sumudu@example.com', role: 'tutor', active: true, avatar: '' },
  { id: 8, name: 'Iresha Bandara', email: 'iresha@example.com', role: 'student', active: false, avatar: '' },
  { id: 9, name: 'Tharaka Dissanayake', email: 'tharaka@example.com', role: 'student', active: true, avatar: '' },
  { id: 10, name: 'Malitha Gunasekara', email: 'malitha@example.com', role: 'tutor', active: true, avatar: '' },
];

const roleBadge = {
  student: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  tutor: 'bg-blue-100 text-blue-700 border-blue-200',
  admin: 'bg-red-100 text-red-700 border-red-200',
};

const PAGE_SIZE = 5;

const UserManagement = () => {
  const [users, setUsers] = useState(mockUsers);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleActive = (id) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, active: !u.active } : u));
  };

  const confirmDelete = () => {
    setUsers(prev => prev.filter(u => u.id !== deleteTarget));
    setDeleteTarget(null);
  };

  const getInitials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0a044a] via-[#1c0da1] to-[#2a1ab5] px-6 py-8 text-white">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#d9cb00] text-xs font-bold tracking-widest uppercase mb-1">Admin</p>
          <h1 className="text-3xl font-black">User Management</h1>
          <p className="text-white/60 text-sm mt-1">Manage all registered users on the platform.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-4 pb-10">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {/* Toolbar */}
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search by name or email..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#1c0da1] transition-colors"
              />
            </div>
            <select
              value={roleFilter}
              onChange={e => { setRoleFilter(e.target.value); setPage(1); }}
              className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-[#1c0da1] transition-colors"
            >
              <option value="all">All Roles</option>
              <option value="student">Students</option>
              <option value="tutor">Tutors</option>
              <option value="admin">Admins</option>
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  {['User', 'Email', 'Role', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {paginated.map((u, i) => (
                    <motion.tr
                      key={u.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1c0da1] to-[#3d2bc4] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {getInitials(u.name)}
                          </div>
                          <span className="font-semibold text-slate-800">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-slate-500">{u.email}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border capitalize ${roleBadge[u.role]}`}>
                          {u.role === 'admin' && <Shield className="w-3 h-3" />}
                          {u.role}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => toggleActive(u.id)}
                          className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${u.active ? 'bg-emerald-500' : 'bg-slate-300'}`}
                        >
                          <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${u.active ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => setDeleteTarget(u.id)}
                          disabled={u.role === 'admin'}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                {paginated.length === 0 && (
                  <tr><td colSpan={5} className="px-5 py-10 text-center text-slate-400 text-sm font-semibold">No users found matching your filters.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs text-slate-400 font-semibold">
              Showing {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} users
            </p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-black text-slate-800 text-center">Delete User?</h3>
              <p className="text-sm text-slate-500 text-center mt-2 mb-5">This action cannot be undone. The user and all their data will be permanently removed.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">Cancel</button>
                <button onClick={confirmDelete} className="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-colors">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserManagement;
