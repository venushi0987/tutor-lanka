const InstituteProfile = require('../models/InstituteProfile');
const User = require('../models/User');
const slugify = require('slugify');

// Create or update institute profile
const createOrUpdateProfile = async (req, res) => {
  try {
    let { name, bio, contact, locations } = req.body;
    // contact and locations might arrive as JSON strings when using multipart/form-data
    if (contact && typeof contact === 'string') {
      try { contact = JSON.parse(contact); } catch (_) { contact = {}; }
    }
    if (locations && typeof locations === 'string') {
      try { locations = JSON.parse(locations); } catch (_) { locations = []; }
    }

    let profile = await InstituteProfile.findOne({ userId: req.user._id });
    if (!profile) {
      const slug = slugify(name || req.user.name, { lower: true, strict: true }) + '-' + req.user._id.toString().slice(-4);
      profile = await InstituteProfile.create({ userId: req.user._id, name: name || req.user.name, bio: bio || '', contact: contact || {}, locations: locations || [], slug, logo: req.file ? req.file.path : '' });
    } else {
      profile.name = name || profile.name;
      if (bio !== undefined) profile.bio = bio;
      if (contact !== undefined) profile.contact = contact;
      if (locations !== undefined && Array.isArray(locations)) profile.locations = locations;
      if (req.file) profile.logo = req.file.path;
      await profile.save();
    }
    res.json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get institute profile by id or slug
const getProfile = async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    let filter = {};
    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) filter = { userId: idOrSlug };
    else filter = { slug: idOrSlug };
    const profile = await InstituteProfile.findOne(filter).lean();
    if (!profile) return res.status(404).json({ success: false, message: 'Institute not found' });
    res.json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add a location (expects name, district, city, address, coordinates: [lng, lat])
const addLocation = async (req, res) => {
  try {
    const { name, district, city, address, coordinates } = req.body;
    if (!coordinates || !Array.isArray(coordinates) || coordinates.length !== 2) {
      return res.status(400).json({ success: false, message: 'coordinates must be [lng, lat]' });
    }
    const profile = await InstituteProfile.findOne({ userId: req.user._id });
    if (!profile) return res.status(404).json({ success: false, message: 'Institute profile not found' });
    profile.locations.push({ name, district, city, address, coordinates: { type: 'Point', coordinates } });
    await profile.save();
    res.status(201).json({ success: true, locations: profile.locations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Remove location by index or id
const removeLocation = async (req, res) => {
  try {
    const { index } = req.params;
    const profile = await InstituteProfile.findOne({ userId: req.user._id });
    if (!profile) return res.status(404).json({ success: false, message: 'Institute profile not found' });
    const idx = Number(index);
    if (isNaN(idx) || idx < 0 || idx >= profile.locations.length) return res.status(400).json({ success: false, message: 'Invalid index' });
    profile.locations.splice(idx, 1);
    await profile.save();
    res.json({ success: true, locations: profile.locations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all institutes (for map display)
const getAllInstitutes = async (req, res) => {
  try {
    const institutes = await InstituteProfile.find({})
      .select('name logo slug contact locations rating totalReviews isVerified')
      .lean();
    res.json({ success: true, institutes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Search nearby institutes by coordinates and radius (km)
const findNearby = async (req, res) => {
  try {
    const { lng, lat, radius = 5 } = req.query; // radius in km
    if (!lng || !lat) return res.status(400).json({ success: false, message: 'lng and lat required' });
    const meters = Number(radius) * 1000;
    const institutes = await InstituteProfile.aggregate([
      { $unwind: '$locations' },
      {
        $geoNear: {
          near: { type: 'Point', coordinates: [Number(lng), Number(lat)] },
          distanceField: 'dist.calculated',
          maxDistance: meters,
          spherical: true,
          key: 'locations.coordinates',
        },
      },
      { $group: { _id: '$_id', doc: { $first: '$$ROOT' }, locations: { $push: '$locations' }, dist: { $min: '$dist.calculated' } } },
      { $replaceWith: { $mergeObjects: ['$$doc', { distanceMeters: '$dist' }] } },
      { $limit: 100 },
    ]);
    res.json({ success: true, institutes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get classes for an institute by id or slug
const getInstituteClasses = async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    let profile = null;
    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) profile = await InstituteProfile.findOne({ userId: idOrSlug });
    else profile = await InstituteProfile.findOne({ slug: idOrSlug });
    if (!profile) return res.status(404).json({ success: false, message: 'Institute not found' });
    const classes = await require('../models/Class').find({ instituteId: profile.userId, isActive: true }).sort({ createdAt: -1 });
    res.json({ success: true, classes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get analytics for current institute (protected)
const getAnalytics = async (req, res) => {
  try {
    const instituteId = req.user._id;
    const classes = await require('../models/Class').find({ instituteId });
    const totalClasses = classes.length;
    const totalEnrollments = classes.reduce((s, c) => s + (c.enrollCount || 0), 0);
    const profile = await InstituteProfile.findOne({ userId: instituteId });
    const totalHalls = profile ? (profile.locations?.length || 0) : 0;
    const followers = profile ? (profile.followers?.length || 0) : 0;
    res.json({ success: true, analytics: { totalClasses, totalHalls, followers, totalEnrollments } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createOrUpdateProfile, getProfile, addLocation, removeLocation, findNearby, getInstituteClasses, getAnalytics, getAllInstitutes };