const User = require('../models/User');
const TutorProfile = require('../models/TutorProfile');
const Class = require('../models/Class');
const Review = require('../models/Review');
const Report = require('../models/Report');

// Get all users
const getUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 20, search } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (search) filter.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      User.find(filter).select('-password').skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
      User.countDocuments(filter),
    ]);
    res.json({ success: true, users, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Toggle user active status
const toggleUserActive = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.isActive = !user.isActive;
    await user.save({ validateBeforeSave: false });
    res.json({ success: true, isActive: user.isActive });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Verify / reject tutor
const verifyTutor = async (req, res) => {
  try {
    const { status, note } = req.body;
    const profile = await TutorProfile.findOne({ userId: req.params.id });
    if (!profile) return res.status(404).json({ success: false, message: 'Tutor profile not found' });
    profile.verificationStatus = status;
    profile.verificationNote = note || '';
    if (status === 'verified') {
      await User.findByIdAndUpdate(req.params.id, { isVerified: true });
    }
    await profile.save();
    res.json({ success: true, message: `Tutor ${status}`, profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get platform analytics
const getAnalytics = async (req, res) => {
  try {
    const [totalUsers, totalTutors, totalStudents, totalClasses, totalReviews, pendingVerifications, pendingReports] =
      await Promise.all([
        User.countDocuments(),
        User.countDocuments({ role: 'tutor' }),
        User.countDocuments({ role: 'student' }),
        Class.countDocuments(),
        Review.countDocuments(),
        TutorProfile.countDocuments({ verificationStatus: 'pending' }),
        Report.countDocuments({ status: 'pending' }),
      ]);

    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    res.json({
      success: true,
      analytics: {
        totalUsers, totalTutors, totalStudents, totalClasses, totalReviews,
        pendingVerifications, pendingReports,
        registrationTrend: last7Days.map(date => ({ date, count: Math.floor(Math.random() * 20) })),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get pending verifications
const getPendingVerifications = async (req, res) => {
  try {
    const tutors = await TutorProfile.find({ verificationStatus: 'pending' })
      .populate('userId', 'name email avatar createdAt');
    res.json({ success: true, tutors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get reports
const getReports = async (req, res) => {
  try {
    const { status = 'pending', page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status !== 'all') filter.status = status;
    const [reports, total] = await Promise.all([
      Report.find(filter)
        .populate('reporterId', 'name email')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit)),
      Report.countDocuments(filter),
    ]);
    res.json({ success: true, reports, total });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Handle report
const handleReport = async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status, adminNote, reviewedBy: req.user._id, reviewedAt: new Date() },
      { new: true }
    );
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
    res.json({ success: true, report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create report
const createReport = async (req, res) => {
  try {
    const { targetId, targetType, reason, description } = req.body;
    const report = await Report.create({ reporterId: req.user._id, targetId, targetType, reason, description });
    res.status(201).json({ success: true, report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getUsers, toggleUserActive, verifyTutor, getAnalytics, getPendingVerifications, getReports, handleReport, createReport };
