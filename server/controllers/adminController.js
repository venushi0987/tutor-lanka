const User = require('../models/User');
const TutorProfile = require('../models/TutorProfile');
const StudentProfile = require('../models/StudentProfile');
const Class = require('../models/Class');
const Review = require('../models/Review');
const Report = require('../models/Report');
const ActivityLog = require('../models/ActivityLog');
const Notification = require('../models/Notification');
const Bookmark = require('../models/Bookmark');

// ─────────────────────────────────────────────
// Get all users (paginated, filterable)
// GET /api/admin/users
// ─────────────────────────────────────────────
const getUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 20, search } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      User.find(filter).select('-password -refreshToken').skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
      User.countDocuments(filter),
    ]);
    res.json({ success: true, users, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// Toggle user active status
// PUT /api/admin/users/:id/toggle
// ─────────────────────────────────────────────
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

// ─────────────────────────────────────────────
// Delete user and their profiles
// DELETE /api/admin/users/:id
// ─────────────────────────────────────────────
const deleteUser = async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own account' });
    }
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Delete associated profiles
    await Promise.all([
      TutorProfile.findOneAndDelete({ userId: user._id }),
      StudentProfile.findOneAndDelete({ userId: user._id }),
      Notification.deleteMany({ userId: user._id }),
      Bookmark.deleteMany({ studentId: user._id }),
      ActivityLog.deleteMany({ userId: user._id }),
    ]);

    await user.deleteOne();
    res.json({ success: true, message: 'User and associated data deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// Verify / reject tutor
// PUT /api/admin/tutors/:id/verify
// ─────────────────────────────────────────────
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

// ─────────────────────────────────────────────
// Get platform analytics (real MongoDB aggregation)
// GET /api/admin/analytics
// ─────────────────────────────────────────────
const getAnalytics = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const [
      totalUsers,
      totalTutors,
      totalStudents,
      totalClasses,
      totalReviews,
      pendingVerifications,
      pendingReports,
      registrationAgg,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'tutor' }),
      User.countDocuments({ role: 'student' }),
      Class.countDocuments(),
      Review.countDocuments(),
      TutorProfile.countDocuments({ verificationStatus: 'pending' }),
      Report.countDocuments({ status: 'pending' }),
      // Real aggregation: group registrations by date for last 7 days
      User.aggregate([
        { $match: { createdAt: { $gte: sevenDaysAgo } } },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    // Build a full 7-day array, fill missing days with 0
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      last7Days.push(d.toISOString().split('T')[0]);
    }

    const aggMap = {};
    registrationAgg.forEach((r) => { aggMap[r._id] = r.count; });

    const registrationTrend = last7Days.map((date) => ({
      date,
      count: aggMap[date] || 0,
    }));

    res.json({
      success: true,
      analytics: {
        totalUsers,
        totalTutors,
        totalStudents,
        totalClasses,
        totalReviews,
        pendingVerifications,
        pendingReports,
        registrationTrend,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// Get pending verifications
// GET /api/admin/verifications
// ─────────────────────────────────────────────
const getPendingVerifications = async (req, res) => {
  try {
    const tutors = await TutorProfile.find({ verificationStatus: 'pending' })
      .populate('userId', 'name email avatar createdAt');
    res.json({ success: true, tutors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// Get reports (paginated)
// GET /api/admin/reports
// ─────────────────────────────────────────────
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

// ─────────────────────────────────────────────
// Handle (resolve/dismiss) a report
// PUT /api/admin/reports/:id
// ─────────────────────────────────────────────
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

// ─────────────────────────────────────────────
// Create a report (any authenticated user)
// POST /api/admin/reports
// ─────────────────────────────────────────────
const createReport = async (req, res) => {
  try {
    const { targetId, targetType, reason, description } = req.body;
    const report = await Report.create({
      reporterId: req.user._id,
      targetId,
      targetType,
      reason,
      description,
    });
    res.status(201).json({ success: true, report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// Get activity logs (paginated, with user populated)
// GET /api/admin/activity-logs
// ─────────────────────────────────────────────
const getActivityLogs = async (req, res) => {
  try {
    const { page = 1, limit = 50, userId, action } = req.query;
    const filter = {};
    if (userId) filter.userId = userId;
    if (action) filter.action = { $regex: action, $options: 'i' };

    const skip = (page - 1) * limit;
    const [logs, total] = await Promise.all([
      ActivityLog.find(filter)
        .populate('userId', 'name email role avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      ActivityLog.countDocuments(filter),
    ]);
    res.json({ success: true, logs, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// Get system stats (collection counts)
// GET /api/admin/stats
// ─────────────────────────────────────────────
const getSystemStats = async (req, res) => {
  try {
    const [
      users,
      tutors,
      students,
      admins,
      classes,
      reviews,
      reports,
      notifications,
      bookmarks,
      activityLogs,
      tutorProfiles,
      studentProfiles,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'tutor' }),
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'admin' }),
      Class.countDocuments(),
      Review.countDocuments(),
      Report.countDocuments(),
      Notification.countDocuments(),
      Bookmark.countDocuments(),
      ActivityLog.countDocuments(),
      TutorProfile.countDocuments(),
      StudentProfile.countDocuments(),
    ]);

    res.json({
      success: true,
      stats: {
        users: { total: users, tutors, students, admins },
        content: { classes, reviews, reports },
        engagement: { notifications, bookmarks, activityLogs },
        profiles: { tutorProfiles, studentProfiles },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// Toggle class featured status
// PUT /api/admin/classes/:id/featured
// ─────────────────────────────────────────────
const toggleClassFeatured = async (req, res) => {
  try {
    const cls = await Class.findById(req.params.id);
    if (!cls) return res.status(404).json({ success: false, message: 'Class not found' });
    cls.isFeatured = !cls.isFeatured;
    await cls.save();
    res.json({ success: true, isFeatured: cls.isFeatured, message: `Class ${cls.isFeatured ? 'featured' : 'unfeatured'}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// Toggle tutor featured status
// PUT /api/admin/tutors/:id/featured
// ─────────────────────────────────────────────
const toggleTutorFeatured = async (req, res) => {
  try {
    const profile = await TutorProfile.findOne({ userId: req.params.id });
    if (!profile) return res.status(404).json({ success: false, message: 'Tutor profile not found' });
    profile.isFeatured = !profile.isFeatured;
    await profile.save();
    res.json({ success: true, isFeatured: profile.isFeatured, message: `Tutor ${profile.isFeatured ? 'featured' : 'unfeatured'}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getUsers,
  toggleUserActive,
  deleteUser,
  verifyTutor,
  getAnalytics,
  getPendingVerifications,
  getReports,
  handleReport,
  createReport,
  getActivityLogs,
  getSystemStats,
  toggleClassFeatured,
  toggleTutorFeatured,
};
