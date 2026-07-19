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
    <div className="min-h-[calc(100vh-64px)] w-full flex bg-dark-950 overflow-hidden">

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex lg:w-[45%] auth-panel-left p-14 items-center relative">
        {/* Ambient glows */}
        <div className="glow-orb glow-orb-primary w-96 h-96 -top-20 -right-20 opacity-40 animate-float" />
        <div className="glow-orb glow-orb-gold    w-64 h-64 bottom-10 left-10 opacity-25 animate-float-delayed" />
        <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />

        <div className="relative z-10 text-white w-full max-w-sm">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-700 to-primary-500 rounded-2xl flex items-center justify-center shadow-glow">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-black text-xl text-white tracking-tight">EduConnect</p>
              <p className="text-gold-400 text-xs font-bold tracking-[0.2em] uppercase">Sri Lanka</p>
            </div>
          </div>

          <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight mb-6">
            Learn from the
            <br />
            <span className="gradient-text-gold">Best Tutors</span>
            <br />
            in Sri Lanka
          </h2>

          <p className="text-slate-400 leading-relaxed mb-10">
            Join thousands of students who found their perfect tutor on EduConnect.
            Verified educators for every subject and grade.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[['10K+', 'Students'], ['500+', 'Tutors'], ['2K+', 'Classes']].map(([num, label]) => (
              <div key={label} className="glass-card rounded-2xl p-4 text-center">
                <p className="text-gold-400 font-black text-xl">{num}</p>
                <p className="text-slate-400 text-xs font-medium mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Trust indicator */}
          <div className="mt-8 flex items-center gap-3 glass-card rounded-2xl px-4 py-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
            <p className="text-sm text-slate-300 font-medium">
              🔒 Secure, encrypted login — 100% safe
            </p>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL — Form ── */}
      <div className="w-full lg:w-[55%] flex flex-col justify-center p-8 sm:p-12 md:p-16 relative overflow-y-auto">
        {/* Subtle background decoration */}
        <div className="absolute bottom-0 right-0 w-64 h-64 pointer-events-none opacity-20"
          style={{ background: 'radial-gradient(circle at bottom right, rgba(37,99,235,0.3) 0%, transparent 70%)' }}
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="w-full max-w-md mx-auto"
        >
          {/* Mobile-only logo */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-700 to-primary-500 rounded-xl flex items-center justify-center shadow-glow">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-black text-white text-base tracking-tight">EduConnect</span>
              <span className="text-[10px] font-bold text-gold-400 tracking-[0.2em] uppercase">Sri Lanka</span>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-6 bg-gradient-to-b from-gold-400 to-gold-500 rounded-full" />
              <span className="text-xs font-bold text-gold-400 uppercase tracking-widest">Welcome back</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Sign In</h1>
            <p className="text-sm text-slate-400 mt-1">Continue your learning journey</p>
          </div>

          {/* Error alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-sm text-red-400 font-medium flex items-center gap-2"
            >
              <span className="w-2 h-2 bg-red-400 rounded-full flex-shrink-0" />
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" id="login-form">

            {/* Email */}
            <div>
              <label className="input-label" htmlFor="login-email">Email Address</label>
              <div className="relative flex items-center">
                <Mail className="absolute left-4 w-4 h-4 text-slate-500 pointer-events-none" />
                <input
                  id="login-email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email address' }
                  })}
                  type="email"
                  placeholder="you@example.com"
                  className={`input pl-11 ${errors.email ? 'border-red-500/50 focus:border-red-400' : ''}`}
                />
              </div>
              {errors.email && <p className="text-xs text-red-400 mt-1.5 font-medium">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="input-label" htmlFor="login-password">Password</label>
              <div className="relative flex items-center">
                <Lock className="absolute left-4 w-4 h-4 text-slate-500 pointer-events-none" />
                <input
                  id="login-password"
                  {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Minimum 6 characters' } })}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={`input pl-11 pr-12 ${errors.password ? 'border-red-500/50' : ''}`}
                />
                <button
                  type="button"
                  id="login-toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-slate-500 hover:text-primary-400 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-400 mt-1.5 font-medium">{errors.password.message}</p>}
            </div>

            {/* Remember + Forgot */}
            <div className="flex justify-between items-center">
              <label className="flex items-center gap-2 cursor-pointer select-none group">
                <input type="checkbox" id="login-remember" className="w-4 h-4 rounded accent-primary-500 bg-dark-800 border-white/20" />
                <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-xs font-bold text-primary-400 hover:text-gold-400 transition-colors" id="login-forgot-link">
                Forgot Password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              id="login-submit-btn"
              disabled={loading}
              className="w-full btn-primary py-4 text-base rounded-2xl justify-center disabled:opacity-60 disabled:cursor-not-allowed"
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
            <div className="flex-grow h-px bg-white/8" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Or</span>
            <div className="flex-grow h-px bg-white/8" />
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            id="login-google-btn"
            className="w-full py-3.5 glass-card text-slate-300 font-bold rounded-2xl hover:border-white/20 hover:text-white transition-all text-sm flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0112 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.33 0 3.313 2.673 1.34 6.577l3.926 3.188z" />
              <path fill="#4285F4" d="M23.49 12.275c0-.818-.073-1.609-.21-2.373H12v4.51h6.44c-.277 1.491-1.12 2.755-2.383 3.6l3.727 2.89c2.182-2.01 3.44-4.964 3.44-8.627z" />
              <path fill="#FBBC05" d="M5.266 14.235L1.34 17.423C3.313 21.327 7.33 24 12 24c3.127 0 5.755-1.036 7.673-2.81l-3.727-2.89c-1.036.691-2.354 1.109-3.946 1.109-3.136 0-5.79-2.118-6.734-4.964z" />
              <path fill="#34A853" d="M12 19.39c-1.59 0-2.91-.418-3.946-1.11l-3.727 2.89C6.245 22.964 8.873 24 12 24c4.67 0 8.687-2.673 10.66-6.577l-3.926-3.188c-.945 2.845-3.599 4.964-6.734 4.964z" />
            </svg>
            Continue with Google
          </button>

          {/* Footer links */}
          <p className="text-center text-xs text-slate-500 mt-6 font-semibold">
            Don't have an account?{' '}
            <Link to="/register" className="font-black text-primary-400 hover:text-gold-400 transition-colors ml-1" id="login-signup-link">
              Sign Up Free
            </Link>
          </p>

          <div className="mt-4 flex items-center justify-center gap-4">
            <Link to="/institute/login" id="login-institute-link" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-primary-400 transition-colors font-bold">
              <Building2 className="w-3 h-3" />
              Institute Portal
            </Link>
            <span className="w-px h-3 bg-white/15" />
            <Link to="/admin/login" id="login-admin-link" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors">
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