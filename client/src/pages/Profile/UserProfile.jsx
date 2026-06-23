import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout, updateProfile } from '../../store/slices/authSlice';
import toast from 'react-hot-toast';

const GRADES = ['Grade 1-5', 'Grade 6-9', 'G.C.E O/L', 'G.C.E A/L', 'University/Other'];

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useSelector((state) => state.auth);

  const [showEdit, setShowEdit] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    address: user?.address || '',
    grade: user?.grade || '',
    locationCoords: user?.locationCoords || [],
  });

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50">
        <div className="text-xl text-slate-500">Loading Profile...</div>
      </div>
    );
  }

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      phone: form.phone,
      bio: form.bio,
      address: form.address,
      grade: form.grade,
      locationCoords: form.locationCoords,
    };
    const result = await dispatch(updateProfile(payload));
    if (updateProfile.fulfilled.match(result)) {
      toast.success('Profile updated!');
      setShowEdit(false);
    } else {
      toast.error(result.payload || 'Update failed');
    }
  };

  const handleLogout = async () => {
    await dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 py-12 px-4 flex justify-center items-start">
      <div className="w-full max-w-lg bg-white rounded-[32px] border border-slate-200 shadow-2xl overflow-hidden">

        {/* Header Band */}
        <div className="h-32 bg-gradient-to-r from-[#1c0da1] to-[#0a044a]" />

        <div className="px-8 pb-8 -mt-16 text-center">
          {/* Avatar */}
          <div className="mx-auto w-28 h-28 bg-slate-100 border-4 border-white rounded-full flex items-center justify-center text-5xl shadow-lg overflow-hidden">
            {user.avatar
              ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              : <span>👤</span>}
          </div>

          <h3 className="text-2xl font-black text-slate-800 mt-4">{user.name}</h3>
          <span className="inline-block mt-1 px-4 py-1 bg-[#d9cb00]/20 text-[#1c0da1] rounded-full text-xs font-bold uppercase tracking-widest border border-[#d9cb00]/30">
            {user.role}
          </span>
          <p className="text-sm text-slate-400 mt-2">{user.email}</p>

          {/* Extra info */}
          {user.phone && <p className="text-sm text-slate-500 mt-1">📞 {user.phone}</p>}
          {user.address && <p className="text-sm text-slate-500 mt-1">📍 {user.address}</p>}
          {user.bio && <p className="text-sm text-slate-600 mt-3 italic">"{user.bio}"</p>}
          {user.grade && <p className="text-xs font-bold text-[#1c0da1] mt-2 bg-blue-50 px-3 py-1 rounded-full inline-block">Grade: {user.grade}</p>}

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 my-6">
            {user.role === 'tutor' ? (
              <>
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Courses</p>
                  <p className="text-2xl font-black text-[#1c0da1] mt-1">{user.courses?.length ?? '—'}</p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Qualifications</p>
                  <p className="text-2xl font-black text-[#1c0da1] mt-1">{user.qualifications?.length || 0}</p>
                </div>
              </>
            ) : (
              <>
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Following</p>
                  <p className="text-2xl font-black text-[#1c0da1] mt-1">{user.following?.length || 0}</p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Enrolled</p>
                  <p className="text-2xl font-black text-[#1c0da1] mt-1">{user.enrolledCourses?.length || 0}</p>
                </div>
              </>
            )}
          </div>

          {/* Qualifications display for tutors */}
          {user.role === 'tutor' && user.qualifications?.length > 0 && (
            <div className="text-left mb-6">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Qualifications</p>
              <div className="flex flex-wrap gap-2">
                {user.qualifications.map((q, i) => (
                  <span key={i} className="text-xs bg-[#1c0da1]/10 text-[#1c0da1] px-3 py-1 rounded-full font-semibold">🎓 {q}</span>
                ))}
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => setShowEdit(true)}
              className="w-full py-3.5 bg-[#1c0da1] text-white font-bold rounded-xl text-sm hover:bg-[#0a044a] hover:shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              Edit Profile Details
            </button>
            <button
              onClick={handleLogout}
              className="w-full py-3.5 bg-red-50 text-red-600 font-bold rounded-xl text-sm hover:bg-red-100 transition-all"
            >
              Log Out Account
            </button>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-[32px] shadow-2xl max-w-lg w-full p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-slate-800">Edit Profile</h2>
              <button onClick={() => setShowEdit(false)} className="text-slate-400 hover:text-slate-700 text-2xl font-bold">✕</button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Full Name</label>
                <input value={form.name} onChange={e => set('name', e.target.value)} type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1c0da1] text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Phone Number</label>
                <input value={form.phone} onChange={e => set('phone', e.target.value)} type="text" placeholder="e.g. 0771234567" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1c0da1] text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">City / Location</label>
                <input value={form.address} onChange={e => set('address', e.target.value)} type="text" placeholder="e.g. Colombo" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1c0da1] text-sm" />
              </div>
              {user.role === 'tutor' && (
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">City/Location (for Map)</label>
                  <div className="flex gap-2">
                    <input
                      value={form.address}
                      onChange={e => { set('address', e.target.value); set('geoStatus', ''); set('locationCoords', []); }}
                      type="text"
                      placeholder="e.g. Kurunegala, Kandy..."
                      className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1c0da1] text-sm"
                    />
                    <button
                      type="button"
                      disabled={geocoding || !form.address?.trim()}
                      onClick={async () => {
                        if (!form.address?.trim()) return;
                        setGeocoding(true);
                        try {
                          const res = await import('axios').then(m => m.default.get(
                            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(form.address + ', Sri Lanka')}&format=json&limit=1`,
                            { headers: { 'Accept-Language': 'en' } }
                          ));
                          if (res.data?.length > 0) {
                            const { lat, lon } = res.data[0];
                            set('locationCoords', [parseFloat(lon), parseFloat(lat)]);
                            import('react-hot-toast').then(t => t.default.success('Location found!'));
                          } else {
                            import('react-hot-toast').then(t => t.default.error('Location not found. Try a different name.'));
                          }
                        } catch (_) {}
                        setGeocoding(false);
                      }}
                      className="px-4 py-3 bg-[#1c0da1] text-white text-xs font-bold rounded-xl hover:bg-[#0a044a] transition-all disabled:opacity-50 whitespace-nowrap"
                    >
                      {geocoding ? '...' : '🗺️ Find'}
                    </button>
                  </div>
                  {form.locationCoords?.length === 2 && (
                    <p className="text-xs text-green-600 font-semibold mt-1">✅ Location pinned ({form.locationCoords[1]?.toFixed(4)}, {form.locationCoords[0]?.toFixed(4)})</p>
                  )}
                </div>
              )}
              {user.role === 'student' && (
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Grade Level</label>
                  <select value={form.grade} onChange={e => set('grade', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1c0da1] text-sm cursor-pointer">
                    <option value="">Select grade...</option>
                    {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Bio / About</label>
                <textarea rows={3} value={form.bio} onChange={e => set('bio', e.target.value)} placeholder="Tell students about yourself..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1c0da1] text-sm resize-none" />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowEdit(false)} className="flex-1 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl text-sm hover:bg-slate-50 transition-all">Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 py-3 bg-[#1c0da1] text-white font-bold rounded-xl text-sm hover:bg-[#0a044a] transition-all disabled:opacity-60">
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;