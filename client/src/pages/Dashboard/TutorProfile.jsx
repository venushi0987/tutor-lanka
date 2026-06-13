import React from 'react';

const TutorProfile = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 px-4 max-w-7xl mx-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-8 items-center md:items-start">
        <div className="w-24 h-24 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-3xl font-bold">
          TP
        </div>
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl font-bold font-display text-slate-900 dark:text-white">Tutor Profile</h2>
          <p className="text-indigo-600 dark:text-indigo-400 font-medium mt-1">B.Sc. Physical Science (University of Colombo)</p>
          <p className="text-slate-500 mt-4 max-w-2xl">
            Experienced mathematics and physics tutor providing personalized guidance to help students excel in their local and London A/L examinations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TutorProfile;