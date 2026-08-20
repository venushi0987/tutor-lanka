import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import {
  Eye, EyeOff, Mail, Lock, User, GraduationCap, ArrowRight, BookOpen, CheckCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { register as registerUser, clearError } from '../../store/slices/authSlice';

const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return { score, label: 'Weak',   color: 'bg-red-500' };
  if (score <= 3) return { score, label: 'Medium',  color: 'bg-amber-500' };
  return { score, label: 'Strong', color: 'bg-emerald-500' };
};

const Register = () => {
  const dispatch = useDispatch();
  const navigate  = useNavigate();
  const { loading, error, isAuthenticated, user } = useSelector(state => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm,  setShowConfirm]  = useState(false);
  const [passwordValue, setPasswordValue] = useState('');

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: { role: 'student' }
  });

  const strength    = getPasswordStrength(passwordValue);
  const selectedRole = watch('role');

  useEffect(() => {
    if (isAuthenticated && user) {
      const paths = { student: '/dashboard/student', tutor: '/dashboard/tutor', admin: '/dashboard/admin', institute: '/dashboard/institute' };
      navigate(paths[user.role] || '/', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const onSubmit = async (data) => {
    const { confirmPassword, ...payload } = data;
    const result = await dispatch(registerUser(payload));
    if (registerUser.fulfilled.match(result)) {
      const paths = { student: '/dashboard/student', tutor: '/dashboard/tutor', institute: '/dashboard/institute' };
      toast.success(`Welcome to EduConnect, ${result.payload.user.name.split(' ')[0]}! 🎉`);
      navigate(paths[result.payload.user.role] || '/', { replace: true });
    } else {
      toast.error(result.payload || 'Registration failed');
    }
  };

  const roleOptions = [
    { value: 'student',   label: 'Student / Parent', icon: '🎓', desc: 'Find & book tutors',    gradient: 'from-blue-500 to-blue-700' },
    { value: 'tutor',     label: 'Tutor / Teacher',  icon: '👨‍🏫', desc: 'Offer your classes',    gradient: 'from-emerald-500 to-teal-700' },
    { value: 'institute', label: 'Institute',         icon: '🏛️',  desc: 'Register tuition center', gradient: 'from-violet-500 to-purple-700' },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] w-full flex bg-dark-950 overflow-hidden">

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex lg:w-[45%] auth-panel-left p-14 items-center relative">
        <div className="glow-orb glow-orb-primary w-96 h-96 -top-20 -left-20 opacity-40 animate-float" />
        <div className="glow-orb glow-orb-gold    w-64 h-64 bottom-20 right-10 opacity-25 animate-float-delayed" />
        <div className="absolute inset-0 bg-dots opacity-25 pointer-events-none" />

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
            Join the
            <br />
            <span className="gradient-text-gold">Future</span> of
            <br />
            Education
          </h2>

          <p className="text-slate-400 leading-relaxed mb-8">
            Connect with Sri Lanka's best tutors. Whether you're a student or a tutor ready to share knowledge — EduConnect is your platform.
          </p>

          <div className="space-y-3">
            {[
              'Access 500+ verified tutors',
              'All subjects and grades covered',
              'Online & physical classes available',
              'Free to register, no hidden fees',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-gold-400/20 border border-gold-400/40 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-3 h-3 text-gold-400" />
                </div>
                <span className="text-slate-300 text-sm font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="w-full lg:w-[55%] flex flex-col justify-center p-8 sm:p-12 md:p-14 relative overflow-y-auto">
        <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none opacity-15"
          style={{ background: 'radial-gradient(circle at top right, rgba(37,99,235,0.4) 0%, transparent 70%)' }}
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="w-full max-w-md mx-auto"
        >
          {/* Mobile logo */}
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
          <div className="mb-7">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-6 bg-gradient-to-b from-gold-400 to-gold-500 rounded-full" />
              <span className="text-xs font-bold text-gold-400 uppercase tracking-widest">Create Account</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Sign Up</h1>
            <p className="text-sm text-slate-400 mt-1">Start your learning journey today</p>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-sm text-red-400 font-medium flex items-center gap-2"
            >
              <span className="w-2 h-2 bg-red-400 rounded-full flex-shrink-0" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" id="register-form">

            {/* Role Selection */}
            <div>
              <label className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider block">I am a...</label>
              <div className="grid grid-cols-3 gap-2.5">
                {roleOptions.map(({ value, label, icon, desc, gradient }) => (
                  <label key={value} className="cursor-pointer" id={`role-${value}`}>
                    <input type="radio" value={value} {...register('role')} className="sr-only" />
                    <div className={`p-3 rounded-2xl border transition-all text-center ${
                      selectedRole === value
                        ? 'border-primary-500/60 bg-primary-500/15 shadow-glass'
                        : 'border-white/8 bg-white/4 hover:border-white/15 hover:bg-white/6'
                    }`}>
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-xl mx-auto mb-2 ${
                        selectedRole === value ? 'shadow-glow' : ''
                      }`}>
                        {icon}
                      </div>
                      <p className={`text-xs font-bold ${selectedRole === value ? 'text-white' : 'text-slate-300'}`}>{label}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="input-label" htmlFor="register-name">Full Name</label>
              <div className="relative flex items-center">
                <User className="absolute left-4 w-4 h-4 text-slate-500 pointer-events-none" />
                <input
                  id="register-name"
                  {...register('name', {
                    required: 'Name is required',
                    minLength: { value: 2, message: 'At least 2 characters' }
                  })}
                  type="text"
                  placeholder="Kasun Perera"
                  className={`input pl-11 ${errors.name ? 'border-red-500/50' : ''}`}
                />
              </div>
              {errors.name && <p className="text-xs text-red-400 mt-1.5 font-medium">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="input-label" htmlFor="register-email">Email Address</label>
              <div className="relative flex items-center">
                <Mail className="absolute left-4 w-4 h-4 text-slate-500 pointer-events-none" />
                <input
                  id="register-email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' }
                  })}
                  type="email"
                  placeholder="you@example.com"
                  className={`input pl-11 ${errors.email ? 'border-red-500/50' : ''}`}
                />
              </div>
              {errors.email && <p className="text-xs text-red-400 mt-1.5 font-medium">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="input-label" htmlFor="register-password">Password</label>
              <div className="relative flex items-center">
                <Lock className="absolute left-4 w-4 h-4 text-slate-500 pointer-events-none" />
                <input
                  id="register-password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'At least 6 characters' },
                    onChange: (e) => setPasswordValue(e.target.value),
                  })}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={`input pl-11 pr-12 ${errors.password ? 'border-red-500/50' : ''}`}
                />
                <button
                  type="button"
                  id="register-toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-slate-500 hover:text-primary-400 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-400 mt-1.5 font-medium">{errors.password.message}</p>}

              {/* Password strength meter */}
              {passwordValue && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          i <= strength.score ? strength.color : 'bg-white/10'
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs mt-1 font-semibold ${
                    strength.score <= 1 ? 'text-red-400' : strength.score <= 3 ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {strength.label}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="input-label" htmlFor="register-confirm">Confirm Password</label>
              <div className="relative flex items-center">
                <Lock className="absolute left-4 w-4 h-4 text-slate-500 pointer-events-none" />
                <input
                  id="register-confirm"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (val) => val === watch('password') || 'Passwords do not match',
                  })}
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={`input pl-11 pr-12 ${errors.confirmPassword ? 'border-red-500/50' : ''}`}
                />
                <button
                  type="button"
                  id="register-toggle-confirm"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 text-slate-500 hover:text-primary-400 transition-colors"
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-400 mt-1.5 font-medium">{errors.confirmPassword.message}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              id="register-submit-btn"
              disabled={loading}
              className="w-full btn-primary py-4 text-base rounded-2xl justify-center disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Create Account <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 mt-6 font-semibold">
            Already have an account?{' '}
            <Link to="/login" id="register-signin-link" className="font-black text-primary-400 hover:text-gold-400 transition-colors ml-1">
              Sign In
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;