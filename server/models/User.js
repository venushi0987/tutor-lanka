const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, minlength: 6, select: false },
    role: { type: String, enum: ['student', 'tutor', 'admin'], default: 'student' },
    googleId: { type: String },
    avatar: { type: String, default: '' },
    phone: { type: String, default: '' },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    lastSeen: { type: Date, default: Date.now },
    // New fields
    refreshToken: { type: String, default: null, select: false },
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date, default: null },
    bio: { type: String, default: '', maxlength: 500 },
    dateOfBirth: { type: Date, default: null },
    address: { type: String, default: '' },
    // Password reset
    passwordResetToken: { type: String, select: false },
    passwordResetExpire: { type: Date, select: false },
  },
  { timestamps: true }
);

// Pre-save hook: hash password if modified
// Use async/await middleware without callback-style next()
userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Instance method: compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Instance method: check if account is locked
userSchema.methods.isLocked = function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

module.exports = mongoose.model('User', userSchema);
