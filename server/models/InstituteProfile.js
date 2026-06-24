const mongoose = require('mongoose');

const instituteProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    name: { type: String, required: true, trim: true },
    bio: { type: String, default: '', maxlength: 2000 },
    logo: { type: String, default: '' },
    banners: [{ type: String }],
    contact: {
      phone: { type: String, default: '' },
      email: { type: String, default: '' },
      website: { type: String, default: '' },
    },
    locations: [
      {
        name: { type: String, default: '' },
        district: { type: String, default: '' },
        city: { type: String, default: '' },
        address: { type: String, default: '' },
        // GeoJSON point: [lng, lat]
        coordinates: {
          type: { type: String, enum: ['Point'], default: 'Point' },
          coordinates: { type: [Number], default: [0, 0] },
        },
      },
    ],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },
    slug: { type: String, unique: true, sparse: true },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

instituteProfileSchema.index({ 'locations.coordinates': '2dsphere' });

module.exports = mongoose.model('InstituteProfile', instituteProfileSchema);
