import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login Submitting:', formData);
    navigate('/dashboard/student'); 
  };

  const handleGoogleSignIn = () => {
    console.log('Google Sign In Clicked');
  };

  return (
    <div className="h-[calc(100vh-64px)] w-full flex bg-white overflow-hidden">
      
      {/* LEFT SIDE: Full Screen Blue Gradient Banner with Abstract Circles */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#1c0da1] to-[#0a044a] relative p-16 items-center overflow-hidden h-full">
        
        {/* Abstract Circles Layout matching image_48151e.jpg exactly */}
        <div className="absolute -top-20 -right-20 w-[450px] h-[450px] bg-gradient-to-b from-white/5 to-transparent rounded-full pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-gradient-to-tr from-white/10 to-transparent rounded-full pointer-events-none" />
        <div className="absolute bottom-20 right-20 w-[350px] h-[350px] bg-[#1c0da1] rounded-full filter blur-xl opacity-40 pointer-events-none shadow-2xl" />
        
        {/* Welcome Text Content */}
        <div className="relative z-10 text-white space-y-4 max-w-lg">
          <h2 className="text-5xl font-black tracking-wider uppercase drop-shadow-lg">
            Welcome
          </h2>
          <h3 className="text-2xl font-bold tracking-widest text-[#d9cb00] uppercase drop-shadow-md">
            Your Headline Name
          </h3>
          <p className="text-sm text-slate-200/70 leading-relaxed pt-2">
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: Full Screen Interactive Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center p-8 sm:p-16 md:p-24 relative bg-white h-full overflow-y-auto">
        
        {/* Bottom Right Small Circle */}
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-[#1c0da1]/10 to-transparent rounded-tl-full pointer-events-none" />

        <div className="w-full max-w-md mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight">Sign in</h2>
            <p className="text-sm text-slate-400 mt-1">Lorem ipsum dolor sit amet, consectetuer adipiscing elit</p>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username/Email Input with Icon */}
            <div className="relative flex items-center">
              <span className="absolute left-4 text-base">
                👤
              </span>
              <input 
                type="email" 
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="User Name"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl outline-none border border-slate-100 focus:border-[#1c0da1] focus:bg-white focus:ring-4 focus:ring-[#1c0da1]/5 transition-all text-sm font-medium text-slate-700 shadow-inner"
              />
            </div>

            {/* Password Input with Show Button */}
            <div className="relative flex items-center">
              <span className="absolute left-4 text-base">
                🔒
              </span>
              <input 
                type={showPassword ? "text" : "password"} 
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full pl-12 pr-16 py-4 bg-slate-50 rounded-2xl outline-none border border-slate-100 focus:border-[#1c0da1] focus:bg-white focus:ring-4 focus:ring-[#1c0da1]/5 transition-all text-sm font-medium text-slate-700 shadow-inner"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-xs font-black text-[#1c0da1] hover:text-[#d9cb00] transition-colors"
              >
                {showPassword ? "HIDE" : "SHOW"}
              </button>
            </div>

            {/* Remember me & Forgot Password Row */}
            <div className="flex justify-between items-center text-xs font-bold px-1 text-slate-500">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" className="accent-[#1c0da1] rounded w-4 h-4 cursor-pointer" />
                Remember me
              </label>
              <a href="#forgot" className="text-[#1c0da1] hover:underline">Forgot Password?</a>
            </div>

            {/* Submit Sign In Button */}
            <button 
              type="submit"
              className="w-full py-4 bg-[#1c0da1] text-white font-bold rounded-2xl hover:bg-[#0a044a] transition-all text-sm shadow-xl shadow-[#1c0da1]/20 mt-2 tracking-wide"
            >
              Sign in
            </button>
          </form>

          {/* Separator Line */}
          <div className="flex items-center my-6 text-slate-300 text-[11px] font-black uppercase tracking-widest">
            <div className="flex-grow h-[1px] bg-slate-200"></div>
            <span className="px-4 text-slate-400">Or</span>
            <div className="flex-grow h-[1px] bg-slate-200"></div>
          </div>

          {/* BRAND NEW: Google Sign In Button */}
          <button 
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full py-3.5 bg-white text-slate-700 font-bold rounded-2xl border-2 border-slate-200 hover:bg-slate-50 hover:border-slate-400 transition-all text-sm tracking-wide flex items-center justify-center gap-3 shadow-sm"
          >
            {/* SVG Flat Google Icon */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M5.266 9.765A7.077 7.077 0 0112 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.33 0 3.313 2.673 1.34 6.577l3.926 3.188z"
              />
              <path
                fill="#4285F4"
                d="M23.49 12.275c0-.818-.073-1.609-.21-2.373H12v4.51h6.44c-.277 1.491-1.12 2.755-2.383 3.6l3.727 2.89c2.182-2.01 3.44-4.964 3.44-8.627z"
              />
              <path
                fill="#FBBC05"
                d="M5.266 14.235L1.34 17.423C3.313 21.327 7.33 24 12 24c3.127 0 5.755-1.036 7.673-2.81l-3.727-2.89c-1.036.691-2.354 1.109-3.946 1.109-3.136 0-5.79-2.118-6.734-4.964z"
              />
              <path
                fill="#34A853"
                d="M12 19.39c-1.59 0-2.91-.418-3.946-1.11l-3.727 2.89C6.245 22.964 8.873 24 12 24c4.67 0 8.687-2.673 10.66-6.577l-3.926-3.188c-.945 2.845-3.599 4.964-6.734 4.964z"
              />
            </svg>
            Sign in with Google
          </button>

          {/* Bottom Footer Link */}
          <p className="text-center text-xs text-slate-400 mt-8 font-semibold">
            Don't have an account?{' '}
            <Link to="/register" className="font-black text-[#1c0da1] hover:underline ml-1">
              Sign Up
            </Link>
          </p>

        </div>
      </div>

    </div>
  );
};

export default Login;