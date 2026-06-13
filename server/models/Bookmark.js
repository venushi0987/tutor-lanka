const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
    itemType: { type: String, enum: ['class', 'tutor'], required: true },
  },
  { timestamps: true }
);

bookmarkSchema.index({ studentId: 1, itemId: 1, itemType: 1 }, { unique: true });

module.exports = mongoose.model('Bookmark', bookmarkSchema);
