import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useSelector } from 'react-redux';
import LocationPicker from '../../components/common/LocationPicker';

const Branches = () => {
  const user = useSelector(state => state.auth.user);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('Branch');
  const [coords, setCoords] = useState([79.86, 6.9]);
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');

  const fetchProfile = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await api.get(`/institutes/${user._id}`);
      setProfile(res.data.profile);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchProfile(); }, [user]);

  const handleAdd = async () => {
    try {
      const payload = { name, district, city, address, coordinates: coords };
      await api.post('/institutes/locations', payload);
      alert('Location added');
      fetchProfile();
    } catch (err) {
      console.error(err); alert('Failed to add');
    }
  };

  const handleRemove = async (index) => {
    if (!confirm('Remove this location?')) return;
    try {
      await api.delete(`/institutes/locations/${index}`);
      fetchProfile();
    } catch (err) { console.error(err); alert('Failed to remove'); }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-black mb-3">Branch Locations</h2>
        <div className="bg-white p-4 rounded-xl border shadow-sm mb-6">
          <h3 className="font-bold mb-2">Add New Branch</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input value={name} onChange={(e)=>setName(e.target.value)} className="p-2 border rounded-xl" placeholder="Branch name" />
            <input value={city} onChange={(e)=>setCity(e.target.value)} className="p-2 border rounded-xl" placeholder="City" />
            <input value={district} onChange={(e)=>setDistrict(e.target.value)} className="p-2 border rounded-xl" placeholder="District" />
            <input value={address} onChange={(e)=>setAddress(e.target.value)} className="p-2 border rounded-xl" placeholder="Address" />
          </div>
          <div className="mt-3">
            <label className="text-xs font-semibold">Pick on Map</label>
            <LocationPicker initial={[6.9,79.86]} onChange={(lnglat)=>setCoords(lnglat)} />
          </div>
          <div className="mt-3 flex justify-end">
            <button onClick={handleAdd} className="px-4 py-2 bg-[#1e40af] text-white rounded-xl font-bold">Add Branch</button>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border shadow-sm">
          <h3 className="font-bold mb-3">Existing Branches</h3>
          {loading && <p>Loading...</p>}
          {!loading && (!profile || (profile.locations?.length === 0)) && <p className="text-sm text-slate-500">No branches yet.</p>}
          <div className="space-y-3">
            {profile?.locations?.map((loc, i) => (
              <div key={i} className="p-3 border rounded-xl flex justify-between items-center">
                <div>
                  <p className="font-bold">{loc.name || `Branch ${i+1}`}</p>
                  <p className="text-xs text-slate-500">{loc.city} · {loc.district}</p>
                  <p className="text-xs text-slate-400">Coords: {loc.coordinates?.coordinates?.[1]}, {loc.coordinates?.coordinates?.[0]}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={()=>handleRemove(i)} className="px-3 py-1 rounded-xl border bg-rose-50 text-rose-700">Remove</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Branches;