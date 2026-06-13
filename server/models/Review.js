const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    tutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, maxlength: 500 },
    isEdited: { type: Boolean, default: false },
  },
  { timestamps: true }
);

reviewSchema.index({ classId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
