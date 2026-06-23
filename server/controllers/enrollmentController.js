const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');

// ─── POST /api/enrollments  — enroll in a course ─────────────────────────────
const enrollInCourse = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Not authenticated' });
    const { courseId } = req.body;
    if (!courseId) return res.status(400).json({ success: false, message: 'courseId is required' });

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    if (course.status !== 'Published') return res.status(400).json({ success: false, message: 'Course is not available for enrollment' });

    const existing = await Enrollment.findOne({ student: req.user._id, course: courseId });
    if (existing) return res.status(400).json({ success: false, message: 'Already enrolled in this course' });

    const enrollment = await Enrollment.create({
      student: req.user._id,
      course: courseId,
      paymentStatus: course.isPaid ? 'Pending' : 'Free',
    });

    // Add to user's enrolledCourses list
    await User.findByIdAndUpdate(req.user._id, { $addToSet: { enrolledCourses: courseId } });

    res.status(201).json({ success: true, enrollment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET /api/enrollments/my  — student's enrolled courses ───────────────────
const getMyEnrollments = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Not authenticated' });
    const enrollments = await Enrollment.find({ student: req.user._id })
      .populate({ path: 'course', populate: { path: 'tutor', select: 'name avatar qualifications' } })
      .sort({ enrolledAt: -1 });
    res.json({ success: true, enrollments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── POST /api/students/follow/:tutorId  — follow a tutor ────────────────────
const followTutor = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Not authenticated' });
    const tutor = await User.findById(req.params.tutorId);
    if (!tutor || tutor.role !== 'tutor') return res.status(404).json({ success: false, message: 'Tutor not found' });
    if (tutor._id.toString() === req.user._id.toString()) return res.status(400).json({ success: false, message: 'Cannot follow yourself' });

    await User.findByIdAndUpdate(req.user._id, { $addToSet: { following: tutor._id } });
    res.json({ success: true, message: `Now following ${tutor.name}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── DELETE /api/students/follow/:tutorId  — unfollow a tutor ────────────────
const unfollowTutor = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Not authenticated' });
    await User.findByIdAndUpdate(req.user._id, { $pull: { following: req.params.tutorId } });
    res.json({ success: true, message: 'Unfollowed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── PUT /api/students/preferences  — save grade/age ────────────────────────
const savePreferences = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Not authenticated' });
    const { grade, dateOfBirth } = req.body;
    const updates = {};
    if (grade) updates.grade = grade;
    if (dateOfBirth) updates.dateOfBirth = dateOfBirth;
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { enrollInCourse, getMyEnrollments, followTutor, unfollowTutor, savePreferences };
