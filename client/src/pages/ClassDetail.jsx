import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, MapPin, Phone, MessageCircle, Calendar, Clock, Users, CheckCircle, ArrowLeft, Share2, Bookmark, BookOpen, Globe, Video, Award } from 'lucide-react';
import toast from 'react-hot-toast';

const MOCK_CLASS = {
  id: '1',
  title: 'Advanced A/L Combined Mathematics',
  subject: 'Mathematics',
  grade: 'A/L',
  examType: 'A/L',
  language: 'Sinhala & English',
  fee: 3500,
  feeType: 'per_month',
  description: `This class is designed for students preparing for the Advanced Level Combined Mathematics examination. We cover all topics in the syllabus with detailed explanations, worked examples, and past paper practice.\n\nTopics covered:\n• Algebra & Functions\n• Calculus (Differentiation & Integration)\n• Statistics & Probability\n• Mechanics\n• Vectors & Matrices\n\nClasses are conducted in a small group format to ensure personal attention for each student. Past papers from 2010 to 2023 are covered thoroughly.`,
  teachingMethod: 'Hybrid',
  schedule: { days: ['Monday', 'Wednesday', 'Saturday'], startTime: '7:00 PM', endTime: '9:00 PM', frequency: 'Weekly' },
  location: { district: 'Colombo', city: 'Nugegoda', address: '45, High Level Road, Nugegoda', mapLink: 'https://maps.google.com' },
  enrollCount: 45,
  maxStudents: 50,
  rating: 4.9,
  totalReviews: 128,
  banner: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200&h=400&fit=crop',
  tutor: {
    _id: '1',
    name: 'Dr. Kasun Perera',
    avatar: 'https://i.pravatar.cc/150?img=12',
    phone: '+94711234567',
    email: 'kasun@educonnect.lk',
  },
  tutorProfile: {
    slug: 'dr-kasun-perera',
    bio: 'PhD in Applied Mathematics from University of Colombo. Over 8 years of experience teaching A/L Mathematics. More than 300 students have passed their A/L examination under my guidance.',
    qualifications: [
      { degree: 'PhD in Applied Mathematics', institution: 'University of Colombo', year: 2015 },
      { degree: 'BSc (Hons) Mathematics', institution: 'University of Peradeniya', year: 2010 },
    ],
    experience: 8,
    rating: 4.9,
    totalStudents: 320,
    verificationStatus: 'verified',
    whatsapp: '+94711234567',
  },
};

const MOCK_REVIEWS = [
  { _id: '1', studentId: { name: 'Amara W.', avatar: 'https://i.pravatar.cc/150?img=5' }, rating: 5, comment: 'Excellent teacher! Dr. Kasun explains complex topics in a very simple and understandable way. My grades improved dramatically.', createdAt: '2024-10-15' },
  { _id: '2', studentId: { name: 'Tharaka P.', avatar: 'https://i.pravatar.cc/150?img=8' }, rating: 5, comment: 'Best maths teacher I have ever had. Very patient and thorough. Highly recommend!', createdAt: '2024-09-22' },
  { _id: '3', studentId: { name: 'Dilani S.', avatar: 'https://i.pravatar.cc/150?img=6' }, rating: 4, comment: 'Very knowledgeable and the class notes are very detailed. Online sessions are smooth and well-organized.', createdAt: '2024-08-30' },
  { _id: '4', studentId: { name: 'Ruwan B.', avatar: 'https://i.pravatar.cc/150?img=10' }, rating: 5, comment: 'Got an A pass for my A/L Maths! Thank you sir for all the guidance and support throughout the year.', createdAt: '2024-08-10' },
];

const StarRating = ({ rating, size = 16 }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star key={s} size={size} className={s <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-slate-600'} />
    ))}
  </div>
);

