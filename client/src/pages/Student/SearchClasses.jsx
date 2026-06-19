import React, { useState } from 'react';

const SearchClasses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const dummyClasses = [
    { id: 1, title: 'Combined Maths 2026 A/L', tutor: 'Prof. Saman Perera', type: 'Online', fee: 'LKR 3,500' },
    { id: 2, title: 'Chemistry Revision', tutor: 'Dr. Ruwan Silva', type: 'Physical', fee: 'LKR 4,000' },
    { id: 3, title: 'ICT Grade 10 & 11', tutor: 'Amila Jayasinghe', type: 'Home Visit', fee: 'LKR 2,500' },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 p-6 sm:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Search & Filter Header Box */}
        <div className="bg-gradient-to-r from-[#1c0da1] to-[#0a044a] rounded-3xl p-8 text-white flex flex-col md:flex-row justify-between items-center gap-4 shadow-xl">
          <div>
            <h2 className="text-3xl font-black tracking-wide">Find Your Perfect Class</h2>
            <p className="text-xs text-slate-300 mt-1">Search through premium classes across Sri Lanka</p>
          </div>
          <div className="w-full md:w-auto flex bg-white rounded-2xl p-1.5 shadow-md items-center max-w-md flex-grow">
            <span className="px-3 text-slate-400">🔍</span>
            <input type="text" placeholder="Search by subject, teacher..." className="w-full py-2.5 outline-none text-slate-800 text-sm font-medium" onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>

        {/* Classes Display Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {dummyClasses.map((item) => (
            <div key={item.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group">
              <div>
                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider mb-4 ${item.type === 'Online' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                  {item.type}
                </span>
                <h4 className="text-lg font-black text-slate-800 group-hover:text-[#1c0da1] transition-colors">{item.title}</h4>
                <p className="text-xs font-semibold text-slate-400 mt-1">By {item.tutor}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center">
                <span className="text-sm font-black text-[#1c0da1]">{item.fee} <span className="text-[10px] text-slate-400 font-normal">/month</span></span>
                <button className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-[#d9cb00] hover:text-slate-900 transition-all">Enroll Now</button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default SearchClasses;