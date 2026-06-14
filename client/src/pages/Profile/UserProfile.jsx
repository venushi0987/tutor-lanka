import React from 'react';

const UserProfile = () => {
  const user = { name: 'Kamal Perera', email: 'kamal@example.com', role: 'Student', enrolled: 4 };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 py-12 px-4 flex justify-center">
      <div className="w-full max-w-md bg-white rounded-[32px] border border-slate-100 shadow-xl p-8 text-center relative overflow-hidden">
        
        {/* Top styling band */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-[#1c0da1] to-[#0a044a]" />

        {/* Profile Avatar */}
        <div className="relative z-10 mx-auto w-24 h-24 bg-slate-200 border-4 border-white rounded-full flex items-center justify-center text-4xl mt-6 shadow-md">
          👤
        </div>

        {/* User Metadata */}
        <h3 className="text-2xl font-black text-slate-800 mt-4 tracking-tight">{user.name}</h3>
        <p className="text-xs font-bold text-[#1c0da1] uppercase tracking-widest mt-1">{user.role}</p>
        <p className="text-xs font-semibold text-slate-400 mt-0.5">{user.email}</p>

        {/* Action / Stats Grid */}
        <div className="grid grid-cols-1 bg-slate-50 rounded-2xl p-4 my-6 border border-slate-100">
          <span className="text-xs font-bold text-slate-500">Account Overview</span>
          <span className="text-xl font-black text-slate-800 mt-1">
            {user.role === 'Student' ? `${user.enrolled} Active Classes` : 'Verified Account'}
          </span>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button className="w-full py-3 bg-[#1c0da1] text-white font-bold rounded-xl text-xs hover:bg-[#0a044a] transition-all">Edit Profile Details</button>
          <button className="w-full py-3 bg-red-50 text-red-600 font-bold rounded-xl text-xs hover:bg-red-100 transition-all">Log Out Account</button>
        </div>

      </div>
    </div>
  );
};

export default UserProfile;