import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
  const [role, setRole] = useState('student');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Register Data:', { ...formData, role });
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-slate-50 flex flex-col items-center justify-center px-4 py-10">
      
      {/* Register Card */}
      <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xl shadow-slate-200/50">
        
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create Account</h2>
          <p className="text-sm text-slate-500 mt-1">Join EduConnect Sri Lanka today</p>
        </div>

        {/* Role Selector Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div 
            onClick={() => setRole('student')}
            className={`p-3.5 rounded-xl border text-center cursor-pointer transition-all duration-200 ${role === 'student' ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-600/10' : 'border-slate-200 bg-white hover:bg-slate-50'}`}
          >
            <span className="block font-bold text-sm text-slate-900">🎓 Student</span>
            <span className="text-xs text-slate-400">Want to learn</span>
          </div>
          <div 
            onClick={() => setRole('tutor')}
            className={`p-3.5 rounded-xl border text-center cursor-pointer transition-all duration-200 ${role === 'tutor' ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-600/10' : 'border-slate-200 bg-white hover:bg-slate-50'}`}
          >
            <span className="block font-bold text-sm text-slate-900">👨‍🏫 Tutor</span>
            <span className="text-xs text-slate-400">Want to teach</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
            <input 
              type="text" 
              required
              placeholder="Kamal Perera"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm shadow-sm"
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
            <input 
              type="email" 
              required
              placeholder="kamal@example.com"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm shadow-sm"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
            <input 
              type="password" 
              required
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm shadow-sm"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-md shadow-indigo-600/10 transform hover:-translate-y-0.5 text-sm mt-2"
          >
            Register as {role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center mt-6 pt-4 border-t border-slate-100">
          <p className="text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">Sign In</Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Register;