import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-slate-950 text-slate-100 scroll-smooth min-h-screen font-sans">
      
      {/* ------------------ 🔮 1. HERO SECTION ------------------ */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        
        {/* Clean Static Background Image (No slicing/flipping effects) */}
        <div 
          className="absolute inset-0 h-full w-full bg-center bg-cover bg-no-repeat pointer-events-none"
          style={{
            backgroundImage: `url('/bg1.png')`, // Oya gawa thiyena main image eke path eka methනට දෙන්න
          }}
        />

        {/* 🎨 Premium Dark Theme Overlay Layer */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/85 via-slate-950/90 to-slate-950 z-10" />

        {/* Foreground Content */}
        <div className="relative z-20 text-center text-white px-4 max-w-4xl mx-auto">
          
          {/* Neon/Vibrant Text Gradient */}
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
            Find your Tutor
          </h1>
          
          <p className="text-lg md:text-xl font-normal mt-6 text-slate-300/90 max-w-2xl mx-auto leading-relaxed tracking-wide">
            Discover verified tutors and tailored classes across Sri Lanka — fast, trusted, and local.
          </p>
          
          {/* CTA Buttons Layout */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => navigate('/explore')} 
              className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>🔍</span> Start Searching
            </button>
            
            <button 
              onClick={() => navigate('/register?role=tutor')}
              className="w-full sm:w-auto px-8 py-3.5 bg-slate-900/60 hover:bg-slate-800/80 text-slate-200 font-semibold rounded-xl transition-all border border-slate-700/80 backdrop-blur-sm transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Become a Tutor
            </button>
          </div>

        </div>
      </section>

      {/* ------------------ 🔍 2. EXPLORE SECTION ------------------ */}
      <section id="explore-section" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-blue-400">Explore Tutors</h2>
          <p className="text-slate-400 mt-2">All subjects covered from Grade 1 up to Advanced Level</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-slate-900/40 p-8 rounded-2xl border border-slate-800/80 shadow-xl text-center hover:border-slate-700 transition-all group backdrop-blur-sm">
            <div className="w-14 h-14 bg-indigo-600/10 text-indigo-400 rounded-full flex items-center justify-center text-3xl mx-auto group-hover:scale-110 transition-transform">
              📐
            </div>
            <h3 className="text-xl font-bold mt-5 text-slate-100">Mathematics</h3>
            <p className="text-sm text-slate-400 mt-3 leading-relaxed">Combined Maths, OL Mathematics & Primary School Core Arithmetic</p>
          </div>
          
          {/* Card 2 */}
          <div className="bg-slate-900/40 p-8 rounded-2xl border border-slate-800/80 shadow-xl text-center hover:border-slate-700 transition-all group backdrop-blur-sm">
            <div className="w-14 h-14 bg-purple-600/10 text-purple-400 rounded-full flex items-center justify-center text-3xl mx-auto group-hover:scale-110 transition-transform">
              🧪
            </div>
            <h3 className="text-xl font-bold mt-5 text-slate-100">Science</h3>
            <p className="text-sm text-slate-400 mt-3 leading-relaxed">Advanced Physics, Chemistry, Biology & General Local Sciences</p>
          </div>

          {/* Card 3 */}
          <div className="bg-slate-900/40 p-8 rounded-2xl border border-slate-800/80 shadow-xl text-center hover:border-slate-700 transition-all group backdrop-blur-sm">
            <div className="w-14 h-14 bg-pink-600/10 text-pink-400 rounded-full flex items-center justify-center text-3xl mx-auto group-hover:scale-110 transition-transform">
              🗣️
            </div>
            <h3 className="text-xl font-bold mt-5 text-slate-100">English</h3>
            <p className="text-sm text-slate-400 mt-3 leading-relaxed">Spoken English, General English Language & Literature Syllabus</p>
          </div>
        </div>
      </section>

      {/* ------------------ 👨‍🏫 3. ABOUT US SECTION ------------------ */}
      <section id="about-section" className="py-24 px-6 max-w-7xl mx-auto bg-gradient-to-r from-slate-900 to-indigo-950/40 rounded-3xl my-12 border border-slate-800/60 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="px-4">
            <h2 className="text-4xl font-bold text-slate-100">About EduConnect</h2>
            <p className="text-slate-400 mt-4 leading-relaxed">
              EduConnect is Sri Lanka's premium educational network matching enthusiastic students with verified expert educators. We make finding individual home-visit tutors, physical halls, or online revision classes incredibly simple, transparent, and tailored to your exact learning requirements.
            </p>
          </div>
          <div className="h-64 bg-slate-950/60 rounded-2xl flex items-center justify-center text-slate-500 font-medium border border-slate-800/80 shadow-inner">
            [Platform Feature Video / Showcase Image Placeholder]
          </div>
        </div>
      </section>

      {/* ------------------ ⭐ 4. REVIEWS SECTION ------------------ */}
      <section id="reviews-section" className="py-24 px-6 max-w-7xl mx-auto pb-32">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">What Students Say</h2>
          <p className="text-slate-400 mt-2">Building trust with thousands of learners and parents islandwide</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-900/30 p-8 rounded-2xl border border-slate-800/80 shadow-lg backdrop-blur-sm">
            <p className="text-slate-300 italic leading-relaxed">"I managed to secure an exceptional Advanced Level Physics tutor within just 2 days of signing up. The search interface is incredibly easy to navigate!"</p>
            <h4 className="font-semibold text-indigo-400 mt-4">- Nimal Perera (A/L Student)</h4>
          </div>
          <div className="bg-slate-900/30 p-8 rounded-2xl border border-slate-800/80 shadow-lg backdrop-blur-sm">
            <p className="text-slate-300 italic leading-relaxed">"An outstanding professional platform for educators to build their personal brand and seamlessly reach out to students looking for focused help."</p>
            <h4 className="font-semibold text-indigo-400 mt-4">- Mrs. Jayasinghe (Mathematics Educator)</h4>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;