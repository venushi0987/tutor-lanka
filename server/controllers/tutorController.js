const TutorProfile = require('../models/TutorProfile');
const Class = require('../models/Class');
const User = require('../models/User');
const slugify = require('slugify');

// @desc    Get all tutors with filters
// @route   GET /api/tutors
const getTutors = async (req, res) => {
  try {
    const { subject, district, language, verified, search, page = 1, limit = 12 } = req.query;
    const filter = {};
    if (subject) filter.subjects = { $in: [subject] };
    if (district) filter['location.district'] = district;
    if (language) filter.languages = { $in: [language] };
    if (verified === 'true') filter.verificationStatus = 'verified';

    const skip = (page - 1) * limit;
    let query = TutorProfile.find(filter)
      .populate('userId', 'name avatar email phone isVerified')
      .sort({ isFeatured: -1, rating: -1, totalStudents: -1 })
      .skip(skip)
      .limit(Number(limit));

    const [tutors, total] = await Promise.all([query, TutorProfile.countDocuments(filter)]);
    res.json({ success: true, tutors, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get tutor by slug or id
// @route   GET /api/tutors/:id
const getTutorById = async (req, res) => {
  try {
    const { id } = req.params;
    const filter = id.match(/^[0-9a-fA-F]{24}$/) ? { userId: id } : { slug: id };
    const tutor = await TutorProfile.findOne(filter).populate('userId', 'name avatar email phone createdAt');
    if (!tutor) return res.status(404).json({ success: false, message: 'Tutor not found' });
    tutor.profileViews += 1;
    await tutor.save({ validateBeforeSave: false });
    const classes = await Class.find({ tutorId: tutor.userId, isActive: true }).sort({ createdAt: -1 });
    res.json({ success: true, tutor, classes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update tutor profile
// @route   PUT /api/tutors/profile
const updateTutorProfile = async (req, res) => {
  try {
    const {
      bio, qualifications, experience, subjects, languages,
      whatsapp, socialLinks, location, phone, name, gender, address, locationCoords
    } = req.body;

    let profile = await TutorProfile.findOne({ userId: req.user._id });
    if (!profile) {
      const slug = slugify(req.user.name, { lower: true, strict: true }) + '-' + req.user._id.toString().slice(-4);
      profile = await TutorProfile.create({ userId: req.user._id, slug });
    }

    // Update User model fields
    const userUpdate = {};
    if (name !== undefined) userUpdate.name = name;
    if (gender !== undefined) userUpdate.gender = gender;
    if (address !== undefined) userUpdate.address = address;
    if (locationCoords !== undefined) userUpdate.locationCoords = locationCoords;
    if (phone !== undefined) userUpdate.phone = phone;

    if (Object.keys(userUpdate).length > 0) {
      await User.findByIdAndUpdate(req.user._id, userUpdate, { new: true });
    }

    // Update TutorProfile fields
    if (bio !== undefined) profile.bio = bio;
    if (qualifications !== undefined) profile.qualifications = qualifications;
    if (experience !== undefined) profile.experience = experience;
    if (subjects !== undefined) profile.subjects = subjects;
    if (languages !== undefined) profile.languages = languages;
    if (whatsapp !== undefined) profile.whatsapp = whatsapp;
    if (socialLinks !== undefined) profile.socialLinks = { ...profile.socialLinks, ...socialLinks };
    if (location !== undefined) profile.location = { ...profile.location, ...location };

    if (req.file) {
      await User.findByIdAndUpdate(req.user._id, { avatar: req.file.path });
    }

    await profile.save();
    res.json({ success: true, message: 'Profile updated', profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Upload verification docs
// @route   POST /api/tutors/verify
const uploadVerificationDocs = async (req, res) => {
  try {
    const { docType } = req.body;
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const profile = await TutorProfile.findOne({ userId: req.user._id });
    if (!profile) return res.status(404).json({ success: false, message: 'Tutor profile not found' });
    profile.verificationDocs.push({ docType, url: req.file.path });
    profile.verificationStatus = 'pending';
    await profile.save();
    res.json({ success: true, message: 'Document uploaded, awaiting verification', profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Follow / unfollow tutor
// @route   POST /api/tutors/:id/follow
const followTutor = async (req, res) => {
  try {
    const profile = await TutorProfile.findOne({ userId: req.params.id });
    if (!profile) return res.status(404).json({ success: false, message: 'Tutor not found' });
    const idx = profile.followers.indexOf(req.user._id);
    if (idx === -1) {
      profile.followers.push(req.user._id);
    } else {
      profile.followers.splice(idx, 1);
    }
    await profile.save();
    res.json({ success: true, followers: profile.followers.length, following: idx === -1 });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get tutor analytics
// @route   GET /api/tutors/analytics
const getTutorAnalytics = async (req, res) => {
  try {
    const profile = await TutorProfile.findOne({ userId: req.user._id });
    if (!profile) return res.status(404).json({ success: false, message: 'Tutor profile not found' });
    const classes = await Class.find({ tutorId: req.user._id });
    const totalViews = classes.reduce((acc, c) => acc + c.views, 0);
    const totalEnrolls = classes.reduce((acc, c) => acc + c.enrollCount, 0);
    res.json({
      success: true,
      analytics: {
        profileViews: profile.profileViews,
        contactClicks: profile.contactClicks,
        enrollRequests: profile.enrollRequests,
        followers: profile.followers.length,
        totalClasses: classes.length,
        totalClassViews: totalViews,
        totalEnrolls,
        rating: profile.rating,
        totalReviews: profile.totalReviews,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getTutors, getTutorById, updateTutorProfile, uploadVerificationDocs, followTutor, getTutorAnalytics };
