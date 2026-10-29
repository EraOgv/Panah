const Review = require('../models/Review');
const { uploadToCloudinary } = require('../config/cloudinary');

// @desc  Create a new review (proof required, auto-approved)
// @route POST /api/reviews
const createReview = async (req, res) => {
  try {
    const { relatedTo, proofType, rating, comment } = req.body;

    if (!relatedTo || !proofType || !rating || !comment) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Proof file is required to submit a review' });
    }

    const result = await uploadToCloudinary(req.file.buffer, 'reviews');

    const review = await Review.create({
      user: req.user._id,
      relatedTo,
      proofType,
      proofFileUrl: result.secure_url,
      rating,
      comment,
      status: 'approved', // proof-based trust: goes live immediately
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get all approved reviews (public)
// @route GET /api/reviews
const getApprovedReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ status: 'approved', flagged: false }).populate('user', 'name isVerifiedTraveler');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get logged-in user's own reviews
// @route GET /api/reviews/mine
const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createReview, getApprovedReviews, getMyReviews };