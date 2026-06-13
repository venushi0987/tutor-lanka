import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center pt-16 px-4">
      <div className="max-w-3xl text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold font-display text-slate-900 dark:text-white mb-6 leading-tight">
          Find the Perfect <span className="text-indigo-600 dark:text-indigo-400 bg-clip-text">Tutor</span> For Your Studies
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-xl mx-auto">
          Explore top-rated physical and online classes across Sri Lanka. Learn from expert educators and level up your grades.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/explore" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-all shadow-lg hover:shadow-indigo-500/20">
            Explore Classes
          </Link>
          <Link to="/register?role=tutor" className="bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold px-8 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 transition-all">
            Join as a Tutor
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;