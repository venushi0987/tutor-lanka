const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  enrollInCourse, getMyEnrollments,
  followTutor, unfollowTutor, savePreferences
} = require('../controllers/enrollmentController');

// Enrollment
router.post('/', protect, enrollInCourse);
router.get('/my', protect, getMyEnrollments);

// Follow/Unfollow tutor
router.post('/follow/:tutorId', protect, followTutor);
router.delete('/follow/:tutorId', protect, unfollowTutor);

// Student preferences (grade + age)
router.put('/preferences', protect, savePreferences);

module.exports = router;
