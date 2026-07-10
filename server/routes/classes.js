const express = require('express');
const router = express.Router();
const { getClasses, getClassById, createClass, updateClass, deleteClass, getMyClasses } = require('../controllers/classController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getClasses);
router.get('/my', protect, authorize('tutor','institute'), getMyClasses);
router.get('/:id', getClassById);
router.post('/', protect, authorize('tutor','institute'), upload.single('banner'), createClass);
router.put('/:id', protect, upload.single('banner'), updateClass);
router.delete('/:id', protect, deleteClass);

module.exports = router;
