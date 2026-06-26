import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LocationPicker from '../../components/common/LocationPicker';
import { useDispatch } from 'react-redux';
import { createClass } from '../../store/slices/classSlice';
import { Building2, BookOpen, MapPin, Upload, Calendar, Clock, DollarSign, Users, GraduationCap } from 'lucide-react';

const SRI_LANKA_DISTRICTS = [
  'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
  'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
  'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
  'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
  'Moneragala', 'Ratnapura', 'Kegalle',
];

const SUBJECTS = [
  'Mathematics', 'Combined Maths', 'Science', 'Physics', 'Chemistry', 'Biology',
  'English', 'Sinhala', 'Tamil', 'History', 'Geography', 'ICT',
  'Commerce', 'Accounting', 'Economics', 'Business Studies', 'Art',
  'Music', 'Dancing', 'Buddhism', 'Islam', 'Hinduism', 'Catholic',
];

const GRADES = [
  'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5',
  'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11',
  'O/L (Local)', 'A/L Science', 'A/L Commerce', 'A/L Arts', 'University',
];

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const InstituteAddClass = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    subject: '',
    grade: '',
    examType: 'None',
    language: 'Sinhala',
    fee: '',
    feeType: 'per_month',
    description: '',
    teachingMethod: 'Physical',
    teacherName: '',
    teacherPhone: '',
    maxStudents: '',
    district: '',
    city: '',
    address: '',
    schedule: { days: [], startTime: '', endTime: '' },
    tags: '',
  });
  const [banner, setBanner] = useState(null);
  const [bannerPreview, setBannerPreview] = useState('');
  const [coords, setCoords] = useState([79.86, 6.9]);
  const [selectedDays, setSelectedDays] = useState([]);

  const toggleDay = (day) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBanner(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('subject', form.subject);
      fd.append('grade', form.grade);
      fd.append('examType', form.examType);
      fd.append('language', form.language);
      fd.append('fee', form.fee);
      fd.append('feeType', form.feeType);
      fd.append('description', form.description);
      fd.append('teachingMethod', form.teachingMethod);
      fd.append('maxStudents', form.maxStudents || 0);
      
      // Add teacher info to tags
      const tags = [];
      if (form.teacherName) tags.push(`teacher:${form.teacherName}`);
      if (form.teacherPhone) tags.push(`phone:${form.teacherPhone}`);
      if (form.tags) tags.push(...form.tags.split(',').map(t => t.trim()));
      fd.append('tags', JSON.stringify(tags));

      const schedule = {
        days: selectedDays,
        startTime: form.schedule.startTime,
        endTime: form.schedule.endTime,
        frequency: 'Weekly',
      };
      fd.append('schedule', JSON.stringify(schedule));

      const location = {
        district: form.district,
        city: form.city,
        address: form.address,
        mapLink: `https://www.openstreetmap.org/?mlat=${coords[1]}&mlon=${coords[0]}`,
      };
      fd.append('location', JSON.stringify(location));
      
      if (banner) fd.append('banner', banner);

      const result = await dispatch(createClass(fd)).unwrap();
      navigate('/dashboard/institute/classes');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-6 bg-[#d9cb00] rounded-full" />
            <span className="text-xs font-bold text-[#1c0da1] uppercase tracking-widest">Institute Portal</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900">Add New Class</h1>
          <p className="text-sm text-slate-500 mt-1">Fill in all details to publish a new tuition class</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-[#1c0da1]" />
              <h2 className="text-lg font-black text-slate-800">Basic Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-500 block mb-1.5 uppercase tracking-wider">Class Title</label>
                <input type="text" required value={form.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  placeholder="e.g., 2026 A/L Combined Maths Revision"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1c0da1] text-sm transition-all" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1.5 uppercase tracking-wider">Subject</label>
                <select required value={form.subject} onChange={(e) => updateField('subject', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1c0da1] text-sm">
                  <option value="">Select subject</option>
                  {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1.5 uppercase tracking-wider">Grade / Year</label>
                <select required value={form.grade} onChange={(e) => updateField('grade', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1c0da1] text-sm">
                  <option value="">Select grade</option>
                  {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1.5 uppercase tracking-wider">Exam Type</label>
                <select value={form.examType} onChange={(e) => updateField('examType', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1c0da1] text-sm">
                  <option value="None">General</option>
                  <option value="Scholarship">Scholarship</option>
                  <option value="O/L">O/L</option>
                  <option value="A/L">A/L</option>
                  <option value="University">University</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1.5 uppercase tracking-wider">Medium / Language</label>
                <select value={form.language} onChange={(e) => updateField('language', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1c0da1] text-sm">
                  <option value="Sinhala">Sinhala</option>
                  <option value="English">English</option>
                  <option value="Tamil">Tamil</option>
                  <option value="Bilingual">Bilingual</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1.5 uppercase tracking-wider">Teaching Method</label>
                <select value={form.teachingMethod} onChange={(e) => updateField('teachingMethod', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1c0da1] text-sm">
                  <option value="Physical">🏫 Physical Classroom</option>
                  <option value="Online">🌐 Online</option>
                  <option value="Hybrid">🔄 Hybrid (Both)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Teacher Info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-black text-slate-800">Teacher / Lecturer Details</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1.5 uppercase tracking-wider">Teacher Name</label>
                <input type="text" value={form.teacherName}
                  onChange={(e) => updateField('teacherName', e.target.value)}
                  placeholder="e.g., Prof. Saman Perera"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1c0da1] text-sm" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1.5 uppercase tracking-wider">Teacher Contact</label>
                <input type="text" value={form.teacherPhone}
                  onChange={(e) => updateField('teacherPhone', e.target.value)}
                  placeholder="e.g., 0771234567"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1c0da1] text-sm" />
              </div>
            </div>
          </div>

          {/* Fee & Capacity */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-amber-600" />
              <h2 className="text-lg font-black text-slate-800">Fee & Capacity</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1.5 uppercase tracking-wider">Fee Amount (LKR)</label>
                <input type="number" required min="0" value={form.fee}
                  onChange={(e) => updateField('fee', e.target.value)}
                  placeholder="e.g., 3000"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1c0da1] text-sm" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1.5 uppercase tracking-wider">Fee Type</label>
                <select value={form.feeType} onChange={(e) => updateField('feeType', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1c0da1] text-sm">
                  <option value="per_month">Per Month</option>
                  <option value="per_class">Per Class</option>
                  <option value="free">Free</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1.5 uppercase tracking-wider">Max Students</label>
                <input type="number" min="0" value={form.maxStudents}
                  onChange={(e) => updateField('maxStudents', e.target.value)}
                  placeholder="e.g., 50"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1c0da1] text-sm" />
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-black text-slate-800">Class Schedule</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-2 uppercase tracking-wider">Class Days</label>
                <div className="flex flex-wrap gap-2">
                  {WEEKDAYS.map(day => (
                    <button key={day} type="button" onClick={() => toggleDay(day)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all ${
                        selectedDays.includes(day)
                          ? 'bg-[#1c0da1] text-white border-[#1c0da1]'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-[#1c0da1]'
                      }`}>
                      {day.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1.5 uppercase tracking-wider">
                    <Clock className="w-3 h-3 inline mr-1" /> Start Time
                  </label>
                  <input type="time" value={form.schedule.startTime}
                    onChange={(e) => setForm(prev => ({ ...prev, schedule: { ...prev.schedule, startTime: e.target.value } }))}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1c0da1] text-sm" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1.5 uppercase tracking-wider">
                    <Clock className="w-3 h-3 inline mr-1" /> End Time
                  </label>
                  <input type="time" value={form.schedule.endTime}
                    onChange={(e) => setForm(prev => ({ ...prev, schedule: { ...prev.schedule, endTime: e.target.value } }))}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1c0da1] text-sm" />
                </div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-black text-slate-800">Class Hall Location</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1.5 uppercase tracking-wider">District</label>
                <select value={form.district} onChange={(e) => updateField('district', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1c0da1] text-sm">
                  <option value="">Select district</option>
                  {SRI_LANKA_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1.5 uppercase tracking-wider">City</label>
                <input type="text" value={form.city}
                  onChange={(e) => updateField('city', e.target.value)}
                  placeholder="e.g., Nugegoda"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1c0da1] text-sm" />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-500 block mb-1.5 uppercase tracking-wider">Address</label>
                <input type="text" value={form.address}
                  onChange={(e) => updateField('address', e.target.value)}
                  placeholder="e.g., No. 123, Galle Road, Nugegoda"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1c0da1] text-sm" />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-2 uppercase tracking-wider">Pick Location on Map</label>
              <LocationPicker initial={[6.9, 79.86]} onChange={(lnglat) => setCoords(lnglat)} />
            </div>
          </div>

          {/* Description & Banner */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1.5 uppercase tracking-wider">Description</label>
                <textarea rows="5" value={form.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  placeholder="Describe the class content, what students will learn, prerequisites, materials provided..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1c0da1] text-sm resize-none" required />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1.5 uppercase tracking-wider">
                  <Upload className="w-3 h-3 inline mr-1" /> Class Banner Image
                </label>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:border-[#1c0da1] transition-colors cursor-pointer"
                  onClick={() => document.getElementById('banner-upload').click()}>
                  {bannerPreview ? (
                    <img src={bannerPreview} alt="Preview" className="max-h-32 mx-auto rounded-lg object-cover" />
                  ) : (
                    <div className="py-6">
                      <Upload className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-xs text-slate-400 font-medium">Click to upload banner image</p>
                      <p className="text-[10px] text-slate-300 mt-1">JPG, PNG or WebP (max 5MB)</p>
                    </div>
                  )}
                  <input id="banner-upload" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </div>
                <div className="mt-3">
                  <label className="text-xs font-bold text-slate-500 block mb-1.5 uppercase tracking-wider">Tags (comma separated)</label>
                  <input type="text" value={form.tags}
                    onChange={(e) => updateField('tags', e.target.value)}
                    placeholder="e.g., revision, weekend, theory"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1c0da1] text-sm" />
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3">
            <button type="button" onClick={() => navigate('/dashboard/institute/classes')}
              className="px-6 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="px-8 py-3 bg-[#1c0da1] text-white rounded-xl text-sm font-bold hover:bg-[#0a044a] transition-all shadow-lg shadow-[#1c0da1]/20 flex items-center gap-2 disabled:opacity-60">
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Publishing...</>
              ) : (
                <><BookOpen className="w-4 h-4" /> Publish Class</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InstituteAddClass;
