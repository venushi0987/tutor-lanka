const express = require('express');
const router = express.Router();
const { getBookmarks, addBookmark, getNotifications, markAllNotificationsRead, updateStudentProfile } = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/bookmarks', protect, getBookmarks);
router.post('/bookmarks', protect, addBookmark);
router.get('/notifications', protect, getNotifications);
router.put('/notifications/read', protect, markAllNotificationsRead);
router.put('/profile', protect, upload.single('avatar'), updateStudentProfile);

module.exports = router;
