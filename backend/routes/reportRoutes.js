const express = require('express');
const router = express.Router();
const { createReport, getFlaggedItems, resolveFlag, removeFlaggedItem } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.post('/', protect, createReport);
router.get('/flagged', protect, admin, getFlaggedItems);
router.put('/resolve', protect, admin, resolveFlag);
router.put('/remove', protect, admin, removeFlaggedItem);

module.exports = router;