const ClassDetail = () => {
  const { id } = useParams();
  const cls = MOCK_CLASS;
  const [bookmarked, setBookmarked] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviews, setReviews] = useState(MOCK_REVIEWS);

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(`Hello Sir/Madam, I am interested in your "${cls.title}" class. Please provide more details.`);
    window.open(`https://wa.me/${cls.tutorProfile.whatsapp.replace(/\D/g, '')}?text=${msg}`, '_blank');
  };

  const handleCall = () => {
    window.location.href = `tel:${cls.tutor.phone}`;
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    toast.success(bookmarked ? 'Removed from bookmarks' : 'Added to bookmarks!');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return toast.error('Please write a review');
    const newReview = {
      _id: String(reviews.length + 1),
      studentId: { name: 'You', avatar: 'https://i.pravatar.cc/150?img=3' },
      rating: reviewRating,
      comment: reviewText,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setReviews([newReview, ...reviews]);
    setReviewText('');
    toast.success('Review submitted!');
  };

  const methodColors = { Online: 'badge-primary', Physical: 'badge-success', Hybrid: 'badge-warning' };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-950 pt-16">
      {/* Banner */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img src={cls.banner} alt={cls.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-6 left-0 right-0 container-custom">
          <Link to="/explore" className="inline-flex items-center gap-1.5 text-white/80 hover:text-white text-sm mb-3 transition-colors">
            <ArrowLeft size={14} /> Back to Explore
          </Link>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={`badge ${methodColors[cls.teachingMethod] || 'badge-primary'}`}>{cls.teachingMethod}</span>
            <span className="badge bg-black/50 text-white">{cls.grade}</span>
            <span className="badge bg-black/50 text-white">{cls.language}</span>
          </div>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-white text-shadow">{cls.title}</h1>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Stats */}
            <div className="card p-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Star size={16} className="text-amber-400 fill-amber-400" />
                    <span className="font-bold text-slate-900 dark:text-white">{cls.rating}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{cls.totalReviews} reviews</p>
                </div>
                <div className="text-center">
                  <div className="font-bold text-slate-900 dark:text-white mb-1">{cls.enrollCount}</div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Enrolled</p>
                </div>
                <div className="text-center">
                  <div className="font-bold text-primary-600 dark:text-primary-400 mb-1">LKR {cls.fee.toLocaleString()}</div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">/ month</p>
                </div>
                <div className="text-center">
                  <div className="font-bold text-slate-900 dark:text-white mb-1">{cls.tutorProfile.experience}+ yrs</div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Experience</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="card p-6">
              <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-4">About This Class</h2>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                {cls.description.split('\n').map((para, i) => para ? <p key={i} className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-2">{para}</p> : <br key={i} />)}
              </div>
            </div>

            {/* Schedule */}
            <div className="card p-6">
              <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Calendar size={18} className="text-primary-500" /> Schedule
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-4">
                  <p className="text-xs font-medium text-primary-600 dark:text-primary-400 mb-2">Class Days</p>
                  <div className="flex flex-wrap gap-2">
                    {cls.schedule.days.map((day) => (
                      <span key={day} className="badge badge-primary text-xs">{day}</span>
                    ))}
                  </div>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4">
                  <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-2">Time</p>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-emerald-500" />
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{cls.schedule.startTime} – {cls.schedule.endTime}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{cls.schedule.frequency}</p>
                </div>
              </div>
            </div>

            {/* Location */}
            {cls.teachingMethod !== 'Online' && (
              <div className="card p-6">
                <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <MapPin size={18} className="text-primary-500" /> Location
                </h2>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                    <MapPin size={18} className="text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{cls.location.address}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{cls.location.city}, {cls.location.district}</p>
                    <a href={cls.location.mapLink} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-600 dark:text-primary-400 hover:underline mt-1 inline-block">
                      View on Google Maps →
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Tutor */}
            <div className="card p-6">
              <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-4">About the Tutor</h2>
              <div className="flex items-start gap-4 mb-4">
                <img src={cls.tutor.avatar} alt={cls.tutor.name} className="w-16 h-16 rounded-2xl object-cover ring-2 ring-primary-100 dark:ring-primary-900/50" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-slate-900 dark:text-white">{cls.tutor.name}</h3>
                    {cls.tutorProfile.verificationStatus === 'verified' && <span className="badge badge-verified">✓ Verified</span>}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <StarRating rating={cls.tutorProfile.rating} size={13} />
                    <span className="text-sm font-semibold text-amber-500">{cls.tutorProfile.rating}</span>
                    <span className="text-xs text-slate-400">• {cls.tutorProfile.totalStudents} students</span>
                  </div>
                  <Link to={`/tutor/${cls.tutorProfile.slug}`} className="text-sm text-primary-600 dark:text-primary-400 hover:underline mt-1 inline-block">
                    View Full Profile →
                  </Link>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">{cls.tutorProfile.bio}</p>
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">QUALIFICATIONS</p>
                <div className="space-y-2">
                  {cls.tutorProfile.qualifications.map((q, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Award size={14} className="text-primary-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{q.degree}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{q.institution} • {q.year}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white">Student Reviews</h2>
                <div className="flex items-center gap-2">
                  <Star size={18} className="text-amber-400 fill-amber-400" />
                  <span className="font-bold text-slate-900 dark:text-white">{cls.rating}</span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">({cls.totalReviews})</span>
                </div>
              </div>

              {/* Write Review */}
              <form onSubmit={handleReviewSubmit} className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 mb-6">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">Write a Review</p>
                <div className="flex gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button type="button" key={s} onClick={() => setReviewRating(s)}>
                      <Star size={22} className={s <= reviewRating ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-slate-600'} />
                    </button>
                  ))}
                </div>
                <textarea
                  id="review-textarea"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your experience with this class..."
                  rows={3}
                  className="input text-sm resize-none mb-3"
                />
                <button type="submit" id="submit-review-btn" className="btn-primary text-sm py-2">Submit Review</button>
              </form>

              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review._id} className="border-b border-slate-100 dark:border-slate-700/50 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-start gap-3">
                      <img src={review.studentId.avatar} alt={review.studentId.name} className="w-9 h-9 rounded-full object-cover flex-shrink-0" onError={(e) => { e.target.src = 'https://i.pravatar.cc/150?img=1'; }} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div>
                            <span className="font-semibold text-sm text-slate-900 dark:text-white">{review.studentId.name}</span>
                            <p className="text-xs text-slate-400">{review.createdAt}</p>
                          </div>
                          <StarRating rating={review.rating} size={13} />
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Enroll Card */}
            <div className="card p-6 sticky top-24">
              <div className="text-center mb-5">
                <div className="font-display font-bold text-3xl text-primary-600 dark:text-primary-400">
                  LKR {cls.fee.toLocaleString()}
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">per month</p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <div className="h-2 flex-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-500 rounded-full" style={{ width: `${(cls.enrollCount / cls.maxStudents) * 100}%` }} />
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">{cls.enrollCount}/{cls.maxStudents}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{cls.maxStudents - cls.enrollCount} spots remaining</p>
              </div>

              <div className="space-y-3">
                <button id="enroll-btn" onClick={handleWhatsApp} className="w-full btn-primary flex items-center justify-center gap-2 text-sm">
                  <BookOpen size={16} /> Enroll Now
                </button>
                <button id="whatsapp-btn" onClick={handleWhatsApp} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm transition-all duration-200">
                  <MessageCircle size={16} /> WhatsApp Tutor
                </button>
                <button id="call-btn" onClick={handleCall} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm transition-all duration-200">
                  <Phone size={16} /> Call Tutor
                </button>
              </div>

              <div className="flex gap-2 mt-4">
                <button id="bookmark-btn" onClick={handleBookmark} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all ${bookmarked ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-300 text-primary-600 dark:text-primary-400' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                  <Bookmark size={15} className={bookmarked ? 'fill-current' : ''} />
                  {bookmarked ? 'Saved' : 'Save'}
                </button>
                <button id="share-btn" onClick={handleShare} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-medium transition-all">
                  <Share2 size={15} /> Share
                </button>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-700 mt-4 pt-4 space-y-2">
                {[
                  { icon: Globe, label: cls.language },
                  { icon: Video, label: cls.teachingMethod },
                  { icon: Users, label: `${cls.enrollCount} enrolled` },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <Icon size={14} className="text-primary-500 flex-shrink-0" />
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassDetail;
