import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  // State to track which background image is currently visible (1 or 2)
  const [currentBg, setCurrentBg] = useState(1);
  
  // React DOM Refs for smooth sections navigation
  const homeRef = useRef(null);
  const exploreRef = useRef(null);
  const aboutRef = useRef(null);
  const reviewsRef = useRef(null);

  // Interval timer changing backgrounds every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev === 1 ? 2 : 1));
    }, 4000); 
    return () => clearInterval(interval);
  }, []);

  // Splitting the screen into 12 perfect vertical slices for the transition effect
  const totalSlices = 12;
  const stripes = Array.from({ length: totalSlices });
  const sliceWidth = 100 / totalSlices; 

  return (
    <div className="w-full bg-slate-50 text-slate-900 scroll-smooth">
      
      {/* ------------------ 🔮 1. HERO SECTION (Refreshed) ------------------ */}
          <section id="home-section" ref={homeRef} role="banner" aria-label="Hero" className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-hero-gradient dark:bg-dark-950">

            {/* Decorative floating shapes (subtle, performant) */}
            <div className="absolute -left-16 -top-16 w-80 h-80 rounded-full bg-primary-600/20 blur-3xl animate-float pointer-events-none" />
            <div className="absolute right-8 top-24 w-48 h-48 rounded-full bg-primary-400/15 blur-2xl animate-pulse-slow pointer-events-none" />
            <div className="absolute left-1/2 bottom-8 transform -translate-x-1/2 w-96 h-40 rounded-3xl bg-gradient-to-r from-primary-500/10 via-primary-400/6 to-primary-600/8 blur-xl pointer-events-none" />

            {/* Soft overlay for contrast */}
            <div className="absolute inset-0 bg-black/40 z-10" />

            {/* Foreground Content */}
            <div className="relative z-20 text-center px-4">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white/95 drop-shadow-lg">
                <span className="gradient-text">Find your Tutor</span>
              </h1>
              <p className="text-base md:text-xl text-slate-200 mt-4 max-w-2xl mx-auto">
                Discover verified tutors and tailored classes across Sri Lanka — fast, trusted, and local.
              </p>
              <div className="mt-8 flex items-center justify-center gap-4">
                <button onClick={() => navigate('/explore')} className="btn-primary" aria-label="Start searching tutors">
                  🔍 Start Searching
                </button>
                <button onClick={() => navigate('/register')} className="btn-secondary" aria-label="Register as a tutor">
                  Become a Tutor
                </button>
              </div>
            </div>

          </section>

      {/* ------------------ 🔍 2. EXPLORE SECTION ------------------ */}
      <section id="explore-section" ref={exploreRef} className="py-24 px-6 max-w-7xl mx-auto border-b border-slate-200">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-[#1e40af]">Explore Tutors</h2>
          <p className="text-slate-500 mt-2">All subjects covered from Grade 1 up to Advanced Level</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center hover:shadow-md transition-shadow border-t-4 border-t-[#d9cb00]">
            <span className="text-4xl">📐</span>
            <h3 className="text-xl font-bold mt-4 text-slate-800">Mathematics</h3>
            <p className="text-sm text-slate-500 mt-2">Combined Maths, OL Mathematics & Primary School Core Arithmetic</p>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center hover:shadow-md transition-shadow border-t-4 border-t-[#d9cb00]">
            <span className="text-4xl">🧪</span>
            <h3 className="text-xl font-bold mt-4 text-slate-800">Science</h3>
            <p className="text-sm text-slate-500 mt-2">Advanced Physics, Chemistry, Biology & General Local Sciences</p>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center hover:shadow-md transition-shadow border-t-4 border-t-[#d9cb00]">
            <span className="text-4xl">🗣️</span>
            <h3 className="text-xl font-bold mt-4 text-slate-800">English</h3>
            <p className="text-sm text-slate-500 mt-2">Spoken English, General English Language & Literature Syllabus</p>
          </div>
        </div>
      </section>

      {/* ------------------ 👨‍🏫 3. ABOUT US SECTION ------------------ */}
      <section id="about-section" ref={aboutRef} className="py-24 px-6 max-w-7xl mx-auto border-b border-slate-200 bg-white rounded-3xl my-12 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-extrabold text-[#1e40af]">About Tutor-Lanka</h2>
            <p className="text-slate-600 mt-4 leading-relaxed">
              Tutor-Lanka is Sri Lanka's premium educational network matching enthusiastic students with verified expert educators. We make finding individual home-visit tutors or online revision classes incredibly simple, transparent, and tailored to your exact learning requirements.
            </p>
          </div>
          <div className="h-64 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 font-medium border border-dashed border-[#d9cb00]">
            [Platform Feature Video / Showcase Image Placeholder]
          </div>
        </div>
      </section>

      {/* ------------------ ⭐ 4. REVIEWS SECTION ------------------ */}
      <section id="reviews-section" ref={reviewsRef} className="py-24 px-6 max-w-7xl mx-auto pb-32">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-[#1e40af]">What Students Say</h2>
          <p className="text-slate-500 mt-2">Building trust with thousands of learners and parents islandwide</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-[#d9cb00]">
            <p className="text-slate-600 italic">"I managed to secure an exceptional Advanced Level Physics tutor within just 2 days of signing up. The search interface is incredibly easy to navigate!"</p>
            <h4 className="font-bold text-slate-900 mt-4">- Nimal Perera (A/L Student)</h4>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-[#d9cb00]">
            <p className="text-slate-600 italic">"An outstanding professional platform for educators to build their personal brand and seamlessly reach out to students looking for focused help."</p>
            <h4 className="font-bold text-slate-900 mt-4">- Mrs. Jayasinghe (Mathematics Educator)</h4>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;