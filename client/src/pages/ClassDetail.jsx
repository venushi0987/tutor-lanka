import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {
  BookOpen, MapPin, Clock, Calendar, Users, Star, Building2,
  Phone, Mail, ChevronLeft, Share2, Heart, Globe, School
} from 'lucide-react';
import api from '../services/api';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
});

const ClassDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClass = async () => {
      try {
        const res = await api.get(`/classes/${id}`);
        setClassData(res.data.class);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchClass();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#1c0da1] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !classData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h2 className="text-xl font-black text-slate-700">Class not found</h2>
          <p className="text-sm text-slate-400 mt-1">{error || 'The class you are looking for does not exist.'}</p>
          <button onClick={() => navigate('/explore')} className="mt-4 px-4 py-2 bg-[#1c0da1] text-white rounded-xl text-sm font-bold">Browse Classes</button>
        </div>
      </div>
    );
  }

  const cls = classData;
  const inst = cls.instituteId;
  const location = cls.location || {};
  const schedule = cls.schedule || {};

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100 px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-[#1c0da1] transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-400 hover:text-rose-500"><Heart className="w-4 h-4" /></button>
            <button className="p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-400"><Share2 className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {cls.bannerImage && (
              <div className="rounded-2xl overflow-hidden h-48 md:h-64">
                <img src={cls.bannerImage} alt={cls.title} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              {inst?.name && (
                <Link to={`/institute/${inst.slug || inst._id}`} className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1c0da1] hover:underline mb-3">
                  <Building2 className="w-3 h-3" /> {inst.name}
                </Link>
              )}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-black text-slate-900">{cls.title}</h1>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="px-3 py-1 rounded-full bg-[#1c0da1]/10 text-[#1c0da1] text-xs font-bold">{cls.subject}</span>
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">{cls.grade}</span>
                    <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold">{cls.language}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      cls.teachingMethod === 'Online' ? 'bg-blue-50 text-blue-700' :
                      cls.teachingMethod === 'Physical' ? 'bg-amber-50 text-amber-700' : 'bg-purple-50 text-purple-700'
                    }`}>
                      {cls.teachingMethod === 'Online' ? '🌐' : cls.teachingMethod === 'Physical' ? '🏫' : '🔄'} {cls.teachingMethod}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-[#1c0da1]">Rs {cls.fee?.toLocaleString()}</p>
                  <p className="text-xs text-slate-400 font-medium">/{cls.feeType === 'free' ? 'free' : 'per month'}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-slate-100">
                {cls.enrollCount > 0 && <div className="flex items-center gap-1.5 text-xs text-slate-500"><Users className="w-3.5 h-3.5" /> {cls.enrollCount} students enrolled</div>}
                {cls.maxStudents > 0 && <div className="flex items-center gap-1.5 text-xs text-slate-500"><Users className="w-3.5 h-3.5" /> Max {cls.maxStudents} students</div>}
                {cls.rating > 0 && <div className="flex items-center gap-1.5 text-xs text-amber-600 font-semibold"><Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {cls.rating}</div>}
                <div className="flex items-center gap-1.5 text-xs text-slate-500"><BookOpen className="w-3.5 h-3.5" /> {cls.views || 0} views</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-lg font-black text-slate-800 mb-3">About This Class</h2>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{cls.description}</p>
              {cls.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {cls.tags.map((tag, i) => <span key={i} className="px-2.5 py-1 bg-slate-50 rounded-full text-[10px] font-medium text-slate-500">{tag}</span>)}
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2"><Calendar className="w-5 h-5 text-[#1c0da1]" /> Class Schedule</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {schedule.days?.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Days</p>
                    <div className="flex flex-wrap gap-1.5">
                      {schedule.days.map(day => <span key={day} className="px-3 py-1.5 bg-[#1c0da1]/5 rounded-lg text-xs font-bold text-[#1c0da1]">{day.slice(0, 3)}</span>)}
                    </div>
                  </div>
                )}
                {schedule.startTime && (
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Start Time</p>
                    <p className="text-sm font-bold text-slate-700 flex items-center gap-1.5"><Clock className="w-4 h-4 text-slate-400" /> {schedule.startTime}</p>
                  </div>
                )}
                {schedule.endTime && (
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">End Time</p>
                    <p className="text-sm font-bold text-slate-700 flex items-center gap-1.5"><Clock className="w-4 h-4 text-slate-400" /> {schedule.endTime}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2"><MapPin className="w-5 h-5 text-emerald-600" /> Class Location</h2>
              <div className="space-y-2 mb-4">
                {[location.district, location.city, location.address].filter(Boolean).map((line, i) => (
                  <p key={i} className="text-sm text-slate-600">{line}</p>
                ))}
              </div>
              <div className="h-64 rounded-xl overflow-hidden border border-slate-100">
                <MapContainer center={[6.9, 79.86]} zoom={13} style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />
                  <Marker position={[6.9, 79.86]}>
                    <Popup><div className="text-sm font-medium">{cls.title}</div><div className="text-xs text-slate-500">{location.address || location.city}</div></Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {inst && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-sm font-black text-slate-800 mb-3 flex items-center gap-2"><Building2 className="w-4 h-4 text-[#1c0da1]" /> Institute</h3>
                <div className="flex items-center gap-3 mb-3">
                  {inst.logo ? (
                    <img src={inst.logo} alt={inst.name} className="w-12 h-12 rounded-xl object-cover" />
                  ) : (
                    <div className="w-12 h-12 bg-[#1c0da1]/10 rounded-xl flex items-center justify-center"><School className="w-6 h-6 text-[#1c0da1]" /></div>
                  )}
                  <div>
                    <p className="font-bold text-slate-800">{inst.name}</p>
                    {inst.rating > 0 && <p className="text-xs text-amber-600 font-semibold flex items-center gap-1"><Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {inst.rating}</p>}
                  </div>
                </div>
                {inst.contact && (
                  <div className="space-y-1.5">
                    {inst.contact.phone && <p className="text-xs text-slate-500 flex items-center gap-1.5"><Phone className="w-3 h-3" /> {inst.contact.phone}</p>}
                    {inst.contact.email && <p className="text-xs text-slate-500 flex items-center gap-1.5"><Mail className="w-3 h-3" /> {inst.contact.email}</p>}
                    {inst.contact.website && <p className="text-xs text-slate-500 flex items-center gap-1.5"><Globe className="w-3 h-3" /> {inst.contact.website}</p>}
                  </div>
                )}
                {inst.slug && <Link to={`/institute/${inst.slug}`} className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#1c0da1] hover:underline">View Institute Profile →</Link>}
              </div>
            )}

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 sticky top-24">
              <h3 className="text-lg font-black text-slate-800 mb-1">Enroll Now</h3>
              <p className="text-3xl font-black text-[#1c0da1] mb-4">Rs {cls.fee?.toLocaleString()}<span className="text-sm text-slate-400 font-medium">/{cls.feeType === 'free' ? 'free' : 'mo'}</span></p>
              <button className="w-full py-3.5 bg-[#1c0da1] text-white font-bold rounded-xl hover:bg-[#0a044a] transition-all shadow-lg shadow-[#1c0da1]/20 mb-2">Join This Class</button>
              <button className="w-full py-3 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all text-sm flex items-center justify-center gap-2"><Heart className="w-4 h-4" /> Save to Bookmarks</button>
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-400">
                <p>✓ Secure enrollment process</p>
                <p>✓ Directly connect with institute</p>
                <p>✓ Free to browse and compare</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassDetail;
