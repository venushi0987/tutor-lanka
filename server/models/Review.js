const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    tutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, maxlength: 1000 },
    tutorResponse: { type: String, default: '' },
    helpfulVotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// One review per student per tutor
reviewSchema.index({ tutorId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
