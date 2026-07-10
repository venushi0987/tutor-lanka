const crypto = require('crypto');
const User = require('../models/User');
const TutorProfile = require('../models/TutorProfile');
const StudentProfile = require('../models/StudentProfile');
const InstituteProfile = require('../models/InstituteProfile');
const ActivityLog = require('../models/ActivityLog');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken');
const jwt = require('jsonwebtoken');

// ─────────────────────────────────────────────
// Helper: set httpOnly refresh token cookie
// ─────────────────────────────────────────────
const setRefreshCookie = (res, token) => {
  if (!token) return;
  res.cookie('refreshToken', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false, // set to true in production with HTTPS
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// ─────────────────────────────────────────────
// Helper: log activity (non-blocking)
// ─────────────────────────────────────────────
const logActivity = async (userId, action, details = '', req = null) => {
  try {
    const ip = req ? (req.ip || req.headers['x-forwarded-for'] || '') : '';
    const userAgent = req ? (req.headers['user-agent'] || '') : '';
    await ActivityLog.create({ userId, action, details, ip, userAgent });
  } catch (_) {
    // Do not block main flow on logging errors
  }
};

// ─────────────────────────────────────────────
// @desc    Register user
// @route   POST /api/auth/register
// ─────────────────────────────────────────────
const register = async (req, res) => {
  console.log('DEBUG: authController.register invoked');
  try {
    const { name, email, password, role } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const userRole = role || 'student';
    const user = await User.create({ name, email, password, role: userRole });

    // Create role-specific profile
    if (userRole === 'tutor') {
      const slugify = require('slugify');
      const slug = slugify(name, { lower: true, strict: true }) + '-' + user._id.toString().slice(-4);
      await TutorProfile.create({ userId: user._id, slug });
    } else if (userRole === 'student') {
      await StudentProfile.create({ userId: user._id });
    } else if (userRole === 'institute') {
      // Create an institute profile tied to this user
      const slugify = require('slugify');
      const slug = slugify(name, { lower: true, strict: true }) + '-' + user._id.toString().slice(-4);
      await InstituteProfile.create({ userId: user._id, name, slug });
    }

    // Generate tokens (may be null when JWT is disabled)
    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    // Persist refresh token and set cookie only if token was generated
    if (refreshToken) {
      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });
      setRefreshCookie(res, refreshToken);
    } else {
      // Ensure we don't accidentally store undefined
      user.refreshToken = null;
      await user.save({ validateBeforeSave: false });
    }

    await logActivity(user._id, 'register', `User registered as ${userRole}`, req);

    const responseBody = {
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        isVerified: user.isVerified,
      },
    };
    if (accessToken) responseBody.token = accessToken;

    res.status(201).json(responseBody);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// @desc    Login user
// @route   POST /api/auth/login
// ─────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password +loginAttempts +lockUntil +refreshToken');
    if (!user || !user.password) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if account is locked
    if (user.isLocked()) {
      const waitMinutes = Math.ceil((user.lockUntil - Date.now()) / 60000);
      return res.status(423).json({
        success: false,
        message: `Account locked due to too many failed attempts. Try again in ${waitMinutes} minute(s).`,
      });
    }

    // Check active status
    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account has been deactivated' });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      // Increment login attempts
      user.loginAttempts = (user.loginAttempts || 0) + 1;
      if (user.loginAttempts >= 5) {
        // Lock for 30 minutes
        user.lockUntil = new Date(Date.now() + 30 * 60 * 1000);
        await user.save({ validateBeforeSave: false });
        await logActivity(user._id, 'account_locked', 'Account locked after 5 failed login attempts', req);
        return res.status(423).json({
          success: false,
          message: 'Too many failed attempts. Account locked for 30 minutes.',
        });
      }
      await user.save({ validateBeforeSave: false });
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Successful login — reset attempts
    user.loginAttempts = 0;
    user.lockUntil = null;
    user.lastSeen = Date.now();

    // Generate tokens (may be null when JWT is disabled)
    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    if (refreshToken) {
      // Persist refresh token
      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });
      // Set cookie
      setRefreshCookie(res, refreshToken);
    } else {
      user.refreshToken = null;
      await user.save({ validateBeforeSave: false });
    }

    await logActivity(user._id, 'login', 'Successful login', req);

    const responseBody = {
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        isVerified: user.isVerified,
      },
    };
    if (accessToken) responseBody.token = accessToken;

    res.json(responseBody);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// @desc    Refresh access token
