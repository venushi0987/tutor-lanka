import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, Shield, ArrowRight, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { login, logout, clearError } from '../../store/slices/authSlice';

const AdminLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated, user } = useSelector(state => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      navigate('/dashboard/admin', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => { dispatch(clearError()); }, [dispatch]);

  const onSubmit = async (data) => {
    const result = await dispatch(login(data));
    if (login.fulfilled.match(result)) {
      if (result.payload.user.role !== 'admin') {
        await dispatch(logout());
        toast.error('Access denied. Admin credentials required.');
        return;
      }
      toast.success('Welcome, Administrator!');
      navigate('/dashboard/admin', { replace: true });
    } else {
      toast.error(result.payload || 'Login failed');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] w-full flex items-center justify-center bg-slate-950 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-red-700/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[200px] bg-orange-700/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-red-900/20 rounded-full blur-3xl pointer-events-none" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md mx-auto px-6"
      >
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl shadow-black/50">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-red-600/30">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-black text-white">Admin Portal</h1>
            <p className="text-slate-400 text-sm mt-1">Restricted access — administrators only</p>
          </div>

          {/* Warning banner */}
          <div className="flex items-center gap-2 mb-6 p-3 bg-orange-900/30 border border-orange-700/40 rounded-xl">
            <AlertTriangle className="w-4 h-4 text-orange-400 flex-shrink-0" />
            <p className="text-orange-300 text-xs font-semibold">This area is for authorized administrators only. Unauthorized access attempts are logged.</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3 bg-red-900/40 border border-red-700/50 rounded-xl text-sm text-red-300 font-medium flex items-center gap-2"
            >
              <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Admin Email</label>
              <div className="relative flex items-center">
                <Mail className="absolute left-4 w-4 h-4 text-slate-500" />
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' }
                  })}
                  type="email"
                  placeholder="admin@educonnect.lk"
                  className={`w-full pl-11 pr-4 py-4 bg-slate-800/80 rounded-xl outline-none border transition-all text-sm font-medium text-white placeholder:text-slate-600 ${
                    errors.email ? 'border-red-500' : 'border-slate-700 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                  }`}
                />
              </div>
              {errors.email && <p className="text-xs text-red-400 mt-1 font-medium">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Password</label>
              <div className="relative flex items-center">
                <Lock className="absolute left-4 w-4 h-4 text-slate-500" />
                <input
                  {...register('password', { required: 'Password is required' })}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={`w-full pl-11 pr-12 py-4 bg-slate-800/80 rounded-xl outline-none border transition-all text-sm font-medium text-white placeholder:text-slate-600 ${
                    errors.password ? 'border-red-500' : 'border-slate-700 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                  }`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 text-slate-500 hover:text-red-400 transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-400 mt-1 font-medium">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold rounded-xl hover:from-red-700 hover:to-orange-700 transition-all shadow-lg shadow-red-600/20 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Access Admin Panel <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="text-xs text-slate-500 hover:text-slate-300 transition-colors font-semibold">
              ← Back to regular login
            </Link>
          </div>
        </div>

        <p className="text-center text-slate-600 text-xs mt-4">
          EduConnect Sri Lanka © {new Date().getFullYear()} — All access is monitored and logged
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
