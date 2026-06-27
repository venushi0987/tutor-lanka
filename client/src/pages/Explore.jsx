import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
// import { updateProfile } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const GRADES = ['Grade 1-5', 'Grade 6-9', 'G.C.E O/L', 'G.C.E A/L', 'University/Other'];

// Custom map markers
const tutorIcon = new L.DivIcon({
  className: '',
  html: '<div style="background:#1c0da1;width:22px;height:22px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>',
  iconSize: [22, 22], iconAnchor: [11, 11],
});
const hallIcon = new L.DivIcon({
  className: '',
  html: '<div style="background:#d9cb00;width:22px;height:22px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>',
  iconSize: [22, 22], iconAnchor: [11, 11],
});

const ChangeMapView = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    if (coords && coords[0] && coords[1]) {
      map.setView(coords, 14, { animate: true });
    }
  }, [coords, map]);
  return null;
};

const Explore = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);

  // Onboarding state
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [grade, setGrade] = useState('');
  const [age, setAge] = useState('');
  const [savingPrefs, setSavingPrefs] = useState(false);

  // Data state
  const [courses, setCourses] = useState([]);
  const [halls, setHalls] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search + selection state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [mapCenter, setMapCenter] = useState([6.9271, 79.8612]); // Default Colombo

  // Enrollment modal state
  const [enrollModal, setEnrollModal] = useState(null);
  const [enrolling, setEnrolling] = useState(false);

  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  // Show onboarding if student has no grade saved
  useEffect(() => {
    if (user?.role === 'student' && !user?.grade) {
      const hasShown = localStorage.getItem('educonnect_onboarding_shown');
      if (!hasShown) {
        setShowOnboarding(true);
      }
    }
  }, [user]);

  // Fetch data based on role
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (user?.role === 'tutor') {
          // Tutors see class halls
          const res = await axios.get(`${API}/halls`);
          if (res.data.success) setHalls(res.data.halls);
        } else {
          // Students & guests see published courses
          const gradeParam = user?.grade ? `?grade=${encodeURIComponent(user.grade)}` : '';
          const [coursesRes] = await Promise.all([
            axios.get(`${API}/courses${gradeParam}`),
          ]);
          if (coursesRes.data.success) {
            const allCourses = coursesRes.data.courses;
            setCourses(allCourses);
            // Extract unique tutors for the list panel
            const tutorMap = {};
            allCourses.forEach(c => {
              if (c.tutor && !tutorMap[c.tutor._id]) {
                tutorMap[c.tutor._id] = c.tutor;
              }
            });
            setTutors(Object.values(tutorMap));
          }
        }
      } catch (err) {
        console.error('Explore fetch error:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.role, user?.grade]);

  // Save grade/age preferences for student
  const handleSavePreferences = async (e) => {
    e.preventDefault();
    setSavingPrefs(true);
    const result = await dispatch(updateProfile({ grade, dateOfBirth: age ? new Date(new Date().getFullYear() - parseInt(age), 0, 1).toISOString() : undefined }));
    setSavingPrefs(false);
    if (updateProfile.fulfilled.match(result)) {
      toast.success(`Preferences saved! Showing classes for ${grade}.`);
      localStorage.setItem('educonnect_onboarding_shown', 'true');
      setShowOnboarding(false);
    } else {
      toast.error('Could not save preferences. Try again.');
    }
  };

  // Filter courses/halls by search term
  const filtered = searchTerm.trim()
    ? (user?.role === 'tutor'
      ? halls.filter(h => h.name?.toLowerCase().includes(searchTerm.toLowerCase()) || h.address?.toLowerCase().includes(searchTerm.toLowerCase()))
      : courses.filter(c => c.title?.toLowerCase().includes(searchTerm.toLowerCase()) || c.subject?.toLowerCase().includes(searchTerm.toLowerCase()) || c.tutor?.name?.toLowerCase().includes(searchTerm.toLowerCase())))
    : (user?.role === 'tutor' ? halls : courses);

  // Build map markers
  const mapMarkers = user?.role === 'tutor'
    ? halls.filter(h => h.location?.coordinates?.length === 2).map(h => ({
        id: h._id,
        position: [h.location.coordinates[1], h.location.coordinates[0]],
        icon: hallIcon,
        popup: { title: h.name, sub: `Capacity: ${h.capacity} • Rs.${h.hourlyRate?.toLocaleString()}/hr`, tags: h.amenities?.slice(0, 2) || [] },
      }))
    : tutors.filter(t => t.locationCoords?.length === 2).map(t => ({
        id: t._id,
        position: [t.locationCoords[1], t.locationCoords[0]],
        icon: tutorIcon,
        popup: { title: t.name, sub: t.qualifications?.[0] || 'Verified Tutor', tags: [] },
      }));

  // Select a course/hall and pan the map to its location
  const handleSelect = (item) => {
    setSelectedCourse(item);
    // For halls
    if (item?.location?.coordinates?.length === 2) {
      setMapCenter([item.location.coordinates[1], item.location.coordinates[0]]);
    // For courses — use tutor's location
    } else if (item?.tutor?.locationCoords?.length === 2) {
      setMapCenter([item.tutor.locationCoords[1], item.tutor.locationCoords[0]]);
    }
  };

  // Enroll handler
  const handleEnroll = async (course) => {
    if (!token) { navigate('/login'); return; }
    setEnrolling(true);
    try {
      await axios.post(`${API}/enrollments`, { courseId: course._id }, { headers });
      toast.success(`Successfully enrolled in "${course.title}"!`);
      setEnrollModal(null);
    } catch (err) {
      const msg = err.response?.data?.message || 'Enrollment failed. Try again.';
      toast.error(msg);
    } finally {
      setEnrolling(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 px-4 max-w-7xl mx-auto pb-20">

      {/* ─── Onboarding Modal ─── */}
      {showOnboarding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white p-8 rounded-[32px] shadow-2xl max-w-md w-full border border-slate-200">
            <div className="text-4xl mb-3 text-center">🎯</div>
            <h2 className="text-2xl font-black text-slate-900 mb-2 text-center">Help us help you!</h2>
            <p className="text-slate-500 text-sm mb-6 text-center">Tell us your grade and age to get personalized class recommendations.</p>
            <form onSubmit={handleSavePreferences} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Your Grade *</label>
                <select value={grade} onChange={e => setGrade(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 outline-none focus:border-[#1c0da1]">
                  <option value="">Select Grade...</option>
                  {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Your Age *</label>
                <input type="number" value={age} onChange={e => setAge(e.target.value)} required min="5" max="99" placeholder="e.g. 16" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 outline-none focus:border-[#1c0da1]" />
              </div>
              <button type="submit" disabled={savingPrefs} className="w-full py-3.5 bg-[#1c0da1] text-white font-bold rounded-xl hover:bg-[#0a044a] transition-all disabled:opacity-60">
                {savingPrefs ? 'Saving...' : 'Save & Show My Classes'}
              </button>
              <button type="button" onClick={() => { setShowOnboarding(false); localStorage.setItem('educonnect_onboarding_shown', 'true'); }} className="w-full py-2 text-slate-400 text-sm hover:text-slate-600">Skip for now</button>
            </form>
          </div>
        </div>
      )}

      {/* ─── Page Header ─── */}
      <div className="mb-8">
        <h2 className="text-3xl font-black text-slate-900">
          {user?.role === 'tutor' ? 'Find Class Halls Near You' : 'Explore EduConnect'}
        </h2>
        <p className="text-slate-500 mt-1">
          {user?.role === 'tutor'
            ? 'Browse available class halls and venues to host your sessions.'
            : user?.grade
              ? `Showing classes recommended for ${user.grade}`
              : 'Discover tutors, classes, and courses across Sri Lanka.'}
        </p>
      </div>

      {/* ─── Recommended Banner for Students ─── */}
      {user?.role === 'student' && courses.length > 0 && user?.grade && (
        <div className="mb-8 bg-gradient-to-r from-[#1c0da1] to-[#0a044a] rounded-2xl p-6 text-white shadow-xl">
          <p className="text-xs font-bold text-[#d9cb00] uppercase tracking-widest mb-1">✨ Recommended for {user.grade}</p>
          <h3 className="text-xl font-black">{courses[0]?.title}</h3>
          <p className="text-slate-300 text-sm mt-1">By {courses[0]?.tutor?.name || 'Verified Tutor'} • {courses[0]?.type}</p>
          <button
            onClick={() => setSelectedCourse(courses[0])}
            className="mt-4 px-5 py-2 bg-[#d9cb00] text-[#0a044a] text-sm font-bold rounded-xl hover:bg-yellow-400 transition-all"
          >
            View Details
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ─── Left: Search + List ─── */}
        <div className="lg:col-span-1 space-y-4">
          {/* Search */}
          <div className="relative">
            <input
              type="search"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder={user?.role === 'tutor' ? 'Search halls by name or city...' : 'Search courses, subjects, tutors...'}
              className="w-full pl-4 pr-24 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1c0da1] text-sm"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#1c0da1] text-white px-3 py-1.5 rounded-lg text-sm font-semibold">Search</button>
          </div>

          {loading ? (
            <div className="flex justify-center py-10"><div className="w-8 h-8 border-4 border-[#1c0da1] border-t-transparent rounded-full animate-spin" /></div>
          ) : (
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {filtered.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-sm">
                  {user?.role === 'tutor' ? 'No halls found.' : 'No courses found.'}
                </div>
              ) : user?.role === 'tutor' ? (
                // Tutor sees Hall cards
                filtered.map(hall => (
                  <div key={hall._id} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer" onClick={() => handleSelect(hall)}>
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-slate-900 text-sm">{hall.name}</h4>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${hall.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                        {hall.isAvailable ? 'Available' : 'Occupied'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">📍 {hall.address}</p>
                    <p className="text-xs text-slate-500">👥 {hall.capacity} students • Rs.{hall.hourlyRate?.toLocaleString()}/hr</p>
                    {hall.amenities?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {hall.amenities.slice(0, 3).map((a, i) => (
                          <span key={i} className="text-[9px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">{a}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                // Student sees Course cards
                filtered.map(course => (
                  <div
                    key={course._id}
                    onClick={() => handleSelect(course)}
                    className={`p-4 bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all cursor-pointer ${selectedCourse?._id === course._id ? 'border-[#1c0da1] ring-2 ring-[#1c0da1]/20' : 'border-slate-200'}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[10px] font-bold text-[#1c0da1] uppercase tracking-wider">{course.subject}</p>
                        <h4 className="font-bold text-slate-900 text-sm mt-0.5 leading-snug">{course.title}</h4>
                      </div>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ml-2 flex-shrink-0 ${course.type === 'Online' ? 'bg-emerald-50 text-emerald-600' : course.type === 'Home Visit' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
                        {course.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">By {course.tutor?.name || 'Unknown'}</p>
                    {course.tutor?.address && <p className="text-xs text-slate-400">📍 {course.tutor.address}</p>}
                    <p className="text-sm font-black text-[#1c0da1] mt-2">
                      {course.isPaid ? `Rs. ${course.price?.toLocaleString()}/mo` : <span className="text-green-600">FREE</span>}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* ─── Right: Map + Detail Panel ─── */}
        <div className="lg:col-span-2 space-y-4">
          {/* Map */}
          <div className="h-[360px] rounded-2xl overflow-hidden border border-slate-200 shadow-inner relative z-0">
            <MapContainer center={mapCenter} zoom={12} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
              <ChangeMapView coords={mapCenter} />
              <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {mapMarkers.map(m => (
                <Marker key={m.id} position={m.position} icon={m.icon}>
                  <Popup>
                    <div className="text-center min-w-[140px]">
                      <strong className="text-[#1c0da1]">{m.popup.title}</strong><br />
                      <span className="text-xs text-slate-500">{m.popup.sub}</span>
                      {m.popup.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1 justify-center">
                          {m.popup.tags.map((t, i) => <span key={i} className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full">{t}</span>)}
                        </div>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          {/* Detail Panel */}
          {selectedCourse ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6">
              {user?.role === 'tutor' ? (
                // Hall detail
                <>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-black text-slate-900">{selectedCourse.name}</h3>
                      <p className="text-sm text-slate-500 mt-1">📍 {selectedCourse.address}</p>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${selectedCourse.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                      {selectedCourse.isAvailable ? 'Available' : 'Occupied'}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {[
                      { label: 'Capacity', val: `${selectedCourse.capacity} students` },
                      { label: 'Hourly Rate', val: `Rs.${selectedCourse.hourlyRate?.toLocaleString()}` },
                      { label: 'Owner', val: selectedCourse.owner?.name || 'N/A' },
                    ].map(s => (
                      <div key={s.label} className="bg-slate-50 rounded-xl p-3 text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">{s.label}</p>
                        <p className="text-sm font-black text-slate-800 mt-0.5">{s.val}</p>
                      </div>
                    ))}
                  </div>
                  {selectedCourse.amenities?.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Amenities</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedCourse.amenities.map((a, i) => (
                          <span key={i} className="bg-[#1c0da1]/10 text-[#1c0da1] text-xs font-semibold px-3 py-1 rounded-full">{a}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                // Course detail for student
                <>
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-xs font-bold text-[#1c0da1] uppercase tracking-wider">{selectedCourse.subject}</p>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${selectedCourse.type === 'Online' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>{selectedCourse.type}</span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900">{selectedCourse.title}</h3>
                  <p className="text-sm text-slate-500 mt-1">{selectedCourse.gradeLevel}</p>

                  {/* Tutor info */}
                  {selectedCourse.tutor && (
                    <div className="flex items-start gap-4 my-5 p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="w-12 h-12 rounded-full bg-[#1c0da1] flex items-center justify-center text-white font-black text-lg flex-shrink-0">
                        {selectedCourse.tutor.avatar
                          ? <img src={selectedCourse.tutor.avatar} alt="" className="w-full h-full object-cover rounded-full" />
                          : selectedCourse.tutor.name?.[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-black text-slate-900">{selectedCourse.tutor.name}</p>
                          {selectedCourse.tutor.isVerified && <span className="text-green-500 text-sm">✅ Verified</span>}
                        </div>
                        {selectedCourse.tutor.address && <p className="text-xs text-slate-500 mt-0.5">📍 {selectedCourse.tutor.address}</p>}
                        {selectedCourse.tutor.phone && <p className="text-xs text-slate-500">📞 {selectedCourse.tutor.phone}</p>}
                        {selectedCourse.tutor.bio && <p className="text-xs text-slate-600 mt-1 italic">"{selectedCourse.tutor.bio}"</p>}
                        {selectedCourse.tutor.qualifications?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {selectedCourse.tutor.qualifications.map((q, i) => (
                              <span key={i} className="text-[10px] bg-[#1c0da1]/10 text-[#1c0da1] px-2 py-0.5 rounded-full font-semibold">🎓 {q}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedCourse.description && (
                    <div className="mb-4">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">About This Class</p>
                      <p className="text-sm text-slate-600 leading-relaxed">{selectedCourse.description}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Monthly Fee</p>
                      <p className="text-2xl font-black text-[#1c0da1]">
                        {selectedCourse.isPaid ? `Rs. ${selectedCourse.price?.toLocaleString()}` : <span className="text-green-600">FREE</span>}
                      </p>
                    </div>
                    <button
                      onClick={() => setEnrollModal(selectedCourse)}
                      className="bg-[#1c0da1] text-white font-bold px-8 py-3 rounded-xl hover:bg-[#0a044a] transition-all shadow-md"
                    >
                      Enroll Now
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-8 text-center text-slate-400">
              <p className="text-3xl mb-2">{user?.role === 'tutor' ? '🏫' : '📚'}</p>
              <p className="text-sm font-semibold">
                {user?.role === 'tutor' ? 'Click a hall from the list to see its details' : 'Click a class from the list to see full details'}
              </p>
            </div>
          )}
        </div>
      </div>
      {/* ── Enroll Modal ── */}
      {enrollModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-[28px] shadow-2xl max-w-md w-full border border-slate-100 p-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs font-bold text-[#1c0da1] uppercase tracking-wider mb-1">{enrollModal.subject}</p>
                <h3 className="text-xl font-black text-slate-900">{enrollModal.title}</h3>
                <p className="text-sm text-slate-500 mt-0.5">{enrollModal.gradeLevel}</p>
              </div>
              <button onClick={() => setEnrollModal(null)} className="text-slate-400 hover:text-slate-600 text-xl font-bold leading-none">✕</button>
            </div>
            {enrollModal.tutor && (
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 mb-5">
                <div className="w-10 h-10 rounded-full bg-[#1c0da1] flex items-center justify-center text-white font-black overflow-hidden flex-shrink-0">
                  {enrollModal.tutor.avatar
                    ? <img src={enrollModal.tutor.avatar} alt="" className="w-full h-full object-cover" />
                    : enrollModal.tutor.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">{enrollModal.tutor.name}</p>
                  {enrollModal.tutor.phone && <p className="text-xs text-slate-500">📞 {enrollModal.tutor.phone}</p>}
                  {enrollModal.tutor.address && <p className="text-xs text-slate-500">📍 {enrollModal.tutor.address}</p>}
                </div>
              </div>
            )}
            {enrollModal.description && (
              <p className="text-sm text-slate-600 mb-5 leading-relaxed">{enrollModal.description}</p>
            )}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Monthly Fee</p>
                <p className="text-2xl font-black text-[#1c0da1]">
                  {enrollModal.isPaid ? `Rs. ${enrollModal.price?.toLocaleString()}` : <span className="text-green-600">FREE</span>}
                </p>
              </div>
              <button
                onClick={() => handleEnroll(enrollModal)}
                disabled={enrolling}
                className="bg-[#1c0da1] text-white font-bold px-8 py-3 rounded-xl hover:bg-[#0a044a] transition-all shadow-md disabled:opacity-60 flex items-center gap-2"
              >
                {enrolling && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                {enrolling ? 'Enrolling...' : 'Confirm Enroll'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Explore;