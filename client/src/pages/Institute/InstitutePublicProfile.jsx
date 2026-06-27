import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {
  Building2, BookOpen, MapPin, Phone, Mail, Globe, Star, Users,
  GraduationCap, ChevronLeft, Share2, Clock, School, Award
} from 'lucide-react';
import api from '../../services/api';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
});

const InstitutePublicProfile = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [institute, setInstitute] = useState(null);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, classesRes] = await Promise.all([
          api.get(`/institutes/${slug}`),
          api.get(`/institutes/${slug}/classes`),
        ]);
        setInstitute(profileRes.data.profile);
        setClasses(classesRes.data.classes || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#1c0da1] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !institute) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h2 className="text-xl font-black text-slate-700">Institute not found</h2>
          <p className="text-sm text-slate-400 mt-1">The institute you are looking for does not exist.</p>
          <button onClick={() => navigate('/explore')} className="mt-4 px-4 py-2 bg-[#1c0da1] text-white rounded-xl text-sm font-bold">Browse Classes</button>
        </div>
      </div>
    );
  }

  const { name, bio, logo, contact, locations, rating, totalReviews, isVerified } = institute;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-slate-100 px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-[#1c0da1]">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          <button className="p-2 rounded-xl hover:bg-slate-100 text-slate-400"><Share2 className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#0a044a] via-[#1c0da1] to-[#2a1ab5] px-6 py-12 text-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden border-4 border-white/20 shadow-xl flex-shrink-0">
            {logo ? (
              <img src={logo} alt={name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-white/10 flex items-center justify-center">
                <Building2 className="w-12 h-12 text-white/50" />
              </div>
            )}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-black">{name}</h1>
            <div className="flex items-center justify-center md:justify-start gap-3 mt-2 flex-wrap">
              {rating > 0 && (
                <span className="flex items-center gap-1 text-sm"><Star className="w-4 h-4 fill-[#d9cb00] text-[#d9cb00]" /> {rating} ({totalReviews || 0} reviews)</span>
              )}
              {isVerified && (
                <span className="flex items-center gap-1 text-xs bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full"><Award className="w-3 h-3" /> Verified</span>
              )}
              <span className="text-xs text-white/60">{classes.length} classes · {locations?.length || 0} branches</span>
            </div>
            {bio && <p className="text-slate-300 text-sm mt-3 max-w-2xl">{bio}</p>}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-6 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Classes Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#1c0da1]" /> Available Classes ({classes.length})
              </h2>
              {classes.length === 0 ? (
                <div className="text-center py-10">
                  <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">No classes available yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {classes.map(cls => (
                    <Link key={cls._id} to={`/class/${cls._id}`}
                      className="block p-4 rounded-xl bg-slate-50 hover:bg-[#1c0da1]/5 border border-slate-100 transition-all group">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-slate-800 group-hover:text-[#1c0da1] transition-colors">{cls.title}</h3>
                          <p className="text-xs text-slate-500 mt-0.5">{cls.subject} · {cls.grade} · {cls.language}</p>
                          <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-400">
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {cls.location?.city || 'Online'}</span>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {cls.teachingMethod}</span>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-sm font-black text-[#1c0da1]">Rs {cls.fee?.toLocaleString()}<span className="text-[10px] text-slate-400 font-normal">/mo</span></p>
                          <p className="text-[10px] text-slate-400 mt-1">{cls.enrollCount || 0} enrolled</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Branch Locations Map */}
            {locations && locations.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h2 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-600" /> Branch Locations ({locations.length})
                </h2>
                <div className="h-72 rounded-xl overflow-hidden border border-slate-100 mb-4">
                  <MapContainer center={[locations[0]?.coordinates?.coordinates?.[1] || 6.9, locations[0]?.coordinates?.coordinates?.[0] || 79.86]} zoom={10} style={{ height: '100%', width: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />
                    {locations.map((loc, i) => {
                      const lat = loc.coordinates?.coordinates?.[1];
                      const lng = loc.coordinates?.coordinates?.[0];
                      if (!lat || !lng) return null;
                      return (
                        <Marker key={i} position={[lat, lng]}>
                          <Popup>
                            <div className="text-sm font-medium">{loc.name || `Branch ${i + 1}`}</div>
                            <div className="text-xs text-slate-500">{[loc.city, loc.district, loc.address].filter(Boolean).join(', ')}</div>
                          </Popup>
                        </Marker>
                      );
                    })}
                  </MapContainer>
                </div>
                <div className="space-y-2">
                  {locations.map((loc, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <p className="text-sm font-bold text-slate-800">{loc.name || `Branch ${i + 1}`}</p>
                      <p className="text-xs text-slate-500">{[loc.address, loc.city, loc.district].filter(Boolean).join(', ')}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 sticky top-24">
              <h3 className="text-sm font-black text-slate-800 mb-3">Contact Information</h3>
              <div className="space-y-3">
                {contact?.phone && (
                  <a href={`tel:${contact.phone}`} className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors">
                    <Phone className="w-4 h-4" />
                    <div>
                      <p className="text-xs font-bold">Phone</p>
                      <p className="text-sm font-semibold">{contact.phone}</p>
                    </div>
                  </a>
                )}
                {contact?.email && (
                  <a href={`mailto:${contact.email}`} className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">
                    <Mail className="w-4 h-4" />
                    <div>
                      <p className="text-xs font-bold">Email</p>
                      <p className="text-sm font-semibold">{contact.email}</p>
                    </div>
                  </a>
                )}
                {contact?.website && (
                  <a href={contact.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors">
                    <Globe className="w-4 h-4" />
                    <div>
                      <p className="text-xs font-bold">Website</p>
                      <p className="text-sm font-semibold truncate">{contact.website}</p>
                    </div>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstitutePublicProfile;
