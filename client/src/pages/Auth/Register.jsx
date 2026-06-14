import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Register Submitting:', formData);
    navigate('/login');
  };

  return (
    <div className="h-[calc(100vh-64px)] w-full flex bg-white overflow-hidden">
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#1c0da1] to-[#0a044a] relative p-16 items-center overflow-hidden h-full">
        <div className="absolute -top-20 -right-20 w-[450px] h-[450px] bg-gradient-to-b from-white/5 to-transparent rounded-full pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-gradient-to-tr from-white/10 to-transparent rounded-full pointer-events-none" />
        <div className="relative z-10 text-white space-y-4 max-w-lg">
          <h2 className="text-5xl font-black tracking-wider uppercase">Join Us</h2>
          <h3 className="text-2xl font-bold tracking-widest text-[#d9cb00] uppercase">Tutor Lanka Network</h3>
          <p className="text-sm text-slate-200/70 leading-relaxed pt-2">Create your account and explore thousands of certified tutors or manage your educational facilities seamlessly.</p>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex flex-col justify-center p-8 sm:p-16 relative bg-white h-full overflow-y-auto">
        <div className="w-full max-w-md mx-auto">
          <div className="mb-6">
            <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight">Sign up</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative flex items-center">
              <span className="absolute left-4">📝</span>
              <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="Full Name" className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl outline-none border border-slate-100 focus:border-[#1c0da1] text-sm font-medium" />
            </div>

            <div className="relative flex items-center">
              <span className="absolute left-4">✉️</span>
              <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="Email Address" className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl outline-none border border-slate-100 focus:border-[#1c0da1] text-sm font-medium" />
            </div>

            {/* Role Dropdown with Institute/Hall Option */}
            <div className="relative flex items-center">
              <span className="absolute left-4">🎓</span>
              <select name="role" value={formData.role} onChange={handleChange} className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl outline-none border border-slate-100 focus:border-[#1c0da1] text-sm font-medium bg-white cursor-pointer appearance-none">
                <option value="student">🎓 Student / Parent</option>
                <option value="tutor">👨‍🏫 Tutor (Teacher)</option>
                <option value="hall">🏫 Class Hall Owner / Institute</option>
              </select>
              <span className="absolute right-4 text-xs pointer-events-none text-slate-400">▼</span>
            </div>

            <div className="relative flex items-center">
              <span className="absolute left-4">🔒</span>
              <input type="password" name="password" required value={formData.password} onChange={handleChange} placeholder="Password" className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl outline-none border border-slate-100 focus:border-[#1c0da1] text-sm font-medium" />
            </div>

            <button type="submit" className="w-full py-4 bg-[#1c0da1] text-white font-bold rounded-2xl hover:bg-[#0a044a] transition-all text-sm shadow-xl tracking-wide mt-4">Sign up</button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-8 font-semibold">
            Already have an account? <Link to="/login" className="font-black text-[#1c0da1] hover:underline ml-1">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;