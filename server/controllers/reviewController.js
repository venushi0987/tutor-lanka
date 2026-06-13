const Review = require('../models/Review');
const Class = require('../models/Class');
const TutorProfile = require('../models/TutorProfile');

const recalcRating = async (classId, tutorId) => {
  const reviews = await Review.find({ classId });
  const avg = reviews.length ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length : 0;
  await Class.findByIdAndUpdate(classId, { rating: avg.toFixed(1), totalReviews: reviews.length });
  const allTutorReviews = await Review.find({ tutorId });
  const tutorAvg = allTutorReviews.length ? allTutorReviews.reduce((a, r) => a + r.rating, 0) / allTutorReviews.length : 0;
  await TutorProfile.findOneAndUpdate({ userId: tutorId }, { rating: tutorAvg.toFixed(1), totalReviews: allTutorReviews.length });
};

const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ classId: req.params.classId })
      .populate('studentId', 'name avatar')
      .sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createReview = async (req, res) => {
  try {
    const { classId, rating, comment } = req.body;
    const cls = await Class.findById(classId);
    if (!cls) return res.status(404).json({ success: false, message: 'Class not found' });
    const exists = await Review.findOne({ classId, studentId: req.user._id });
    if (exists) return res.status(400).json({ success: false, message: 'You have already reviewed this class' });
    const review = await Review.create({ classId, tutorId: cls.tutorId, studentId: req.user._id, rating, comment });
    await recalcRating(classId, cls.tutorId);
    await review.populate('studentId', 'name avatar');
    res.status(201).json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    if (review.studentId.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Not authorized' });
    review.rating = req.body.rating || review.rating;
    review.comment = req.body.comment || review.comment;
    review.isEdited = true;
    await review.save();
    await recalcRating(review.classId, review.tutorId);
    res.json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    if (review.studentId.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Not authorized' });
    await review.deleteOne();
    await recalcRating(review.classId, review.tutorId);
    res.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getReviews, createReview, updateReview, deleteReview };
