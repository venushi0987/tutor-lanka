const StudentProfile = require('../models/StudentProfile');
const Bookmark = require('../models/Bookmark');
const Notification = require('../models/Notification');
const User = require('../models/User');

// ─────────────────────────────────────────────
// @desc    Get student profile
// @route   GET /api/students/profile
// ─────────────────────────────────────────────
const getStudentProfile = async (req, res) => {
  try {
    let profile = await StudentProfile.findOne({ userId: req.user._id })
      .populate('followedTutors', 'name email avatar')
      .populate({
        path: 'recentlyViewed.classId',
        select: 'title subject grade medium fee tutorId',
        populate: { path: 'tutorId', select: 'name avatar' },
      });

    // Auto-create profile if not found
    if (!profile) {
      profile = await StudentProfile.create({ userId: req.user._id });
    }

    res.json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// @desc    Update student profile
// @route   PUT /api/students/profile
// ─────────────────────────────────────────────
const updateStudentProfile = async (req, res) => {
  try {
    const { school, grade, district, subjects, guardianName, guardianPhone } = req.body;
    const updates = {};
    if (school !== undefined) updates.school = school;
    if (grade !== undefined) updates.grade = grade;
    if (district !== undefined) updates.district = district;
    if (subjects !== undefined) updates.subjects = Array.isArray(subjects) ? subjects : [subjects];
    if (guardianName !== undefined) updates.guardianName = guardianName;
    if (guardianPhone !== undefined) updates.guardianPhone = guardianPhone;

    const profile = await StudentProfile.findOneAndUpdate(
      { userId: req.user._id },
      updates,
      { new: true, upsert: true, runValidators: true }
    );

    res.json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// @desc    Get user bookmarks
// @route   GET /api/students/bookmarks
// ─────────────────────────────────────────────
const getBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ studentId: req.user._id })
      .populate({
        path: 'itemId',
        select: 'title subject grade medium fee tutorId name avatar',
      })
      .sort({ createdAt: -1 });
    res.json({ success: true, bookmarks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// @desc    Add bookmark
// @route   POST /api/students/bookmarks
// ─────────────────────────────────────────────
const addBookmark = async (req, res) => {
  try {
    const { itemId, itemType } = req.body;
    if (!itemId || !itemType) {
      return res.status(400).json({ success: false, message: 'itemId and itemType are required' });
    }
    const exists = await Bookmark.findOne({ studentId: req.user._id, itemId, itemType });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Already bookmarked' });
    }
    const bookmark = await Bookmark.create({ studentId: req.user._id, itemId, itemType });
    res.status(201).json({ success: true, bookmark, message: 'Added to bookmarks' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// @desc    Remove bookmark
// @route   DELETE /api/students/bookmarks/:classId
// ─────────────────────────────────────────────
const removeBookmark = async (req, res) => {
  try {
    const result = await Bookmark.findOneAndDelete({
      studentId: req.user._id,
      itemId: req.params.classId,
    });
    if (!result) return res.status(404).json({ success: false, message: 'Bookmark not found' });
    res.json({ success: true, message: 'Removed from bookmarks' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// @desc    Get followed tutors
// @route   GET /api/students/followed-tutors
// ─────────────────────────────────────────────
const getFollowedTutors = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ userId: req.user._id })
      .populate('followedTutors', 'name email avatar isVerified');
    if (!profile) return res.json({ success: true, tutors: [] });
    res.json({ success: true, tutors: profile.followedTutors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// @desc    Get notifications
// @route   GET /api/students/notifications
// ─────────────────────────────────────────────
const getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;
    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find({ userId: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Notification.countDocuments({ userId: req.user._id }),
      Notification.countDocuments({ userId: req.user._id, isRead: false }),
    ]);
    res.json({ success: true, notifications, total, unreadCount, page: Number(page) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// @desc    Mark single notification as read
// @route   PUT /api/students/notifications/:id/read
// ─────────────────────────────────────────────
const markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { isRead: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ success: false, message: 'Notification not found' });
    res.json({ success: true, notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// @desc    Mark all notifications as read
// @route   PUT /api/students/notifications/read-all
// ─────────────────────────────────────────────
const markAllNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user._id, isRead: false }, { isRead: true });
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// @desc    Get recently viewed classes
// @route   GET /api/students/recently-viewed
// ─────────────────────────────────────────────
const getRecentlyViewed = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ userId: req.user._id }).populate({
      path: 'recentlyViewed.classId',
      select: 'title subject grade medium fee tutorId',
      populate: { path: 'tutorId', select: 'name avatar' },
    });
    if (!profile) return res.json({ success: true, recentlyViewed: [] });
    // Sort by viewedAt descending
    const sorted = [...profile.recentlyViewed].sort((a, b) => b.viewedAt - a.viewedAt);
    res.json({ success: true, recentlyViewed: sorted });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// @desc    Add to recently viewed (max 10)
// @route   POST /api/students/recently-viewed
// ─────────────────────────────────────────────
const addRecentlyViewed = async (req, res) => {
  try {
    const { classId } = req.body;
    if (!classId) return res.status(400).json({ success: false, message: 'classId is required' });

    let profile = await StudentProfile.findOne({ userId: req.user._id });
    if (!profile) {
      profile = await StudentProfile.create({ userId: req.user._id });
    }

    // Remove existing entry for this class (to re-add at top)
    profile.recentlyViewed = profile.recentlyViewed.filter(
      (rv) => rv.classId && rv.classId.toString() !== classId.toString()
    );

    // Add new entry at beginning
    profile.recentlyViewed.unshift({ classId, viewedAt: new Date() });

    // Keep only last 10
    if (profile.recentlyViewed.length > 10) {
      profile.recentlyViewed = profile.recentlyViewed.slice(0, 10);
    }

    await profile.save();
    res.json({ success: true, message: 'Added to recently viewed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getStudentProfile,
  updateStudentProfile,
  getBookmarks,
  addBookmark,
  removeBookmark,
  getFollowedTutors,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  getRecentlyViewed,
  addRecentlyViewed,
};
