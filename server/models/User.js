const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, minlength: 6, select: false },
    role: { type: String, enum: ['student', 'tutor', 'hall_owner', 'admin'], default: 'student' },
    googleId: { type: String },
    avatar: { type: String, default: '' },
    phone: { type: String, default: '' },
    gender: { type: String, default: '' },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    lastSeen: { type: Date, default: Date.now },
<<<<<<< Updated upstream
=======
    // New fields
    refreshToken: { type: String, default: null, select: false },
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date, default: null },
    bio: { type: String, default: '', maxlength: 500 },
    dateOfBirth: { type: Date, default: null }, // Used to calculate age for recommendations
    address: { type: String, default: '' },
    locationCoords: { type: [Number], default: [] }, // [lng, lat] for interactive map
    grade: { type: String, default: null }, // e.g., 'Grade 1', 'G.C.E O/L'
    qualifications: [{ type: String }], // e.g., ['BSc Physics', '10 Years Exp']
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of tutor IDs
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    // Password reset
    passwordResetToken: { type: String, select: false },
    passwordResetExpire: { type: Date, select: false },
>>>>>>> Stashed changes
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
