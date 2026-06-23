import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const HallDashboard = () => {
  const { user, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHalls = async () => {
      try {
        const res = await axios.get(`${API}/halls/my`, { headers: { Authorization: `Bearer ${token}` } });
        if (res.data.success) setHalls(res.data.halls);
      } catch (err) {
        console.error('Could not load halls:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHalls();
  }, []);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 dark:bg-dark-950">
      <div className="bg-gradient-to-r from-[#1c0da1] to-[#0a044a] px-8 py-10 shadow-xl">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-black text-white">Hall Owner Dashboard</h1>
          <p className="text-slate-300 mt-1 text-sm">Welcome, {user?.name?.split(' ')[0]}! Manage your class halls.</p>
          <button onClick={() => navigate('/add-hall')} className="mt-6 bg-[#d9cb00] text-[#0a044a] font-black px-6 py-3 rounded-xl hover:bg-yellow-400 transition-all shadow-lg text-sm">
            ＋ List New Hall
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Listed Halls', value: halls.length },
            { label: 'Account Status', value: user?.isVerified ? '✅ Verified' : '⏳ Pending' },
            { label: 'Role', value: 'Hall Owner' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white dark:bg-dark-900 rounded-2xl p-5 border border-slate-200 dark:border-dark-800 shadow-sm">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-black text-[#1c0da1] dark:text-[#d9cb00] mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-black dark:text-white mb-6">My Listed Halls</h2>

        {loading ? (
          <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-[#1c0da1] border-t-transparent rounded-full animate-spin" /></div>
        ) : halls.length === 0 ? (
          <div className="bg-white dark:bg-dark-900 rounded-3xl p-16 text-center border border-dashed border-slate-200 dark:border-dark-800">
            <p className="text-5xl mb-4">🏫</p>
            <h3 className="text-xl font-black text-slate-700 dark:text-white">No halls listed yet</h3>
            <p className="text-slate-400 text-sm mt-2 mb-6">List your first hall to connect with tutors looking for venues.</p>
            <button onClick={() => navigate('/add-hall')} className="bg-[#1c0da1] text-white font-bold px-8 py-3 rounded-xl hover:bg-[#0a044a]">+ List First Hall</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {halls.map((h) => (
              <div key={h._id} className="bg-white dark:bg-dark-900 p-6 rounded-3xl border border-slate-200 dark:border-dark-800 shadow-sm hover:shadow-xl transition-all">
                <div className="flex justify-between items-start mb-3">
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full ${h.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                    {h.isAvailable ? 'Available' : 'Occupied'}
                  </span>
                  <span className="text-xs font-bold text-slate-400">Cap: {h.capacity}</span>
                </div>
                <h3 className="font-black text-lg dark:text-white">{h.name}</h3>
                <p className="text-sm text-slate-500 mt-1">{h.address}</p>
                {h.amenities?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {h.amenities.slice(0, 3).map((a, i) => (
                      <span key={i} className="text-[10px] bg-slate-100 dark:bg-dark-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-lg font-semibold">{a}</span>
                    ))}
                  </div>
                )}
                <p className="font-black text-xl text-[#1c0da1] dark:text-[#d9cb00] mt-4">Rs. {h.hourlyRate?.toLocaleString()}<span className="text-xs font-normal text-slate-400">/hr</span></p>
                <button className="mt-4 w-full py-2 bg-slate-100 dark:bg-dark-800 rounded-xl text-sm font-bold dark:text-white hover:bg-slate-200 transition-all">Manage Hall</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HallDashboard;
