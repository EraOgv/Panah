const express = require('express');
const router = express.Router();
const { getHotspots, createHotspot } = require('../controllers/hotspotController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.get('/', getHotspots);
router.post('/', protect, admin, createHotspot);

module.exports = router;