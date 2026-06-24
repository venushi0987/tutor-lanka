import React, { useState } from 'react';
import LocationPicker from '../../components/common/LocationPicker';
import { useDispatch } from 'react-redux';
import { createClass } from '../../store/slices/classSlice';

const AddClass = () => {
  const dispatch = useDispatch();
  const [classData, setClassData] = useState({ title: '', subject: '', grade: '', fee: '', teachingMethod: 'Online', description: '', language: 'Sinhala' });
  const [banner, setBanner] = useState(null);
  const [coords, setCoords] = useState([79.86, 6.9]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('title', classData.title);
    fd.append('subject', classData.subject);
    fd.append('grade', classData.grade);
    fd.append('fee', classData.fee);
    fd.append('teachingMethod', classData.teachingMethod);
    fd.append('description', classData.description);
    fd.append('language', classData.language);
    if (banner) fd.append('banner', banner);
    const location = { district: '', city: '', address: '', coordinates: { type: 'Point', coordinates: coords } };
    fd.append('location', JSON.stringify(location));
    try {
      await dispatch(createClass(fd)).unwrap();
      alert('Class published successfully');
    } catch (err) {
      console.error(err); alert('Failed to publish');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 py-10 px-4 flex justify-center items-center">
      <div className="w-full max-w-3xl bg-white rounded-[32px] shadow-xl border border-slate-100 overflow-hidden flex flex-col md:flex-row min-h-[500px]">
        
        {/* Decorative Side */}
        <div className="md:w-1/3 bg-gradient-to-br from-[#1c0da1] to-[#0a044a] p-8 text-white flex flex-col justify-center relative overflow-hidden">
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full" />
          <h3 className="text-2xl font-black uppercase text-[#d9cb00]">Add New Class</h3>
          <p className="text-xs text-slate-200 mt-2 leading-relaxed">Fill in the details to publish your new class schedule to thousands of students islandwide.</p>
        </div>

        {/* Form Side */}
        <form onSubmit={handleSubmit} className="md:w-2/3 p-8 sm:p-10 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Class Title</label>
              <input type="text" required placeholder="e.g., 2026 A/L Physics" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-[#1c0da1] text-sm" onChange={(e) => setClassData({...classData, title: e.target.value})} />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Subject</label>
              <input type="text" required placeholder="e.g., Physics" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-[#1c0da1] text-sm" onChange={(e) => setClassData({...classData, subject: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Grade / Batch</label>
              <input type="text" required placeholder="e.g., Grade 13" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-[#1c0da1] text-sm" onChange={(e) => setClassData({...classData, grade: e.target.value})} />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Monthly Fee (LKR)</label>
              <input type="number" required placeholder="e.g., 3000" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-[#1c0da1] text-sm" onChange={(e) => setClassData({...classData, fee: e.target.value})} />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Class Type</label>
              <select className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-[#1c0da1] text-sm bg-white cursor-pointer" onChange={(e) => setClassData({...classData, teachingMethod: e.target.value})}>
                <option value="Online">🌐 Online</option>
                <option value="Physical">🏫 Physical</option>
                <option value="Home Visit">🏠 Home Visit</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">Description / Schedule Details</label>
            <textarea rows="4" placeholder="Mention class days, times, and coverage details..." className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-[#1c0da1] text-sm resize-none" onChange={(e) => setClassData({...classData, description: e.target.value})}></textarea>
          </div>

          <div>
            <label className="text-xs font-bold">Upload Banner</label>
            <input type="file" accept="image/*" onChange={(e) => setBanner(e.target.files[0])} />
          </div>

          <div>
            <label className="text-xs font-bold">Pick Location</label>
            <LocationPicker initial={[6.9,79.86]} onChange={(lnglat)=>setCoords(lnglat)} />
          </div>

          <button type="submit" className="w-full py-3.5 bg-[#1c0da1] text-white font-bold rounded-xl hover:bg-[#0a044a] transition-all text-sm shadow-md mt-2">Publish Class</button>
        </form>

      </div>
    </div>
  );
};

export default AddClass;