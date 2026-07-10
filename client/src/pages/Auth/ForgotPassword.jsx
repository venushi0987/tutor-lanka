import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight, CheckCircle, GraduationCap, ArrowLeft } from 'lucide-react';
import api from '../../services/api';

const ForgotPassword = () => {
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [serverMessage, setServerMessage] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setStatus('loading');
    try {
      const res = await api.post('/auth/forgot-password', data);
      setServerMessage(res.data.message || 'Reset link sent!');
      setStatus('success');
    } catch (err) {
      setServerMessage(err.response?.data?.message || 'Something went wrong. Please try again.');
      setStatus('error');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] w-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/60 p-8 border border-slate-100">
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-[#1e40af] to-[#2563eb] rounded-xl flex items-center justify-center shadow-md shadow-[#1e40af]/30">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-black text-[#1e40af] text-sm block leading-none">EduConnect</span>
              <span className="text-[#d9cb00] text-[9px] font-bold tracking-widest uppercase">Sri Lanka</span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {status !== 'success' ? (
              <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h2 className="text-3xl font-extrabold text-slate-800 mb-2">Forgot Password?</h2>
                <p className="text-slate-500 text-sm mb-7 leading-relaxed">
                  No worries! Enter your email and we'll send you a reset link.
                </p>

                {status === 'error' && (
                  <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 font-medium">
                    {serverMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Email Address</label>
                    <div className="relative flex items-center">
                      <Mail className="absolute left-4 w-4 h-4 text-slate-400" />
                      <input
                        {...register('email', {
                          required: 'Email is required',
                          pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' }
                        })}
                        type="email"
                        placeholder="you@example.com"
                        className={`w-full pl-11 pr-4 py-4 bg-slate-50 rounded-2xl outline-none border transition-all text-sm font-medium text-slate-700 ${
                          errors.email ? 'border-red-300' : 'border-slate-200 focus:border-[#1e40af] focus:ring-4 focus:ring-[#1e40af]/10'
                        }`}
                      />
                    </div>
                    {errors.email && <p className="text-xs text-red-500 mt-1 font-medium">{errors.email.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full py-4 bg-[#1e40af] text-white font-bold rounded-2xl hover:bg-[#0c1a3d] transition-all shadow-xl shadow-[#1e40af]/20 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {status === 'loading' ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>Send Reset Link <ArrowRight className="w-4 h-4" /></>
                    )}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="text-center py-4"
              >
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
                  <CheckCircle className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-800 mb-3">Check Your Email</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {serverMessage}
                </p>
                <p className="text-slate-400 text-xs mt-3">
                  The link will expire in 15 minutes.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-[#1e40af] font-bold hover:text-[#0c1a3d] transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
