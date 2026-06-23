import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const GRADES = ['Grade 1-5', 'Grade 6-9', 'G.C.E O/L', 'G.C.E A/L', 'University/Other'];

// Geocode a city name using OpenStreetMap Nominatim (free, no API key needed)
const geocodeCity = async (cityName) => {
  if (!cityName?.trim()) return null;
  try {
    const res = await axios.get(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName + ', Sri Lanka')}&format=json&limit=1`,
      { headers: { 'Accept-Language': 'en' } }
    );
    if (res.data?.length > 0) {
      const { lat, lon } = res.data[0];
      return [parseFloat(lon), parseFloat(lat)]; // [lng, lat]
    }
  } catch (_) {}
  return null;
};

const AddClass = () => {
  const { user, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [step, setStep] = useState(1);

  // Step 1: Teacher Profile
  const [profileData, setProfileData] = useState({
    displayName: user?.name || '',
    gender: user?.gender || '',
    phone: user?.phone || '',
    location: user?.address || '',
    bio: user?.bio || '',
    qualifications: user?.qualifications || [],
    locationCoords: user?.locationCoords || [],
  });
  const [qualInput, setQualInput] = useState('');
  const [geoStatus, setGeoStatus] = useState(
    user?.locationCoords?.length === 2 ? `📍 Saved: ${user.address}` : ''
  );

  // Step 2: Class/Course Details
  const [classData, setClassData] = useState({
    title: '',
    subject: '',
    gradeLevel: '',
    type: 'Physical',
    isPaid: false,
    price: '',
    description: '',
    schedule: '',
  });

  const setP = (k, v) => setProfileData(p => ({ ...p, [k]: v }));
  const setC = (k, v) => setClassData(p => ({ ...p, [k]: v }));

  const addQual = () => {
    if (qualInput.trim() && !profileData.qualifications.includes(qualInput.trim())) {
      setProfileData(p => ({ ...p, qualifications: [...p.qualifications, qualInput.trim()] }));
      setQualInput('');
    }
  };
  const removeQual = (q) => setProfileData(p => ({ ...p, qualifications: p.qualifications.filter(x => x !== q) }));

  // Geocode button handler
  const handleGeocode = async () => {
    if (!profileData.location.trim()) {
      toast.error('Enter a city or location first.');
      return;
    }
    setGeocoding(true);
    setGeoStatus('🔍 Searching...');
    const coords = await geocodeCity(profileData.location);
    setGeocoding(false);
    if (coords) {
      setP('locationCoords', coords);
      setGeoStatus(`✅ Found: ${profileData.location} (${coords[1].toFixed(4)}, ${coords[0].toFixed(4)})`);
      toast.success('Location found on map!');
    } else {
      setGeoStatus('❌ Location not found. Try a different spelling.');
      toast.error('Could not find that location. Try "Kurunegala" or "Kandy".');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error('You must be logged in to publish a class.');
      return;
    }
    setLoading(true);
    try {
      // 1. Update teacher profile
      await axios.put(`${API}/tutors/profile`, {
        name: profileData.displayName,
        phone: profileData.phone,
        gender: profileData.gender,
        address: profileData.location,
        locationCoords: profileData.locationCoords,
        bio: profileData.bio,
        qualifications: profileData.qualifications,
      }, { headers: { Authorization: `Bearer ${token}` } });

      // 2. Create the course
      await axios.post(`${API}/courses`, {
        title: classData.title,
        subject: classData.subject,
        gradeLevel: classData.gradeLevel,
        type: classData.type,
        isPaid: classData.isPaid,
        price: classData.isPaid ? parseFloat(classData.price) : 0,
        description: (classData.description || '').trim()
          ? `${classData.description}${classData.schedule ? `\n\n📅 Schedule: ${classData.schedule}` : ''}`
          : classData.schedule || 'No description provided.',
      }, { headers: { Authorization: `Bearer ${token}` } });

      toast.success('successfully published your classes', { duration: 4000 });
      navigate('/dashboard/tutor');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to publish. Try again.';
      toast.error(msg);
      console.error('Publish error:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1c0da1] focus:ring-2 focus:ring-[#1c0da1]/10 text-sm transition-all";
  const labelCls = "block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider";

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="bg-gradient-to-r from-[#1c0da1] to-[#0a044a] rounded-[28px] p-8 mb-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-white/5 rounded-full" />
          <button onClick={() => navigate('/dashboard/tutor')} className="text-xs text-slate-300 hover:text-white mb-4 block transition-colors">
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-black text-[#d9cb00]">Add New Class</h1>
          <p className="text-slate-200 text-sm mt-1">Complete your teacher profile and post your class details for students to discover.</p>

          {/* Step Indicator */}
          <div className="flex items-center gap-3 mt-6">
            {[{ n: 1, label: 'Teacher Details' }, { n: 2, label: 'Class Details' }].map(({ n, label }) => (
              <React.Fragment key={n}>
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black border-2 transition-all ${step >= n ? 'bg-[#d9cb00] text-[#0a044a] border-[#d9cb00]' : 'bg-transparent text-white/60 border-white/30'}`}>{n}</div>
                  <span className={`text-xs font-semibold ${step >= n ? 'text-white' : 'text-white/50'}`}>{label}</span>
                </div>
                {n < 2 && <div className={`flex-1 h-0.5 ${step > n ? 'bg-[#d9cb00]' : 'bg-white/20'}`} />}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[28px] shadow-xl border border-slate-100 p-8">

          {/* ─── STEP 1: Teacher Profile ─── */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-black text-slate-800 mb-1">Your Teacher Profile</h2>
              <p className="text-sm text-slate-500 mb-6">This information will be visible to students on your class listing.</p>

              <div className="space-y-5">
                {/* Name + Gender */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Display Name *</label>
                    <input value={profileData.displayName} onChange={e => setP('displayName', e.target.value)} type="text" required placeholder="Your full name" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Gender</label>
                    <select value={profileData.gender} onChange={e => setP('gender', e.target.value)} className={inputCls + ' cursor-pointer bg-white'}>
                      <option value="">Select gender...</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className={labelCls}>Phone / WhatsApp</label>
                  <input value={profileData.phone} onChange={e => setP('phone', e.target.value)} type="text" placeholder="e.g. 0771234567" className={inputCls} />
                </div>

                {/* Location with Geocode button */}
                <div>
                  <label className={labelCls}>Teaching Location / City</label>
                  <div className="flex gap-2">
                    <input
                      value={profileData.location}
                      onChange={e => { setP('location', e.target.value); setGeoStatus(''); setP('locationCoords', []); }}
                      type="text"
                      placeholder="e.g. Kurunegala, Kandy, Colombo..."
                      className={inputCls + ' flex-1'}
                    />
                    <button
                      type="button"
                      onClick={handleGeocode}
                      disabled={geocoding || !profileData.location.trim()}
                      className="px-4 py-3 bg-[#1c0da1] text-white text-sm font-bold rounded-xl hover:bg-[#0a044a] transition-all disabled:opacity-50 whitespace-nowrap flex items-center gap-2"
                    >
                      {geocoding ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" /> : '🗺️'}
                      {geocoding ? 'Finding...' : 'Find on Map'}
                    </button>
                  </div>
                  {geoStatus && (
                    <p className={`text-xs mt-1.5 font-semibold ${geoStatus.startsWith('✅') ? 'text-green-600' : geoStatus.startsWith('❌') ? 'text-red-500' : 'text-slate-500'}`}>
                      {geoStatus}
                    </p>
                  )}
                  <p className="text-xs text-slate-400 mt-1">Type your city and click "Find on Map" to pin your location on the map for students.</p>
                </div>

                {/* Bio */}
                <div>
                  <label className={labelCls}>About You / Bio</label>
                  <textarea rows={3} value={profileData.bio} onChange={e => setP('bio', e.target.value)} placeholder="Brief description about your teaching style and experience..." className={inputCls + ' resize-none'} />
                </div>

                {/* Qualifications tag input */}
                <div>
                  <label className={labelCls}>Qualifications &amp; Certifications</label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={qualInput}
                      onChange={e => setQualInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addQual())}
                      placeholder="e.g. BSc Engineering (Hons), University of Moratuwa"
                      className={inputCls}
                    />
                    <button type="button" onClick={addQual} className="px-5 bg-[#1c0da1] text-white font-bold rounded-xl text-sm hover:bg-[#0a044a] transition-colors whitespace-nowrap">+ Add</button>
                  </div>
                  {profileData.qualifications.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No qualifications added yet. Press Enter or click Add.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {profileData.qualifications.map((q, i) => (
                        <span key={i} className="flex items-center gap-2 bg-[#1c0da1]/10 text-[#1c0da1] text-xs font-semibold px-3 py-1.5 rounded-full">
                          🎓 {q}
                          <button type="button" onClick={() => removeQual(q)} className="text-red-400 hover:text-red-600 font-bold">✕</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!profileData.displayName}
                className="w-full mt-8 py-3.5 bg-[#1c0da1] text-white font-black rounded-xl hover:bg-[#0a044a] transition-all text-sm shadow-md disabled:opacity-50"
              >
                Next: Class Details →
              </button>
            </div>
          )}

          {/* ─── STEP 2: Class Details ─── */}
          {step === 2 && (
            <form onSubmit={handleSubmit}>
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-xl font-black text-slate-800">Class Details</h2>
                <button type="button" onClick={() => setStep(1)} className="text-xs text-[#1c0da1] font-bold hover:underline">← Edit Teacher Details</button>
              </div>
              <p className="text-sm text-slate-500 mb-6">Describe your class so students know what to expect.</p>

              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Class Title *</label>
                    <input value={classData.title} onChange={e => setC('title', e.target.value)} required placeholder="e.g. 2026 A/L Physics Theory" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Subject *</label>
                    <input value={classData.subject} onChange={e => setC('subject', e.target.value)} required placeholder="e.g. Physics, Maths..." className={inputCls} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Target Grade *</label>
                    <select value={classData.gradeLevel} onChange={e => setC('gradeLevel', e.target.value)} required className={inputCls + ' cursor-pointer bg-white'}>
                      <option value="">Select grade...</option>
                      {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Class Type *</label>
                    <select value={classData.type} onChange={e => setC('type', e.target.value)} className={inputCls + ' cursor-pointer bg-white'}>
                      <option value="Physical">🏫 Physical (In-person)</option>
                      <option value="Online">🌐 Online</option>
                      <option value="Home Visit">🏠 Home Visit</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Schedule / Class Timing</label>
                  <input value={classData.schedule} onChange={e => setC('schedule', e.target.value)} placeholder="e.g. Every Saturday 9:00 AM – 11:00 AM" className={inputCls} />
                </div>

                <div>
                  <label className={labelCls}>Class Description *</label>
                  <textarea required rows={3} value={classData.description} onChange={e => setC('description', e.target.value)} placeholder="Topics covered, what students will learn, entry requirements..." className={inputCls + ' resize-none'} />
                </div>

                {/* Pricing Toggle */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                  <label className="flex items-center gap-3 cursor-pointer mb-1" onClick={() => setC('isPaid', !classData.isPaid)}>
                    <div className={`w-11 h-6 rounded-full flex items-center transition-all ${classData.isPaid ? 'bg-[#1c0da1]' : 'bg-slate-300'}`}>
                      <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ml-0.5 ${classData.isPaid ? 'translate-x-5' : 'translate-x-0'}`} />
                    </div>
                    <span className="font-bold text-slate-700 text-sm">Paid Course</span>
                  </label>
                  {classData.isPaid && (
                    <div className="mt-4">
                      <label className={labelCls}>Monthly Fee (LKR) *</label>
                      <input type="number" min="0" required value={classData.price} onChange={e => setC('price', e.target.value)} placeholder="e.g. 3000" className={inputCls} />
                    </div>
                  )}
                  {!classData.isPaid && (
                    <p className="text-xs text-green-600 font-bold mt-3 flex items-center gap-1">✅ This course will be listed as FREE</p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button type="button" onClick={() => setStep(1)} className="flex-1 py-3.5 border border-slate-200 text-slate-600 font-bold rounded-xl text-sm hover:bg-slate-50 transition-all">← Back</button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-[2] py-3.5 bg-[#d9cb00] text-[#0a044a] font-black rounded-xl hover:bg-yellow-400 transition-all text-sm shadow-md disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <><span className="w-4 h-4 border-2 border-[#0a044a] border-t-transparent rounded-full animate-spin" /> Publishing...</>
                  ) : '🚀 Publish Class'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddClass;