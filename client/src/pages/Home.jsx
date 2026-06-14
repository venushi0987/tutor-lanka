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
      
      {/* ------------------ 🔮 1. HERO SECTION ------------------ */}
      <section ref={homeRef} className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-slate-950">
        
        {/* 3D Vertical Slices Container */}
        <div className="absolute inset-0 flex h-full w-full pointer-events-none" style={{ perspective: '1500px' }}>
          {stripes.map((_, index) => {
            const leftOffset = index * sliceWidth;
            
            return (
              <div 
                key={index}
                className="relative h-full transition-transform duration-1000 ease-in-out"
                style={{
                  width: `${sliceWidth}%`,
                  transformStyle: 'preserve-3d',
                  transform: currentBg === 1 ? 'rotateY(0deg)' : 'rotateY(180deg)',
                  transitionDelay: `${index * 70}ms`, 
                  zIndex: 5
                }}
              >
                {/* Front Side Layer - Image 1 */}
                <div 
                  className="absolute inset-0 h-full overflow-hidden"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <div 
                    className="absolute h-full"
                    style={{
                      width: '100vw',
                      left: `-${leftOffset}vw`, 
                      backgroundImage: `url('/bg1.png')`,
                      backgroundPosition: 'center center',
                      backgroundSize: 'cover',
                    }}
                  />
                </div>

                {/* Back Side Layer - Image 2 */}
                <div 
                  className="absolute inset-0 h-full overflow-hidden"
                  style={{
                    transform: 'rotateY(180deg)',
                    backfaceVisibility: 'hidden',
                  }}
                >
                  <div 
                    className="absolute h-full"
                    style={{
                      width: '100vw',
                      left: `-${leftOffset}vw`,
                      backgroundImage: `url('/bg2.png')`,
                      backgroundPosition: 'center center',
                      backgroundSize: 'cover',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-slate-950/45 z-10" />

        {/* Foreground Content */}
        <div className="relative z-20 text-center text-white px-4">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight drop-shadow-lg text-[#d9cb00]">
            Find your Tutor
          </h1>
          <p className="text-lg md:text-2xl font-medium mt-4 text-slate-100 drop-shadow-md max-w-2xl mx-auto">
            Discover the best teachers and private classes in Sri Lanka instantly
          </p>
          <button 
            onClick={() => navigate('/explore')} 
            className="mt-8 px-8 py-3.5 bg-[#1c0da1] hover:bg-[#d9cb00] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#1c0da1]/30 transform hover:-translate-y-0.5"
          >
            🔍 Start Searching Now
          </button>
        </div>
      </section>

      {/* ------------------ 🔍 2. EXPLORE SECTION ------------------ */}
      <section id="explore-section" ref={exploreRef} className="py-24 px-6 max-w-7xl mx-auto border-b border-slate-200">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-[#1c0da1]">Explore Tutors</h2>
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
            <h2 className="text-4xl font-extrabold text-[#1c0da1]">About Tutor-Lanka</h2>
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
          <h2 className="text-4xl font-extrabold text-[#1c0da1]">What Students Say</h2>
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