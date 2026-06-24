import React from 'react';
import { useNavigate } from 'react-router-dom';

const InstituteDashboard = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs text-[#d9cb00] font-bold uppercase">Institute Dashboard</p>
            <h1 className="text-2xl font-black text-slate-900">Welcome, Institute</h1>
            <p className="text-sm text-slate-500 mt-1">Manage classes, halls, and branch locations.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate('/dashboard/institute/profile')}
              className="px-4 py-2 bg-white rounded-xl border border-slate-100 shadow-sm text-sm font-bold">Edit Profile</button>
            <button onClick={() => navigate('/add-class')}
              className="px-4 py-2 bg-[#1c0da1] text-white rounded-xl text-sm font-bold">Add Class</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <p className="text-xs text-slate-500">Total Classes</p>
            <p className="text-2xl font-black mt-2">12</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <p className="text-xs text-slate-500">Total Halls</p>
            <p className="text-2xl font-black mt-2">3</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <p className="text-xs text-slate-500">Followers</p>
            <p className="text-2xl font-black mt-2">1.2k</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <h3 className="font-black">My Classes</h3>
            <p className="text-sm text-slate-500 mt-2">Manage classes you have published.</p>
            {/* TODO: list classes from store */}
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <h3 className="font-black">Branch Locations</h3>
            <p className="text-sm text-slate-500 mt-2">Manage your physical class halls.</p>
            {/* TODO: show locations and links to edit */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstituteDashboard;