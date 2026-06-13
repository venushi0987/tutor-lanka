const mongoose = require('mongoose');

const tutorProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    bio: { type: String, default: '', maxlength: 1000 },
    qualifications: [
      {
        degree: String,
        institution: String,
        year: Number,
        documentUrl: String,
      },
    ],
    experience: { type: Number, default: 0 }, // years
    subjects: [{ type: String }],
    languages: [{ type: String, enum: ['Sinhala', 'English', 'Tamil'] }],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },
    totalStudents: { type: Number, default: 0 },
    verificationStatus: {
      type: String,
      enum: ['unverified', 'pending', 'verified', 'rejected'],
      default: 'unverified',
    },
    verificationDocs: [
      {
        docType: { type: String, enum: ['nic', 'degree', 'teaching_cert', 'other'] },
        url: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    verificationNote: { type: String, default: '' },
    socialLinks: {
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      youtube: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      website: { type: String, default: '' },
    },
    whatsapp: { type: String, default: '' },
    location: {
      district: { type: String, default: '' },
      city: { type: String, default: '' },
      address: { type: String, default: '' },
    },
    profileViews: { type: Number, default: 0 },
    contactClicks: { type: Number, default: 0 },
    enrollRequests: { type: Number, default: 0 },
    slug: { type: String, unique: true, sparse: true },
    isFeatured: { type: Boolean, default: false },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('TutorProfile', tutorProfileSchema);
