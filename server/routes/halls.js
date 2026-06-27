const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getHalls, getMyHalls, getHallById,
  createHall, updateHall, deleteHall
} = require('../controllers/hallController');
const upload = require('../middleware/upload');

// Public
router.get('/', getHalls);
router.get('/my', protect, getMyHalls);
router.get('/:id', getHallById);

// Protected (hall_owner)
router.post('/', protect, (req, res, next) => {
  console.log('POST /halls route - before upload middleware');
  console.log('User:', req.user?._id);
  console.log('Body:', req.body);
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('Upload middleware error:', err.message);
      return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
    }
    console.log('Upload middleware passed, file:', req.file?.filename || 'No file');
    next();
  });
}, createHall);

router.put('/:id', protect, (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('Upload middleware error:', err.message);
      return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
    }
    next();
  });
}, updateHall);

router.delete('/:id', protect, deleteHall);

module.exports = router;
