import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, GraduationCap, ArrowRight, Shield, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { login, clearError } from '../../store/slices/authSlice';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, isAuthenticated, user } = useSelector(state => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const from = location.state?.from?.pathname;

  useEffect(() => {
    if (isAuthenticated && user) {
      const paths = { student: '/dashboard/student', tutor: '/dashboard/tutor', admin: '/dashboard/admin', institute: '/dashboard/institute' };
      navigate(from || paths[user.role] || '/', { replace: true });
    }
  }, [isAuthenticated, user, navigate, from]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const onSubmit = async (data) => {
    const result = await dispatch(login(data));
    if (login.fulfilled.match(result)) {
      const paths = { student: '/dashboard/student', tutor: '/dashboard/tutor', admin: '/dashboard/admin', institute: '/dashboard/institute' };
      toast.success(`Welcome back, ${result.payload.user.name.split(' ')[0]}! 👋`);
      navigate(from || paths[result.payload.user.role] || '/', { replace: true });
    } else {
      toast.error(result.payload || 'Login failed');
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] w-full flex bg-white overflow-hidden">

      {/* LEFT SIDE */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#1e40af] via-[#2563eb] to-[#0c1a3d] relative p-16 items-center overflow-hidden h-full">
        {/* Decorative circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-white/10 rounded-full" />
        <div className="absolute top-1/2 right-8 w-48 h-48 bg-[#d9cb00]/10 rounded-full blur-2xl" />
        <div className="absolute bottom-32 right-24 w-64 h-64 bg-[#1e40af] rounded-full filter blur-3xl opacity-50" />
        <div className="absolute top-24 left-32 w-32 h-32 bg-white/5 rounded-full blur-xl" />

        <div className="relative z-10 text-white space-y-6 max-w-lg">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-[#d9cb00] font-black text-lg tracking-wider">EduConnect</p>
              <p className="text-white/60 text-xs tracking-widest uppercase">Sri Lanka</p>
            </div>
          </div>

          <h2 className="text-5xl font-black tracking-tight leading-tight">
            Learn from the<br />
            <span className="text-[#d9cb00]">Best Tutors</span><br />
            in Sri Lanka
          </h2>
          <p className="text-slate-300 leading-relaxed text-sm">
            Join thousands of students who found their perfect tutor on EduConnect. Access verified educators for every subject, grade, and learning style.
          </p>

          <div className="grid grid-cols-3 gap-4 pt-4">
            {[['5000+', 'Students'], ['200+', 'Tutors'], ['1000+', 'Classes']].map(([num, label]) => (
              <div key={label} className="text-center p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10">
                <p className="text-[#d9cb00] font-black text-xl">{num}</p>
                <p className="text-white/70 text-xs font-medium mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full md:w-1/2 flex flex-col justify-center p-8 sm:p-12 md:p-16 relative bg-white h-full overflow-y-auto">
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-gradient-to-tl from-[#1e40af]/10 to-transparent rounded-tl-full pointer-events-none" />
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-[#d9cb00]/10 to-transparent rounded-br-full pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-6 bg-[#d9cb00] rounded-full" />
              <span className="text-xs font-bold text-[#1e40af] uppercase tracking-widest">Welcome back</span>
            </div>
            <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight">Sign In</h2>
            <p className="text-sm text-slate-500 mt-1">Continue your learning journey</p>
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
            {/* Email */}
            <div>
              <label className="input-label">Email Address</label>
              <div className="relative flex items-center">
                <Mail className="absolute left-4 w-4 h-4 text-slate-400" />
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email address' }
                  })}
                  type="email"
                  placeholder="you@example.com"
                  className={`input pl-11 ${errors.email ? 'border-red-300 focus:ring-red-200' : ''}`}
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1 font-medium">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="input-label">Password</label>
              <div className="relative flex items-center">
                <Lock className="absolute left-4 w-4 h-4 text-slate-400" />
                <input
                  {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Minimum 6 characters' } })}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={`input pl-11 pr-16 ${errors.password ? 'border-red-300' : ''}`}
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

            {/* Remember + Forgot */}
            <div className="flex justify-between items-center">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" className="w-4 h-4 accent-[#1e40af] rounded" />
                <span className="text-xs font-semibold text-slate-500">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-xs font-bold text-[#1e40af] hover:text-[#d9cb00] transition-colors">
                Forgot Password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#1e40af] text-white font-bold rounded-2xl hover:bg-[#0c1a3d] transition-all shadow-xl shadow-[#1e40af]/20 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Sign In <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          {/* Separator */}
          <div className="flex items-center my-6 gap-3">
            <div className="flex-grow h-px bg-slate-200" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Or</span>
            <div className="flex-grow h-px bg-slate-200" />
          </div>

          {/* Google */}
          <button
            type="button"
            className="w-full py-3.5 bg-white text-slate-700 font-bold rounded-2xl border-2 border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all text-sm flex items-center justify-center gap-3 shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0112 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.33 0 3.313 2.673 1.34 6.577l3.926 3.188z" />
              <path fill="#4285F4" d="M23.49 12.275c0-.818-.073-1.609-.21-2.373H12v4.51h6.44c-.277 1.491-1.12 2.755-2.383 3.6l3.727 2.89c2.182-2.01 3.44-4.964 3.44-8.627z" />
              <path fill="#FBBC05" d="M5.266 14.235L1.34 17.423C3.313 21.327 7.33 24 12 24c3.127 0 5.755-1.036 7.673-2.81l-3.727-2.89c-1.036.691-2.354 1.109-3.946 1.109-3.136 0-5.79-2.118-6.734-4.964z" />
              <path fill="#34A853" d="M12 19.39c-1.59 0-2.91-.418-3.946-1.11l-3.727 2.89C6.245 22.964 8.873 24 12 24c4.67 0 8.687-2.673 10.66-6.577l-3.926-3.188c-.945 2.845-3.599 4.964-6.734 4.964z" />
            </svg>
            Sign in with Google
          </button>

          <p className="text-center text-xs text-slate-400 mt-6 font-semibold">
            Don't have an account?{' '}
            <Link to="/register" className="font-black text-[#1e40af] hover:text-[#d9cb00] transition-colors ml-1">
              Sign Up
            </Link>
          </p>              <div className="mt-4 flex items-center justify-center gap-4">
            <Link to="/institute/login" className="inline-flex items-center gap-1.5 text-xs text-[#1e40af] hover:text-[#d9cb00] transition-colors font-bold">
              <Building2 className="w-3 h-3" />
              Institute Portal
            </Link>
            <span className="text-slate-200">|</span>
            <Link to="/admin/login" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors">
              <Shield className="w-3 h-3" />
              Admin Portal
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;