import React, { useState } from 'react';
import LocationPicker from '../components/common/LocationPicker';
import api from '../services/api';

const InstituteProfileEdit = () => {
  const [form, setForm] = useState({ name: '', bio: '', contact: { phone: '', email: '' } });
  const [logoFile, setLogoFile] = useState(null);
  const [selectedCoords, setSelectedCoords] = useState([79.86, 6.9]); // [lng, lat]

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('name', form.name);
      data.append('bio', form.bio);
      data.append('contact', JSON.stringify(form.contact));
      if (logoFile) data.append('logo', logoFile);
      // locations: send array with one sample location using selectedCoords
      const locations = [{ name: 'Main Branch', district: '', city: '', address: '', coordinates: { type: 'Point', coordinates: selectedCoords } }];
      data.append('locations', JSON.stringify(locations));
      const res = await api.post('/institutes/profile', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      alert('Profile saved');
    } catch (err) {
      console.error(err);
      alert('Failed to save profile');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-xl font-black mb-3">Edit Institute Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold">Institute Name</label>
            <input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full mt-1 px-3 py-2 border rounded-xl" />
          </div>
          <div>
            <label className="text-xs font-bold">Short Bio</label>
            <textarea value={form.bio} onChange={(e) => setForm({...form, bio: e.target.value})} className="w-full mt-1 px-3 py-2 border rounded-xl" rows={3} />
          </div>
          <div>
            <label className="text-xs font-bold">Contact Phone</label>
            <input value={form.contact.phone} onChange={(e) => setForm({...form, contact: {...form.contact, phone: e.target.value}})} className="w-full mt-1 px-3 py-2 border rounded-xl" />
          </div>
          <div>
            <label className="text-xs font-bold">Contact Email</label>
            <input value={form.contact.email} onChange={(e) => setForm({...form, contact: {...form.contact, email: e.target.value}})} className="w-full mt-1 px-3 py-2 border rounded-xl" />
          </div>

          <div>
            <label className="text-xs font-bold">Upload Logo</label>
            <input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files[0])} className="w-full mt-1" />
          </div>

          <div>
            <label className="text-xs font-bold">Pick Location on Map</label>
            <LocationPicker initial={[6.9, 79.86]} onChange={(lnglat) => setSelectedCoords(lnglat)} />
            <p className="text-xs text-slate-500 mt-2">Selected coordinates: {selectedCoords[0].toFixed(5)}, {selectedCoords[1].toFixed(5)}</p>
          </div>

          <div className="flex justify-end">
            <button type="submit" className="px-4 py-2 bg-[#1c0da1] text-white rounded-xl font-bold">Save Profile</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InstituteProfileEdit;