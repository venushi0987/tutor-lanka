import React from 'react';

const Explore = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 px-4 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold font-display text-slate-900 dark:text-white">Find Classes & Tutors</h2>
        <p className="text-slate-500">Discover the best learning opportunities around you.</p>
      </div>
      
      {/* Search Bar */}
      <div className="w-full max-w-xl mb-8">
        <input 
          type="text" 
          placeholder="Search subjects, tutors, or locations..." 
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
        />
      </div>

      {/* Placeholder Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((item) => (
          <div key={item} className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 tracking-wide uppercase">Mathematics</span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">Combined Maths 2026 Revision</h3>
            <p className="text-sm text-slate-500 mt-2">By Expert Tutor • Colombo & Online</p>
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <span className="font-bold text-slate-900 dark:text-white">Rs. 3,500/mo</span>
              <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">View Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Explore;