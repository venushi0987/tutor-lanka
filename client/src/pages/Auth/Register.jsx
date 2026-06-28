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
  if (score <= 1) return { score, label: 'Weak', color: 'bg-red-500' };
  if (score <= 3) return { score, label: 'Medium', color: 'bg-yellow-500' };
  return { score, label: 'Strong', color: 'bg-emerald-500' };
};

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated, user } = useSelector(state => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordValue, setPasswordValue] = useState('');

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: { role: 'student' }
  });

  const strength = getPasswordStrength(passwordValue);

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
    { value: 'student', label: 'Student / Parent', icon: '🎓', desc: 'Find and book tutors' },
    { value: 'tutor', label: 'Tutor / Teacher', icon: '👨‍🏫', desc: 'Offer your classes' },
    { value: 'institute', label: 'Institute', icon: '🏛️', desc: 'Register your tuition center' },
  ];

  const selectedRole = watch('role');

  return (
    <div className="min-h-[calc(100vh-64px)] w-full flex bg-white overflow-hidden">
      {/* LEFT PANEL */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#1c0da1] via-[#2a1ab5] to-[#0a044a] relative p-14 items-center overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-white/10 rounded-full" />
        <div className="absolute top-1/2 right-8 w-48 h-48 bg-[#d9cb00]/10 rounded-full blur-2xl" />
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
            Join the<br />
            <span className="text-[#d9cb00]">Future</span> of<br />
            Education
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Connect with Sri Lanka's best tutors. Whether you're a student looking for expert guidance or a tutor ready to share knowledge — EduConnect is your platform.
          </p>
          <div className="space-y-3 pt-4">
            {[
              'Access 200+ verified tutors',
              'All subjects and grades covered',
              'Online & physical classes available',
              'Secure payments & reviews',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-[#d9cb00] flex-shrink-0" />
                <span className="text-white/80 text-sm font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full md:w-1/2 flex flex-col justify-center p-8 sm:p-12 md:p-14 bg-white overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="mb-7">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-6 bg-[#d9cb00] rounded-full" />
              <span className="text-xs font-bold text-[#1c0da1] uppercase tracking-widest">Create Account</span>
            </div>
            <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight">Sign Up</h2>
            <p className="text-sm text-slate-500 mt-1">Start your learning journey today</p>
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

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Role Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">I am a...</label>
              <div className="grid grid-cols-2 gap-3">
                {roleOptions.map(({ value, label, icon, desc }) => (
                  <label key={value} className="cursor-pointer">
                    <input type="radio" value={value} {...register('role')} className="sr-only" />
                    <div className={`p-3 rounded-xl border-2 transition-all text-center ${
                      selectedRole === value
                        ? 'border-[#1c0da1] bg-[#1c0da1]/5'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}>
                      <div className="text-2xl mb-1">{icon}</div>
                      <p className="text-xs font-bold text-slate-800">{label}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Full Name</label>
              <div className="relative flex items-center">
                <User className="absolute left-4 w-4 h-4 text-slate-400" />
                <input
                  {...register('name', {
                    required: 'Name is required',
                    minLength: { value: 2, message: 'At least 2 characters' }
                  })}
                  type="text"
                  placeholder="Kasun Perera"
                  className={`w-full pl-11 pr-4 py-3.5 bg-slate-50 rounded-xl outline-none border transition-all text-sm font-medium text-slate-700 ${
                    errors.name ? 'border-red-300' : 'border-slate-200 focus:border-[#1c0da1] focus:ring-4 focus:ring-[#1c0da1]/10'
                  }`}
                />
              </div>
              {errors.name && <p className="text-xs text-red-500 mt-1 font-medium">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Email Address</label>
              <div className="relative flex items-center">
                <Mail className="absolute left-4 w-4 h-4 text-slate-400" />
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' }
                  })}
                  type="email"
                  placeholder="you@example.com"
                  className={`w-full pl-11 pr-4 py-3.5 bg-slate-50 rounded-xl outline-none border transition-all text-sm font-medium text-slate-700 ${
                    errors.email ? 'border-red-300' : 'border-slate-200 focus:border-[#1c0da1] focus:ring-4 focus:ring-[#1c0da1]/10'
                  }`}
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1 font-medium">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Password</label>
              <div className="relative flex items-center">
                <Lock className="absolute left-4 w-4 h-4 text-slate-400" />
                <input
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'At least 6 characters' },
                    onChange: (e) => setPasswordValue(e.target.value),
                  })}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={`w-full pl-11 pr-12 py-3.5 bg-slate-50 rounded-xl outline-none border transition-all text-sm font-medium text-slate-700 ${
                    errors.password ? 'border-red-300' : 'border-slate-200 focus:border-[#1c0da1] focus:ring-4 focus:ring-[#1c0da1]/10'
                  }`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 text-slate-400 hover:text-[#1c0da1] transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1 font-medium">{errors.password.message}</p>}
              {passwordValue && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength.score ? strength.color : 'bg-slate-200'}`} />
                    ))}
                  </div>
                  <p className="text-xs mt-1 font-semibold" style={{ color: strength.score <= 1 ? '#ef4444' : strength.score <= 3 ? '#eab308' : '#10b981' }}>
                    {strength.label}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Confirm Password</label>
              <div className="relative flex items-center">
                <Lock className="absolute left-4 w-4 h-4 text-slate-400" />
                <input
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (val) => val === watch('password') || 'Passwords do not match',
                  })}
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={`w-full pl-11 pr-12 py-3.5 bg-slate-50 rounded-xl outline-none border transition-all text-sm font-medium text-slate-700 ${
                    errors.confirmPassword ? 'border-red-300' : 'border-slate-200 focus:border-[#1c0da1] focus:ring-4 focus:ring-[#1c0da1]/10'
                  }`}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 text-slate-400 hover:text-[#1c0da1] transition-colors">
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-500 mt-1 font-medium">{errors.confirmPassword.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#1c0da1] text-white font-bold rounded-xl hover:bg-[#0a044a] transition-all shadow-xl shadow-[#1c0da1]/20 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Create Account <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-6 font-semibold">
            Already have an account?{' '}
            <Link to="/login" className="font-black text-[#1c0da1] hover:text-[#d9cb00] transition-colors ml-1">
              Sign In
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;