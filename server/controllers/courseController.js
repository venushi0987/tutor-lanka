const Course = require('../models/Course');
const User = require('../models/User');

// ─── GET /api/courses  — public, with optional search/grade/type filters ───────
const getCourses = async (req, res) => {
  try {
    const { search, grade, type } = req.query;
    const filter = { status: 'Published' };

    if (grade) filter.gradeLevel = { $regex: grade, $options: 'i' };
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    if (type) filter.type = type;

    const courses = await Course.find(filter)
      .populate('tutor', 'name avatar qualifications isVerified address phone bio')
      .sort({ createdAt: -1 });

    res.json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET /api/courses/my  — tutor's own courses ─────────────────────────────
const getMyCourses = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Not authenticated' });
    const courses = await Course.find({ tutor: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET /api/courses/:id  — single course detail ───────────────────────────
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('tutor', 'name avatar qualifications bio phone isVerified');
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── POST /api/courses  — create course (tutor only) ────────────────────────
const createCourse = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Not authenticated' });
    const { title, description, subject, gradeLevel, isPaid, price, type } = req.body;

    if (!title || !subject || !gradeLevel) {
      return res.status(400).json({ success: false, message: 'Title, subject, and gradeLevel are required' });
    }

    const course = await Course.create({
      tutor: req.user._id,
      title,
      description,
      subject,
      gradeLevel,
      isPaid: isPaid || false,
      price: isPaid ? price || 0 : 0,
      type: type || 'Physical',
      status: 'Published',
    });

    res.status(201).json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── PUT /api/courses/:id  — update course (owner only) ─────────────────────
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    if (course.tutor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    const updated = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, course: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── DELETE /api/courses/:id  — delete course (owner only) ──────────────────
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    if (course.tutor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    await course.deleteOne();
    res.json({ success: true, message: 'Course deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getCourses, getMyCourses, getCourseById, createCourse, updateCourse, deleteCourse };
