import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyClasses, deleteClass } from '../../store/slices/classSlice';
import { useNavigate } from 'react-router-dom';

const InstituteClasses = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const myClasses = useSelector(state => state.classes.myClasses);

  useEffect(() => {
    dispatch(fetchMyClasses());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (!confirm('Delete this class?')) return;
    dispatch(deleteClass(id));
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black">My Classes</h1>
            <p className="text-sm text-slate-500">Manage classes published by your institute.</p>
          </div>
          <div>
            <button onClick={() => navigate('/add-class')} className="px-4 py-2 bg-[#1c0da1] text-white rounded-xl font-bold">Add Class</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {myClasses?.length === 0 && <div className="p-6 bg-white rounded-xl border">No classes yet.</div>}
          {myClasses?.map(cls => (
            <div key={cls._id} className="bg-white rounded-2xl p-4 border shadow-sm flex justify-between items-start">
              <div>
                <h3 className="font-bold text-slate-800">{cls.title}</h3>
                <p className="text-xs text-slate-500 mt-1">{cls.subject} · {cls.grade} · Rs {cls.fee}</p>
                <p className="text-xs text-slate-400 mt-2">{cls.location?.city || ''} {cls.location?.address || ''}</p>
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => navigate(`/edit-class/${cls._id}`)} className="px-3 py-1 bg-white border rounded-xl text-sm">Edit</button>
                <button onClick={() => handleDelete(cls._id)} className="px-3 py-1 bg-rose-50 text-rose-700 border rounded-xl text-sm">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InstituteClasses;