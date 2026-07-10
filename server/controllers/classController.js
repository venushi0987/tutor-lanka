const Class = require('../models/Class');
const TutorProfile = require('../models/TutorProfile');
const InstituteProfile = require('../models/InstituteProfile');
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
        .populate('instituteId', 'name logo')
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
    const cls = await Class.findOne(filter)
      .populate('tutorId', 'name avatar email phone')
      .populate('instituteId', 'name logo contact');
    if (!cls) return res.status(404).json({ success: false, message: 'Class not found' });
    cls.views += 1;
    await cls.save({ validateBeforeSave: false });

    let profile = null;
    if (cls.tutorId) profile = await TutorProfile.findOne({ userId: cls.tutorId._id });
    if (cls.instituteId && !profile) profile = await InstituteProfile.findOne({ userId: cls.instituteId._id });

    res.json({ success: true, class: cls, profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create class
// @route   POST /api/classes
const createClass = async (req, res) => {
  try {
    let { title, subject, grade, examType, language, fee, feeType, description, teachingMethod, schedule, location, maxStudents, tags } = req.body;
    // parse location/schedule/tags if sent as JSON strings (multipart/form-data)
    if (location && typeof location === 'string') {
      try { location = JSON.parse(location); } catch (_) { location = location; }
    }
    if (schedule && typeof schedule === 'string') {
      try { schedule = JSON.parse(schedule); } catch (_) { schedule = schedule; }
    }
    if (tags && typeof tags === 'string') {
      try { tags = JSON.parse(tags); } catch (_) { tags = (tags ? tags.split(',') : []); }
    }

    const slug = slugify(title, { lower: true, strict: true }) + '-' + Date.now().toString().slice(-4);

    const createPayload = {
      title, subject, grade, examType, language,
      fee: Number(fee), feeType, description,
      bannerImage: req.file ? req.file.path : '',
      teachingMethod, schedule, location, maxStudents, tags, slug,
    };

    // set owner depending on role
    if (req.user.role === 'institute') {
      createPayload.instituteId = req.user._id;
    } else {
      createPayload.tutorId = req.user._id;
    }

    const cls = await Class.create(createPayload);

    // Notify followers from the appropriate profile
    let profile = null;
    if (createPayload.tutorId) profile = await TutorProfile.findOne({ userId: createPayload.tutorId });
    if (createPayload.instituteId) profile = await InstituteProfile.findOne({ userId: createPayload.instituteId });

    if (profile && profile.followers && profile.followers.length > 0) {
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

    const ownerId = (cls.tutorId) ? cls.tutorId.toString() : (cls.instituteId ? cls.instituteId.toString() : null);
    if (ownerId !== req.user._id.toString() && req.user.role !== 'admin') {
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

    const ownerId = (cls.tutorId) ? cls.tutorId.toString() : (cls.instituteId ? cls.instituteId.toString() : null);
    if (ownerId !== req.user._id.toString() && req.user.role !== 'admin') {
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
    let filter = {};
    if (req.user.role === 'institute') filter = { instituteId: req.user._id };
    else filter = { tutorId: req.user._id };
    const classes = await Class.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, classes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getClasses, getClassById, createClass, updateClass, deleteClass, getMyClasses };
