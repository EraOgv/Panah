const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllComplaints,
  updateComplaintStatus,
  getAllUsers,
  toggleSuspendUser,
  toggleVerifiedTraveler,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.get('/stats', protect, admin, getDashboardStats);
router.get('/complaints', protect, admin, getAllComplaints);
router.put('/complaints/:id', protect, admin, updateComplaintStatus);
router.get('/users', protect, admin, getAllUsers);
router.put('/users/:id/suspend', protect, admin, toggleSuspendUser);
router.put('/users/:id/verify', protect, admin, toggleVerifiedTraveler);

module.exports = router;