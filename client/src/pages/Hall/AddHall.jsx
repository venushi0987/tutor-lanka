import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Geocode via OpenStreetMap Nominatim (free, no API key)
const geocodeAddress = async (address) => {
  if (!address?.trim()) return null;
  try {
    const res = await axios.get(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address + ', Sri Lanka')}&format=json&limit=1`,
      { headers: { 'Accept-Language': 'en' } }
    );
    if (res.data?.length > 0) {
      const { lat, lon } = res.data[0];
      return { lat: parseFloat(lat), lon: parseFloat(lon) };
    }
  } catch (_) {}
  return null;
};

const AddHall = () => {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [geoStatus, setGeoStatus] = useState('');
  const [amenityInput, setAmenityInput] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [hallData, setHallData] = useState({
    name: '',
    address: '',
    capacity: '',
    hourlyRate: '',
    amenities: [],
    coords: null, // { lat, lon }
  });

  const addAmenity = () => {
    if (amenityInput.trim() && !hallData.amenities.includes(amenityInput.trim())) {
      setHallData(prev => ({ ...prev, amenities: [...prev.amenities, amenityInput.trim()] }));
      setAmenityInput('');
    }
  };
  const removeAmenity = (a) => setHallData(prev => ({ ...prev, amenities: prev.amenities.filter(x => x !== a) }));
  const set = (key, val) => setHallData(prev => ({ ...prev, [key]: val }));

  const handleGeocode = async () => {
    if (!hallData.address.trim()) { toast.error('Enter an address first.'); return; }
    setGeocoding(true);
    setGeoStatus('🔍 Searching...');
    const result = await geocodeAddress(hallData.address);
    setGeocoding(false);
    if (result) {
      set('coords', result);
      setGeoStatus(`✅ Found: ${hallData.address} (${result.lat.toFixed(4)}, ${result.lon.toFixed(4)})`);
      toast.success('Location pinned on map!');
    } else {
      setGeoStatus('❌ Location not found. Try a more specific address.');
      toast.error('Could not find that location. Try "45 High Level Road, Nugegoda".');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) { toast.error('You must be logged in.'); return; }
    
    // Validate required fields
    if (!hallData.name.trim()) { toast.error('Hall name is required'); return; }
    if (!hallData.address.trim()) { toast.error('Address is required'); return; }
    if (!hallData.capacity || parseInt(hallData.capacity) <= 0) { toast.error('Valid capacity is required'); return; }
    if (!hallData.hourlyRate || parseFloat(hallData.hourlyRate) < 0) { toast.error('Valid hourly rate is required'); return; }

    setLoading(true);
    try {
      let coords = hallData.coords;
      if (!coords && hallData.address.trim()) {
        const result = await geocodeAddress(hallData.address);
        if (result) {
          coords = result;
        }
      }

      const formData = new FormData();
      formData.append('name', hallData.name.trim());
      formData.append('address', hallData.address.trim());
      formData.append('capacity', parseInt(hallData.capacity));
      formData.append('hourlyRate', parseFloat(hallData.hourlyRate));
      formData.append('amenities', JSON.stringify(hallData.amenities));

      if (coords) {
        formData.append('location', JSON.stringify({
          type: 'Point',
          coordinates: [parseFloat(coords.lon), parseFloat(coords.lat)], // [lng, lat]
        }));
      } else {
        // Sensible default (Colombo coordinates: [lng, lat])
        formData.append('location', JSON.stringify({
          type: 'Point',
          coordinates: [79.8612, 6.9271],
        }));
      }

      if (imageFile) {
        formData.append('image', imageFile);
      }

      const res = await axios.post(`${API}/halls`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Hall created successfully:', res.data);
      toast.success('🏫 Hall listed successfully!', { duration: 4000 });
      navigate('/dashboard/hall');
    } catch (err) {
      console.error('Hall error - Full error object:', err);
      console.error('Hall error - Response:', err.response);
      console.error('Hall error - Response data:', err.response?.data);
      const msg = err.response?.data?.message || err.message || 'Failed to list hall';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1c0da1] focus:ring-2 focus:ring-[#1c0da1]/10 text-sm transition-all";
  const labelCls = "text-xs font-bold text-slate-600 block mb-1.5 uppercase tracking-wider";

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="bg-gradient-to-r from-[#1c0da1] to-[#0a044a] rounded-[28px] p-8 mb-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-white/5 rounded-full" />
          <button onClick={() => navigate('/dashboard/hall')} className="text-xs text-slate-300 hover:text-white mb-4 block transition-colors">
            ← Back to Hall Dashboard
          </button>
          <h1 className="text-3xl font-black text-[#d9cb00]">List a New Hall</h1>
          <p className="text-slate-200 text-sm mt-1">Add your venue so tutors can find and book it for their classes.</p>
        </div>

        <div className="bg-white rounded-[28px] shadow-xl border border-slate-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Hall Name */}
            <div>
              <label className={labelCls}>Hall / Institute Name *</label>
              <input
                type="text" required
                value={hallData.name}
                onChange={e => set('name', e.target.value)}
                placeholder="e.g. Nugegoda Royal Auditorium"
                className={inputCls}
              />
            </div>

            {/* Address + Geocode */}
            <div>
              <label className={labelCls}>Full Address *</label>
              <div className="flex gap-2">
                <input
                  type="text" required
                  value={hallData.address}
                  onChange={e => { set('address', e.target.value); setGeoStatus(''); set('coords', null); }}
                  placeholder="e.g. 45/A, High Level Road, Nugegoda"
                  className={inputCls + ' flex-1'}
                />
                <button
                  type="button"
                  onClick={handleGeocode}
                  disabled={geocoding || !hallData.address.trim()}
                  className="px-4 py-3 bg-[#1c0da1] text-white text-sm font-bold rounded-xl hover:bg-[#0a044a] transition-all disabled:opacity-50 whitespace-nowrap flex items-center gap-2"
                >
                  {geocoding
                    ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
                    : '🗺️'}
                  {geocoding ? 'Finding...' : 'Find on Map'}
                </button>
              </div>
              {geoStatus && (
                <p className={`text-xs mt-1.5 font-semibold ${geoStatus.startsWith('✅') ? 'text-green-600' : geoStatus.startsWith('❌') ? 'text-red-500' : 'text-slate-500'}`}>
                  {geoStatus}
                </p>
              )}
              <p className="text-xs text-slate-400 mt-1">
                Type your address and click "Find on Map" to pin your location for tutors.
              </p>
            </div>

            {/* Capacity + Rate */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Seating Capacity *</label>
                <input
                  type="number" required min="1"
                  value={hallData.capacity}
                  onChange={e => set('capacity', e.target.value)}
                  placeholder="e.g. 200"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Hourly Rate (LKR) *</label>
                <input
                  type="number" required min="0"
                  value={hallData.hourlyRate}
                  onChange={e => set('hourlyRate', e.target.value)}
                  placeholder="e.g. 5000"
                  className={inputCls}
                />
              </div>
            </div>

            {/* Hall Image */}
            <div>
              <label className={labelCls}>Hall Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={e => setImageFile(e.target.files[0])}
                className={inputCls + ' bg-white file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#1c0da1]/10 file:text-[#1c0da1] hover:file:bg-[#1c0da1]/20 cursor-pointer'}
              />
              <p className="text-xs text-slate-400 mt-1">
                Upload a photo of your classroom or hall venue.
              </p>
            </div>

            {/* Amenities */}
            <div>
              <label className={labelCls}>Amenities</label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={amenityInput}
                  onChange={e => setAmenityInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
                  placeholder="e.g. Projector, A/C, Whiteboard, Parking..."
                  className={inputCls}
                />
                <button type="button" onClick={addAmenity} className="px-5 bg-[#1c0da1] text-white font-bold rounded-xl text-sm hover:bg-[#0a044a] transition-colors whitespace-nowrap">+ Add</button>
              </div>
              {hallData.amenities.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No amenities added yet. Press Enter or click Add.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {hallData.amenities.map((a) => (
                    <span key={a} className="flex items-center gap-1.5 bg-[#1c0da1]/10 text-[#1c0da1] text-xs font-bold px-3 py-1.5 rounded-full">
                      {a}
                      <button type="button" onClick={() => removeAmenity(a)} className="text-red-400 hover:text-red-600 font-black">✕</button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#d9cb00] text-[#0a044a] font-black rounded-xl hover:bg-yellow-400 transition-all text-sm shadow-md disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <><span className="w-4 h-4 border-2 border-[#0a044a] border-t-transparent rounded-full animate-spin" /> Listing Hall...</>
              ) : '🏫 List Hall Facility'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddHall;