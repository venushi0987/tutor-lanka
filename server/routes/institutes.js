const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { createOrUpdateProfile, getProfile, addLocation, removeLocation, findNearby, getInstituteClasses, getAnalytics } = require('../controllers/instituteController');
const upload = require('../middleware/upload');

router.post('/profile', protect, authorize('institute'), upload.single('logo'), createOrUpdateProfile);
router.get('/:idOrSlug', getProfile);
router.get('/:idOrSlug/classes', getInstituteClasses);
router.post('/locations', protect, authorize('institute'), addLocation);
router.delete('/locations/:index', protect, authorize('institute'), removeLocation);
router.get('/nearby', findNearby);
router.get('/analytics/me', protect, authorize('institute'), getAnalytics);

module.exports = router;