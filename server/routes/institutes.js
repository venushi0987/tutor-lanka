const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { createOrUpdateProfile, getProfile, addLocation, removeLocation, findNearby, getInstituteClasses, getAnalytics, getAllInstitutes } = require('../controllers/instituteController');
const upload = require('../middleware/upload');

router.get('/', getAllInstitutes);
router.get('/nearby', findNearby);
router.get('/analytics/me', protect, authorize('institute'), getAnalytics);
router.post('/profile', protect, authorize('institute'), upload.single('logo'), createOrUpdateProfile);
router.post('/locations', protect, authorize('institute'), addLocation);
router.delete('/locations/:index', protect, authorize('institute'), removeLocation);
router.get('/:idOrSlug', getProfile);
router.get('/:idOrSlug/classes', getInstituteClasses);

module.exports = router;