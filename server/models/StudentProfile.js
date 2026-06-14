const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    school: { type: String, default: '' },
    grade: { type: String, default: '' },
    district: { type: String, default: '' },
    subjects: [{ type: String }],
    guardianName: { type: String, default: '' },
    guardianPhone: { type: String, default: '' },
    recentlyViewed: [
      {
        classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
        viewedAt: { type: Date, default: Date.now },
      },
    ],
    followedTutors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
