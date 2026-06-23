const User = require('../models/User');
const TutorProfile = require('../models/TutorProfile');
const generateToken = require('../utils/generateToken');
const passport = require('passport');

// @desc    Register user
// @route   POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ success: false, message: 'Email already registered' });

    const user = await User.create({ name, email, password, role: role || 'student' });

    if (user.role === 'tutor') {
      const slugify = require('slugify');
      const slug = slugify(name, { lower: true, strict: true }) + '-' + user._id.toString().slice(-4);
      await TutorProfile.create({ userId: user._id, slug });
    }

    const token = generateToken(user._id);
    res.status(201).json({
      success: true,
<<<<<<< Updated upstream
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
=======
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
    const { name, phone, gender, bio, address, locationCoords, dateOfBirth, grade, qualifications } = req.body;
    const updates = {};
    if (name) updates.name = name.trim();
    if (phone !== undefined) updates.phone = phone;
    if (gender !== undefined) updates.gender = gender;
    if (bio !== undefined) updates.bio = bio;
    if (address !== undefined) updates.address = address;
    if (locationCoords !== undefined) updates.locationCoords = locationCoords;
    if (dateOfBirth !== undefined) updates.dateOfBirth = dateOfBirth;
    if (grade !== undefined) updates.grade = grade;
    if (qualifications !== undefined) updates.qualifications = qualifications;
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
>>>>>>> Stashed changes
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password are required' });

    const user = await User.findOne({ email }).select('+password');
    if (!user || !user.password) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    if (!user.isActive) return res.status(403).json({ success: false, message: 'Account has been deactivated' });

    user.lastSeen = Date.now();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id);
    res.json({
      success: true,
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update password
// @route   PUT /api/auth/password
const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    user.password = newPassword;
    await user.save();
    const token = generateToken(user._id);
    res.json({ success: true, token, message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Google OAuth callback handler
const googleCallback = async (req, res) => {
  const token = generateToken(req.user._id);
  res.redirect(`${process.env.CLIENT_URL}/auth/google/success?token=${token}`);
};

module.exports = { register, login, getMe, updatePassword, googleCallback };
