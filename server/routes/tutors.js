const express = require('express');
const router = express.Router();
const { getTutors, getTutorById, updateTutorProfile, uploadVerificationDocs, followTutor, getTutorAnalytics } = require('../controllers/tutorController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getTutors);
router.get('/analytics', protect, authorize('tutor'), getTutorAnalytics);
router.get('/:id', getTutorById);
router.put('/profile', protect, authorize('tutor'), upload.single('avatar'), updateTutorProfile);
router.post('/verify', protect, authorize('tutor'), upload.single('document'), uploadVerificationDocs);
router.post('/:id/follow', protect, authorize('student'), followTutor);

module.exports = router;
