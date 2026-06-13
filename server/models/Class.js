const mongoose = require('mongoose');

const classSchema = new mongoose.Schema(
  {
    tutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    subject: { type: String, required: true },
    grade: { type: String, required: true }, // "Grade 6", "O/L", "A/L"
    examType: {
      type: String,
      enum: ['Scholarship', 'O/L', 'A/L', 'University', 'Other', 'None'],
      default: 'None',
    },
    language: { type: String, enum: ['Sinhala', 'English', 'Tamil', 'Bilingual'], required: true },
    fee: { type: Number, required: true, min: 0 },
    feeType: { type: String, enum: ['per_month', 'per_class', 'free'], default: 'per_month' },
    description: { type: String, required: true, maxlength: 2000 },
    bannerImage: { type: String, default: '' },
    teachingMethod: {
      type: String,
      enum: ['Online', 'Physical', 'Hybrid'],
      required: true,
    },
    schedule: {
      days: [{ type: String }], // ['Monday', 'Wednesday']
      startTime: { type: String },
      endTime: { type: String },
      frequency: { type: String, default: 'Weekly' },
    },
    location: {
      district: { type: String, default: '' },
      city: { type: String, default: '' },
      address: { type: String, default: '' },
      mapLink: { type: String, default: '' },
    },
    maxStudents: { type: Number, default: 0 },
    enrollCount: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    slug: { type: String, unique: true, sparse: true },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

classSchema.index({ subject: 'text', title: 'text', description: 'text' });

module.exports = mongoose.model('Class', classSchema);
