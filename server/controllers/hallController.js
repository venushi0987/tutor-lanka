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
    console.log('=== Hall Creation Request ===');
    console.log('User:', req.user?._id, req.user?.role);
    console.log('Body:', req.body);
    console.log('File:', req.file?.filename || 'No file');

    if (!req.user) {
      console.error('No authenticated user');
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    
    const { name, capacity, amenities, address, lat, lng, hourlyRate, location } = req.body;
    console.log('Parsed fields:', { name, capacity, address, hourlyRate, location });

    // Validate required fields
    if (!name?.trim()) {
      console.error('Missing name');
      return res.status(400).json({ success: false, message: 'Hall name is required' });
    }
    if (!address?.trim()) {
      console.error('Missing address');
      return res.status(400).json({ success: false, message: 'Address is required' });
    }
    if (!capacity) {
      console.error('Missing capacity');
      return res.status(400).json({ success: false, message: 'Capacity is required' });
    }
    if (hourlyRate === undefined || hourlyRate === null || hourlyRate === '') {
      console.error('Missing hourlyRate:', hourlyRate);
      return res.status(400).json({ success: false, message: 'Hourly rate is required' });
    }

    // Parse and validate location
    let finalLocation = null;
    if (location) {
      try {
        const locObj = typeof location === 'string' ? JSON.parse(location) : location;
        console.log('Parsed location:', locObj);
        if (locObj.coordinates && Array.isArray(locObj.coordinates) && locObj.coordinates.length === 2) {
          const [lng, lat] = locObj.coordinates;
          if (!isNaN(lng) && !isNaN(lat)) {
            finalLocation = { type: 'Point', coordinates: [Number(lng), Number(lat)] };
          }
        }
      } catch (e) {
        console.error('Location parse error:', e.message);
      }
    }

    // Fallback to lat/lng parameters
    if (!finalLocation && lat && lng) {
      const parsedLat = parseFloat(lat);
      const parsedLng = parseFloat(lng);
      if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
        finalLocation = { type: 'Point', coordinates: [parsedLng, parsedLat] };
      }
    }

    // Default to Colombo if no location provided
    if (!finalLocation) {
      console.log('Using default Colombo coordinates');
      finalLocation = { type: 'Point', coordinates: [79.8612, 6.9271] };
    }
    console.log('Final location:', finalLocation);

    // Parse amenities
    let parsedAmenities = [];
    if (amenities) {
      if (typeof amenities === 'string') {
        try {
          parsedAmenities = JSON.parse(amenities);
        } catch (_) {
          parsedAmenities = amenities.split(',').map(s => s.trim()).filter(Boolean);
        }
      } else if (Array.isArray(amenities)) {
        parsedAmenities = amenities;
      }
    }
    console.log('Parsed amenities:', parsedAmenities);

    const hallData = {
      owner: req.user._id,
      name: name.trim(),
      capacity: parseInt(capacity),
      amenities: parsedAmenities,
      address: address.trim(),
      location: finalLocation,
      hourlyRate: parseFloat(hourlyRate),
      isAvailable: true,
    };

    // Ensure location coordinates are valid numbers
    if (hallData.location && hallData.location.coordinates) {
      hallData.location.coordinates = hallData.location.coordinates.map(coord => {
        const num = parseFloat(coord);
        if (isNaN(num)) throw new Error('Invalid location coordinates');
        return num;
      });
    }

    if (req.file) {
      console.log('File uploaded:', req.file.path);
      hallData.images = [req.file.path];
    }

    console.log('Final hallData:', JSON.stringify(hallData, null, 2));
    const hall = await ClassHall.create(hallData);
    console.log('Hall created successfully:', hall._id);
    res.status(201).json({ success: true, hall });
  } catch (error) {
    console.error('=== Hall Creation Error ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Error details:', error);
    
    // Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    
    res.status(500).json({ success: false, message: error.message || 'Failed to create hall' });
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
