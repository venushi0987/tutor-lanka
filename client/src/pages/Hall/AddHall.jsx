import React, { useState } from 'react';

const AddHall = () => {
  const [hallData, setHallData] = useState({ name: '', location: '', capacity: '', ac: 'AC Available', contact: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Hall Details Added:', hallData);
    alert('Hall published successfully!');
    // Backend API: /api/halls
  };


  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 py-10 px-4 flex justify-center items-center">
      <div className="w-full max-w-3xl bg-white rounded-[32px] shadow-xl border border-slate-100 overflow-hidden flex flex-col md:flex-row min-h-[500px]">
        
        <div className="md:w-1/3 bg-gradient-to-br from-[#1c0da1] to-[#0a044a] p-8 text-white flex flex-col justify-center relative overflow-hidden">
          <h3 className="text-2xl font-black uppercase text-[#d9cb00]">Hall Management</h3>
          <p className="text-xs text-slate-200 mt-2 leading-relaxed">Rent out your lecture halls and classrooms to top tutors by listing your institution's facilities here.</p>
        </div>

        <form onSubmit={handleSubmit} className="md:w-2/3 p-8 sm:p-10 space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">Institute / Hall Name</label>
            <input type="text" required placeholder="e.g., Nugegoda Royal Auditorium" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-[#1c0da1] text-sm" onChange={(e) => setHallData({...hallData, name: e.target.value})} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Location / City</label>
              <input type="text" required placeholder="e.g., Nugegoda" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-[#1c0da1] text-sm" onChange={(e) => setHallData({...hallData, location: e.target.value})} />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Contact Number</label>
              <input type="text" required placeholder="e.g., 0771234567" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-[#1c0da1] text-sm" onChange={(e) => setHallData({...hallData, contact: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Seating Capacity</label>
              <input type="number" required placeholder="e.g., 200 Students" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-[#1c0da1] text-sm" onChange={(e) => setHallData({...hallData, capacity: e.target.value})} />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">A/C Status</label>
              <select className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-[#1c0da1] text-sm bg-white cursor-pointer" onChange={(e) => setHallData({...hallData, ac: e.target.value})}>
                <option value="AC Available">❄️ Air Conditioned (A/C)</option>
                <option value="Non AC">💨 Non A/C (Fans Only)</option>
              </select>
            </div>
          </div>

          <button type="submit" className="w-full py-3.5 bg-[#1c0da1] text-white font-bold rounded-xl hover:bg-[#0a044a] transition-all text-sm shadow-md mt-4">List Hall Facility</button>
        </form>

      </div>
    </div>
  );
};

export default AddHall;