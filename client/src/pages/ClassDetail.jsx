import React from 'react';

const ClassDetail = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 px-4 max-w-7xl mx-auto">
      <div className="mb-6">
        <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-indigo-900 dark:text-indigo-300">Active</span>
        <h2 className="text-3xl font-bold font-display text-slate-900 dark:text-white mt-2">Class Details</h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Course Description</h3>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            This course covers the entire syllabus with special focus on past paper discussions and mock exams. Suitable for students targeting a high grade in the upcoming examination.
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 h-fit">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Enroll Now</h3>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mb-4">Rs. 3,500 / Month</div>
          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-all">
            Join Class
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClassDetail;