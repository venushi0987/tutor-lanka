const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    tutor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    subject: { type: String, required: true },
    gradeLevel: { type: String, required: true }, // Used for student matching
    isPaid: { type: Boolean, default: false },
    price: { type: Number, default: 0 },
    type: { type: String, enum: ['Online', 'Physical', 'Home Visit'], default: 'Physical' },
    bannerImage: { type: String, default: '' },
    status: { type: String, enum: ['Draft', 'Published', 'Archived'], default: 'Draft' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);
