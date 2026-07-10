import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, Building2, ArrowRight, MapPin, BookOpen, Users, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { login, clearError } from '../../store/slices/authSlice';

const instituteFeatures = [
  { icon: BookOpen, text: 'Manage tuition classes' },
  { icon: MapPin, text: 'Add hall locations on map' },
  { icon: Users, text: 'Track student enrollments' },
  { icon: Star, text: 'Build your institute brand' },
];

const SAMPLE_INSTITUTES = [
  { name: 'Sarasavi Institute', subjects: 'Science & Maths', color: 'from-blue-600 to-blue-800' },
  { name: 'Gathika Education', subjects: 'All Subjects', color: 'from-emerald-600 to-emerald-800' },
  { name: 'DP Education', subjects: 'ICT & Business', color: 'from-indigo-600 to-indigo-800' },
  { name: 'Sipwin Academy', subjects: 'English & Languages', color: 'from-rose-600 to-rose-800' },
];

const InstituteLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated, user } = useSelector(state => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    if (isAuthenticated && user?.role === 'institute') {
      navigate('/dashboard/institute', { replace: true });
    } else if (isAuthenticated && user) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const onSubmit = async (data) => {
    const result = await dispatch(login(data));
    if (login.fulfilled.match(result)) {
      if (result.payload.user.role === 'institute') {
        toast.success(`Welcome back, ${result.payload.user.name.split(' ')[0]}! 🏛️`);
        navigate('/dashboard/institute', { replace: true });
      } else {
        toast.success('Please use the student/tutor login page');
        navigate('/login', { replace: true });
      }
    } else {
      toast.error(result.payload || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50 overflow-hidden">
      {/* LEFT PANEL - Institute Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#1e40af] via-[#2563eb] to-[#0c1a3d] relative p-12 items-center overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-white/10 rounded-full" />
        <div className="absolute top-1/3 right-12 w-64 h-64 bg-[#d9cb00]/10 rounded-full blur-3xl" />

        <div className="relative z-10 text-white space-y-8 max-w-lg">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
              <Building2 className="w-7 h-7 text-[#d9cb00]" />
            </div>
            <div>
              <p className="text-[#d9cb00] font-black text-xl tracking-wider">Institute Portal</p>
              <p className="text-white/50 text-xs tracking-widest uppercase">EduConnect Sri Lanka</p>
            </div>
          </div>

          <div>
            <h2 className="text-4xl font-black tracking-tight leading-tight">
              Manage Your<br />
              <span className="text-[#d9cb00]">Tuition Institute</span><br />
              from One Place
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed mt-4">
              Join leading institutes like Sarasavi, Gathika, DP Education, and Sipwin on Sri Lanka's
              premier education platform.
            </p>
          </div>

          <div className="space-y-3">
            {instituteFeatures.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                  <Icon className="w-4 h-4 text-[#d9cb00]" />
                </div>
                <span className="text-white/80 text-sm font-medium">{text}</span>
              </div>
            ))}
          </div>

          {/* Sample Institutes */}
          <div className="pt-2">
            <p className="text-xs text-white/50 uppercase tracking-wider font-semibold mb-3">Trusted by</p>
            <div className="grid grid-cols-2 gap-2">
              {SAMPLE_INSTITUTES.map((inst) => (
                <div key={inst.name} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/10">
                  <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${inst.color} flex items-center justify-center text-white text-xs font-bold`}>
                    {inst.name[0]}
                  </div>
                  <div className="leading-tight">
                    <p className="text-xs font-bold text-white">{inst.name}</p>
                    <p className="text-[10px] text-white/50">{inst.subjects}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 sm:p-12 lg:p-16 bg-white overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-6 bg-[#d9cb00] rounded-full" />
              <span className="text-xs font-bold text-[#1e40af] uppercase tracking-widest">Institute Portal</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Institute Sign In</h2>
            <p className="text-sm text-slate-500 mt-1">Access your institute dashboard</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 font-medium flex items-center gap-2"
            >
              <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Email Address</label>
              <div className="relative flex items-center">
                <Mail className="absolute left-4 w-4 h-4 text-slate-400" />
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email address' }
                  })}
                  type="email"
                  placeholder="institute@example.com"
                  className={`w-full pl-11 pr-4 py-3.5 bg-slate-50 rounded-xl outline-none border transition-all text-sm font-medium text-slate-700 ${
                    errors.email ? 'border-red-300' : 'border-slate-200 focus:border-[#1e40af] focus:ring-4 focus:ring-[#1e40af]/10'
                  }`}
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1 font-medium">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Password</label>
              <div className="relative flex items-center">
                <Lock className="absolute left-4 w-4 h-4 text-slate-400" />
                <input
                  {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Minimum 6 characters' } })}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={`w-full pl-11 pr-12 py-3.5 bg-slate-50 rounded-xl outline-none border transition-all text-sm font-medium text-slate-700 ${
                    errors.password ? 'border-red-300' : 'border-slate-200 focus:border-[#1e40af] focus:ring-4 focus:ring-[#1e40af]/10'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-slate-400 hover:text-[#1e40af] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1 font-medium">{errors.password.message}</p>}
            </div>

            <div className="flex justify-between items-center">
              <Link to="/forgot-password" className="text-xs font-bold text-[#1e40af] hover:text-[#d9cb00] transition-colors">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-[#1e40af] to-[#2563eb] text-white font-bold rounded-2xl hover:from-[#0c1a3d] hover:to-[#1e40af] transition-all shadow-xl shadow-[#1e40af]/20 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Sign In to Dashboard <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex-grow h-px bg-slate-200" />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">New Institute?</span>
              <div className="flex-grow h-px bg-slate-200" />
            </div>

            <Link
              to="/register"
              className="block w-full py-3.5 bg-white text-[#1e40af] font-bold rounded-2xl border-2 border-[#1e40af]/20 hover:bg-[#1e40af]/5 hover:border-[#1e40af] transition-all text-sm text-center"
            >
              Register Your Institute
            </Link>

            <Link
              to="/login"
              className="block w-full text-center text-xs text-slate-400 hover:text-slate-600 transition-colors font-semibold"
            >
              ← Student / Tutor Login
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default InstituteLogin;
