const express = require('express');
const router = express.Router();
const { getUsers, toggleUserActive, verifyTutor, getAnalytics, getPendingVerifications, getReports, handleReport, createReport } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.get('/users', authorize('admin'), getUsers);
router.put('/users/:id/toggle', authorize('admin'), toggleUserActive);
router.put('/tutors/:id/verify', authorize('admin'), verifyTutor);
router.get('/analytics', authorize('admin'), getAnalytics);
router.get('/verifications', authorize('admin'), getPendingVerifications);
router.get('/reports', authorize('admin'), getReports);
router.put('/reports/:id', authorize('admin'), handleReport);
router.post('/reports', protect, createReport);

module.exports = router;
