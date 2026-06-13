const Class = require('../models/Class');
const TutorProfile = require('../models/TutorProfile');
const slugify = require('slugify');
const { sendNotification } = require('../config/socket');

// @desc    Get all classes with filters
// @route   GET /api/classes
const getClasses = async (req, res) => {
  try {
    const { subject, district, city, language, method, grade, examType, search, minFee, maxFee, page = 1, limit = 12 } = req.query;
    const filter = { isActive: true };
    if (subject) filter.subject = { $regex: subject, $options: 'i' };
    if (district) filter['location.district'] = district;
    if (city) filter['location.city'] = { $regex: city, $options: 'i' };
    if (language) filter.language = language;
    if (method) filter.teachingMethod = method;
    if (grade) filter.grade = grade;
    if (examType && examType !== 'None') filter.examType = examType;
    if (minFee || maxFee) {
      filter.fee = {};
      if (minFee) filter.fee.$gte = Number(minFee);
      if (maxFee) filter.fee.$lte = Number(maxFee);
    }
    if (search) filter.$text = { $search: search };

    const skip = (page - 1) * limit;
    const [classes, total] = await Promise.all([
      Class.find(filter)
        .populate('tutorId', 'name avatar')
        .sort({ isFeatured: -1, createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Class.countDocuments(filter),
    ]);
    res.json({ success: true, classes, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single class
// @route   GET /api/classes/:id
const getClassById = async (req, res) => {
  try {
    const { id } = req.params;
    const filter = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { slug: id };
    const cls = await Class.findOne(filter).populate('tutorId', 'name avatar email phone');
    if (!cls) return res.status(404).json({ success: false, message: 'Class not found' });
    cls.views += 1;
    await cls.save({ validateBeforeSave: false });
    const tutorProfile = await TutorProfile.findOne({ userId: cls.tutorId._id });
    res.json({ success: true, class: cls, tutorProfile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create class
// @route   POST /api/classes
const createClass = async (req, res) => {
  try {
    const { title, subject, grade, examType, language, fee, feeType, description, teachingMethod, schedule, location, maxStudents, tags } = req.body;
    const slug = slugify(title, { lower: true, strict: true }) + '-' + Date.now().toString().slice(-4);

    const cls = await Class.create({
      tutorId: req.user._id,
      title, subject, grade, examType, language,
      fee: Number(fee), feeType, description,
      bannerImage: req.file ? req.file.path : '',
      teachingMethod, schedule, location, maxStudents, tags, slug,
    });

    // Notify followers
    const profile = await TutorProfile.findOne({ userId: req.user._id });
    if (profile && profile.followers.length > 0) {
      profile.followers.forEach(followerId => {
        sendNotification(followerId, 'new_class', `${req.user.name} added a new class: ${title}`, cls._id);
      });
    }

    res.status(201).json({ success: true, class: cls });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update class
// @route   PUT /api/classes/:id
const updateClass = async (req, res) => {
  try {
    const cls = await Class.findById(req.params.id);
    if (!cls) return res.status(404).json({ success: false, message: 'Class not found' });
    if (cls.tutorId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    const updates = { ...req.body };
    if (req.file) updates.bannerImage = req.file.path;
    const updated = await Class.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    res.json({ success: true, class: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete class
// @route   DELETE /api/classes/:id
const deleteClass = async (req, res) => {
  try {
    const cls = await Class.findById(req.params.id);
    if (!cls) return res.status(404).json({ success: false, message: 'Class not found' });
    if (cls.tutorId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    await cls.deleteOne();
    res.json({ success: true, message: 'Class deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get tutor's own classes
// @route   GET /api/classes/my
const getMyClasses = async (req, res) => {
  try {
    const classes = await Class.find({ tutorId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, classes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getClasses, getClassById, createClass, updateClass, deleteClass, getMyClasses };
