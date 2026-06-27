import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { registerUser, clearError } from '../../store/slices/authSlice'; 
import { useForm } from 'react-hook-form';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated, user, error } = useSelector((state) => state.auth);

  // 💡 register: registerField ලෙස alias කර ඇත
  const { register: registerField, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'student'
    }
  });

  const selectedRole = watch('role');
  const passwordValue = watch('password') || ''; 

  // 🔒 Password Strength Logic
  const getPasswordStrength = (password) => {
    if (!password) return { label: '', color: 'bg-transparent', textColor: '' };
    if (password.length < 4) return { label: 'Weak 🔴', color: 'bg-red-500 w-1/3', textColor: 'text-red-500' };
    if (password.length < 8) return { label: 'Medium 🟡', color: 'bg-yellow-500 w-2/3', textColor: 'text-yellow-600' };
    return { label: 'Strong 🟢', color: 'bg-green-500 w-full', textColor: 'text-green-600' };
  };

  const strength = getPasswordStrength(passwordValue);

  useEffect(() => {
    if (isAuthenticated && user) {
      const paths = { 
        student: '/dashboard/student', 
        tutor: '/dashboard/tutor', 
        hall_owner: '/dashboard/hall', 
        admin: '/dashboard/admin' 
      };
      navigate(paths[user.role] || '/', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (typeof clearError === 'function') dispatch(clearError());
  }, [dispatch]);

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      return toast.error('Passwords do not match!');
    }
    if (data.password.length < 4) {
      return toast.error('Password is too weak!');
    }

    const { confirmPassword, ...payload } = data;
    const result = await dispatch(registerUser(payload));
    
    if (registerUser.fulfilled && registerUser.fulfilled.match(result)) {
      const paths = { 
        student: '/dashboard/student', 
        tutor: '/dashboard/tutor', 
        hall_owner: '/dashboard/hall', 
        admin: '/dashboard/admin' 
      };
      toast.success(`Welcome to EduConnect, ${result.payload.user.name.split(' ')[0]}! 🎉`);
      navigate(paths[result.payload.user.role] || '/', { replace: true });
    } else {
      toast.error(result.payload || 'Registration failed');
    }
  };

  const roleOptions = [
    { value: 'student', label: 'Student / Parent', icon: '🎓', desc: 'Find and book tutors' },
    { value: 'tutor', label: 'Tutor / Teacher', icon: '👨‍🏫', desc: 'Offer your classes' },
    { value: 'hall_owner', label: 'Class Hall Owner', icon: '🏫', desc: 'Rent your venue' },
  ];

  return (
    <div className="h-[calc(100vh-64px)] w-full flex bg-white overflow-hidden mt-16">
      
      {/* Left Banner */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#1c0da1] to-[#0a044a] relative p-16 items-center overflow-hidden h-full">
        <div className="absolute -top-20 -right-20 w-[450px] h-[450px] bg-gradient-to-b from-white/5 to-transparent rounded-full pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-gradient-to-tr from-white/10 to-transparent rounded-full pointer-events-none" />
        <div className="relative z-10 text-white space-y-4 max-w-lg">
          <h2 className="text-5xl font-black tracking-wider uppercase">Join Us</h2>
          <h3 className="text-2xl font-bold tracking-widest text-[#d9cb00] uppercase">Tutor Lanka Network</h3>
          <p className="text-sm text-slate-200/70 leading-relaxed pt-2">Create your account and explore thousands of certified tutors or manage your educational facilities seamlessly.</p>
        </div>
      </div>

      {/* Right Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center p-8 sm:p-16 relative bg-white h-full overflow-y-auto">
        <div className="w-full max-w-md mx-auto">
          <div className="mb-6">
            <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight">Sign up</h2>
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
            
            {/* 1. Role Selection Blocks */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">I am a...</label>
              <div className="grid grid-cols-3 gap-2">
                {roleOptions.map(({ value, label, icon, desc }) => (
                  <label key={value} className="cursor-pointer">
                    {/* 💡 FIXED: registerField ලෙස නිවැරදි කර ඇත */}
                    <input 
                      type="radio" 
                      value={value} 
                      {...registerField('role')} 
                      className="sr-only" 
                    />
                    <div className={`p-3 rounded-xl border-2 transition-all text-center h-full flex flex-col justify-center items-center ${
                      selectedRole === value
                        ? 'border-[#1c0da1] bg-[#1c0da1]/5'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}>
                      <div className="text-2xl mb-1">{icon}</div>
                      <p className="text-xs font-bold text-slate-800">{label}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* 2. Full Name Input */}
            <div className="relative flex items-center">
              <span className="absolute left-4">👤</span>
              <input 
                type="text" 
                required
                {...registerField('name')}
                placeholder="Full Name" 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl outline-none border border-slate-100 focus:border-[#1c0da1] text-sm font-medium" 
              />
            </div>

            {/* 3. Email Input */}
            <div className="relative flex items-center">
              <span className="absolute left-4">✉️</span>
              <input 
                type="email" 
                required
                {...registerField('email')}
                placeholder="Email Address" 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl outline-none border border-slate-100 focus:border-[#1c0da1] text-sm font-medium" 
              />
            </div>

            {/* 4. Password Input */}
            <div className="relative flex items-center">
              <span className="absolute left-4">🔒</span>
              <input 
                type="password" 
                required
                {...registerField('password')}
                placeholder="Password" 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl outline-none border border-slate-100 focus:border-[#1c0da1] text-sm font-medium" 
              />
            </div>

            {/* Password Strength Meter */}
            {passwordValue && (
              <div className="px-1 space-y-1">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-400">Password Strength:</span>
                  <span className={strength.textColor}>{strength.label}</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-300 ${strength.color}`} />
                </div>
              </div>
            )}

            {/* 5. Confirm Password Input */}
            <div className="relative flex items-center">
              <span className="absolute left-4">🛡️</span>
              <input 
                type="password" 
                required
                {...registerField('confirmPassword')}
                placeholder="Confirm Password" 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl outline-none border border-slate-100 focus:border-[#1c0da1] text-sm font-medium" 
              />
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