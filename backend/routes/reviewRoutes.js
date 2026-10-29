const express = require('express');
const router = express.Router();
const { createReview, getApprovedReviews, getMyReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/', protect, upload.single('proofFile'), createReview);
router.get('/', getApprovedReviews);
router.get('/mine', protect, getMyReviews);

module.exports = router;