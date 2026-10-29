const express = require('express');
const router = express.Router();
const { createComplaint, getApprovedComplaints, getMyComplaints } = require('../controllers/complaintController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/', protect, upload.single('photo'), createComplaint);
router.get('/', getApprovedComplaints);
router.get('/mine', protect, getMyComplaints);

module.exports = router;