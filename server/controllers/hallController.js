const ClassHall = require('../models/ClassHall');

// ─── GET /api/halls  — public listing of all available halls ─────────────────
const getHalls = async (req, res) => {
  try {
    const { city, capacity } = req.query;
    const filter = { isAvailable: true };

    if (city) filter.address = { $regex: city, $options: 'i' };
    if (capacity) filter.capacity = { $gte: parseInt(capacity) };

    const halls = await ClassHall.find(filter)
      .populate('owner', 'name avatar phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, halls });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET /api/halls/my  — hall owner's own halls ──────────────────────────────
const getMyHalls = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Not authenticated' });
    const halls = await ClassHall.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, halls });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET /api/halls/:id  — single hall detail ────────────────────────────────
const getHallById = async (req, res) => {
  try {
    const hall = await ClassHall.findById(req.params.id)
      .populate('owner', 'name avatar phone email');
    if (!hall) return res.status(404).json({ success: false, message: 'Hall not found' });
    res.json({ success: true, hall });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── POST /api/halls  — create a hall (hall_owner only) ──────────────────────
const createHall = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Not authenticated' });
    const { name, capacity, amenities, address, lat, lng, hourlyRate, location } = req.body;

    if (!name || !capacity || !address || !hourlyRate) {
      return res.status(400).json({ success: false, message: 'Name, capacity, address, and hourlyRate are required' });
    }

    let finalLocation;
    if (location) {
      let locObj = location;
      if (typeof location === 'string') {
        try {
          locObj = JSON.parse(location);
        } catch (_) {}
      }
      if (locObj && locObj.coordinates && locObj.coordinates.length === 2) {
        finalLocation = locObj;
      }
    }
    if (!finalLocation) {
      let parsedLat = parseFloat(lat);
      let parsedLng = parseFloat(lng);
      if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
        finalLocation = { type: 'Point', coordinates: [parsedLng, parsedLat] };
      }
    }
    if (!finalLocation) {
      return res.status(400).json({ success: false, message: 'Location coordinates (lat, lng) are required' });
    }

    let parsedAmenities = amenities || [];
    if (typeof amenities === 'string') {
      try {
        parsedAmenities = JSON.parse(amenities);
      } catch (_) {
        parsedAmenities = amenities.split(',').map(s => s.trim()).filter(Boolean);
      }
    }

    const hallData = {
      owner: req.user._id,
      name,
      capacity: parseInt(capacity),
      amenities: parsedAmenities,
      address,
      location: finalLocation,
      hourlyRate: parseFloat(hourlyRate),
      isAvailable: true,
    };

    if (req.file) {
      hallData.images = [req.file.path];
    }

    const hall = await ClassHall.create(hallData);
    res.status(201).json({ success: true, hall });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── PUT /api/halls/:id  — update hall (owner only) ──────────────────────────
const updateHall = async (req, res) => {
  try {
    const hall = await ClassHall.findById(req.params.id);
    if (!hall) return res.status(404).json({ success: false, message: 'Hall not found' });
    if (hall.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const updates = { ...req.body };
    if (req.file) {
      updates.images = [req.file.path];
    }
    if (updates.capacity !== undefined) updates.capacity = parseInt(updates.capacity);
    if (updates.hourlyRate !== undefined) updates.hourlyRate = parseFloat(updates.hourlyRate);
    if (updates.amenities !== undefined && typeof updates.amenities === 'string') {
      try {
        updates.amenities = JSON.parse(updates.amenities);
      } catch (_) {
        updates.amenities = updates.amenities.split(',').map(s => s.trim()).filter(Boolean);
      }
    }
    if (updates.location && typeof updates.location === 'string') {
      try {
        updates.location = JSON.parse(updates.location);
      } catch (_) {}
    }

    const updated = await ClassHall.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    res.json({ success: true, hall: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── DELETE /api/halls/:id  — delete hall (owner or admin) ───────────────────
const deleteHall = async (req, res) => {
  try {
    const hall = await ClassHall.findById(req.params.id);
    if (!hall) return res.status(404).json({ success: false, message: 'Hall not found' });
    if (hall.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    await hall.deleteOne();
    res.json({ success: true, message: 'Hall deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getHalls, getMyHalls, getHallById, createHall, updateHall, deleteHall };
