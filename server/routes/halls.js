const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getHalls, getMyHalls, getHallById,
  createHall, updateHall, deleteHall
} = require('../controllers/hallController');

// Public
router.get('/', getHalls);
router.get('/my', protect, getMyHalls);
router.get('/:id', getHallById);

const upload = require('../middleware/upload');

// Protected (hall_owner)
router.post('/', protect, upload.single('image'), createHall);
router.put('/:id', protect, upload.single('image'), updateHall);
router.delete('/:id', protect, deleteHall);

module.exports = router;
