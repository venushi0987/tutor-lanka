const Bookmark = require('../models/Bookmark');
const Notification = require('../models/Notification');

const getBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ studentId: req.user._id }).populate('itemId');
    res.json({ success: true, bookmarks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const toggleBookmark = async (req, res) => {
  try {
    const { itemId, itemType } = req.body;
    const exists = await Bookmark.findOne({ studentId: req.user._id, itemId, itemType });
    if (exists) {
      await exists.deleteOne();
      return res.json({ success: true, bookmarked: false, message: 'Removed from bookmarks' });
    }
    await Bookmark.create({ studentId: req.user._id, itemId, itemType });
    res.json({ success: true, bookmarked: true, message: 'Added to bookmarks' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const markNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user._id, isRead: false }, { isRead: true });
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateStudentProfile = async (req, res) => {
  try {
    const User = require('../models/User');
    const { name, phone } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (phone) updates.phone = phone;
    if (req.file) updates.avatar = req.file.path;
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getBookmarks, toggleBookmark, getNotifications, markNotificationsRead, updateStudentProfile };
