const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getCourses, getMyCourses, getCourseById,
  createCourse, updateCourse, deleteCourse
} = require('../controllers/courseController');

// Protected (tutor must be logged in)
router.get('/my', protect, getMyCourses);

// Public
router.get('/', getCourses);
router.get('/:id', getCourseById);
router.post('/', protect, createCourse);
router.put('/:id', protect, updateCourse);
router.delete('/:id', protect, deleteCourse);

module.exports = router;