// @route   POST /api/auth/refresh-token
// ─────────────────────────────────────────────
const refreshToken = async (req, res) => {
  try {
    if (process.env.DISABLE_JWT === 'true') {
      return res.status(501).json({ success: false, message: 'Token refresh disabled' });
    }

    const token = req.cookies.refreshToken;
    if (!token) {
      return res.status(401).json({ success: false, message: 'No refresh token provided' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
    }

    const user = await User.findById(decoded.id).select('+refreshToken');
    if (!user || user.refreshToken !== token) {
      return res.status(401).json({ success: false, message: 'Refresh token mismatch' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account deactivated' });
    }

    const newAccessToken = generateAccessToken(user._id, user.role);
    res.json({ success: true, token: newAccessToken });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// @desc    Logout user
// @route   POST /api/auth/logout
// ─────────────────────────────────────────────
const logout = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(400).json({ success: false, message: 'No authenticated user to log out' });
    }
    // Clear refresh token from DB
    await User.findByIdAndUpdate(req.user._id, { refreshToken: null });

    // Clear cookie
    res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'lax', secure: false });

    await logActivity(req.user._id, 'logout', 'User logged out', req);

    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// @desc    Get current user with profile
// @route   GET /api/auth/me
// ─────────────────────────────────────────────
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).lean();
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    let profile = null;
    if (user.role === 'tutor') {
      profile = await TutorProfile.findOne({ userId: user._id }).lean();
    } else if (user.role === 'student') {
      profile = await StudentProfile.findOne({ userId: user._id }).lean();
    } else if (user.role === 'institute') {
      profile = await InstituteProfile.findOne({ userId: user._id }).lean();
    }

    res.json({ success: true, user: { ...user, profile } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// @desc    Update profile (name, phone, bio, avatar)
// @route   PUT /api/auth/profile
// ─────────────────────────────────────────────
const updateProfile = async (req, res) => {
  try {
    const { name, phone, bio, address, dateOfBirth } = req.body;
    const updates = {};
    if (name) updates.name = name.trim();
    if (phone !== undefined) updates.phone = phone;
    if (bio !== undefined) updates.bio = bio;
    if (address !== undefined) updates.address = address;
    if (dateOfBirth !== undefined) updates.dateOfBirth = dateOfBirth;
    if (req.file) updates.avatar = req.file.path;

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// @desc    Forgot password — generate reset token
// @route   POST /api/auth/forgot-password
// ─────────────────────────────────────────────
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

    const user = await User.findOne({ email });
    if (!user) {
      // Generic response to prevent user enumeration
      return res.json({ success: true, message: 'If an account with that email exists, a reset link has been sent.' });
    }

    // Generate raw token
    const rawToken = crypto.randomBytes(32).toString('hex');
    // Store hashed version
    user.passwordResetToken = crypto.createHash('sha256').update(rawToken).digest('hex');
    user.passwordResetExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save({ validateBeforeSave: false });

    // In production, send email. For now, log it.
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${rawToken}`;
    console.log(`[PASSWORD RESET] User: ${user.email} | Reset URL: ${resetUrl}`);

    await logActivity(user._id, 'forgot_password', 'Password reset requested', req);

    res.json({
      success: true,
      message: 'If an account with that email exists, a reset link has been sent.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// @desc    Reset password using token
// @route   POST /api/auth/reset-password/:token
// ─────────────────────────────────────────────
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    // Hash the incoming token to compare with stored hash
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpire: { $gt: Date.now() },
    }).select('+passwordResetToken +passwordResetExpire');

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpire = undefined;
    user.refreshToken = null; // Invalidate all existing sessions
    await user.save();

    await logActivity(user._id, 'reset_password', 'Password was reset via token', req);

    res.json({ success: true, message: 'Password reset successfully. Please log in.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// @desc    Update password (authenticated)
// @route   PUT /api/auth/password
// ─────────────────────────────────────────────
const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Both current and new passwords are required' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
    }

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    // Rotate refresh token on password change for security (may be disabled)
    const newRefreshToken = generateRefreshToken(user._id);
    if (newRefreshToken) {
      user.refreshToken = newRefreshToken;
      await user.save();
      setRefreshCookie(res, newRefreshToken);
    } else {
      user.refreshToken = null;
      await user.save();
    }

    const accessToken = generateAccessToken(user._id, user.role);
    await logActivity(user._id, 'update_password', 'Password updated', req);

    const resp = { success: true, message: 'Password updated successfully' };
    if (accessToken) resp.token = accessToken;
    res.json(resp);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// @desc    Google OAuth callback handler
// ─────────────────────────────────────────────
const googleCallback = async (req, res) => {
  try {
    const user = req.user;

    const accessToken = generateAccessToken(user._id, user.role);
    const newRefreshToken = generateRefreshToken(user._id);

    if (newRefreshToken) {
      user.refreshToken = newRefreshToken;
      await user.save({ validateBeforeSave: false });
      setRefreshCookie(res, newRefreshToken);
    } else {
      user.refreshToken = null;
      await user.save({ validateBeforeSave: false });
    }

    await logActivity(user._id, 'google_login', 'Logged in via Google OAuth', req);

    const redirectUrl = `${process.env.CLIENT_URL}/auth/google/success` + (accessToken ? `?token=${accessToken}` : '');
    res.redirect(redirectUrl);
  } catch (error) {
    res.redirect(`${process.env.CLIENT_URL}/auth/google/error`);
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  getMe,
  updateProfile,
  forgotPassword,
  resetPassword,
  updatePassword,
  googleCallback,
};
