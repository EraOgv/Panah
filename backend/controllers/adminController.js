const User = require('../models/User');
const Complaint = require('../models/Complaint');
const Review = require('../models/Review');

// @desc  Get dashboard overview stats
// @route GET /api/admin/stats
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalComplaints = await Complaint.countDocuments();
    const pendingComplaints = await Complaint.countDocuments({ status: 'pending' });
    const approvedComplaints = await Complaint.countDocuments({ status: 'approved' });
    const rejectedComplaints = await Complaint.countDocuments({ status: 'rejected' });
    const verifiedTravelers = await User.countDocuments({ isVerifiedTraveler: true });
    const totalReviews = await Review.countDocuments();

    res.json({
      totalUsers,
      totalComplaints,
      pendingComplaints,
      approvedComplaints,
      rejectedComplaints,
      verifiedTravelers,
      totalReviews,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get all complaints (any status) for admin review
// @route GET /api/admin/complaints
const getAllComplaints = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const complaints = await Complaint.find(filter)
      .populate('user', 'name email isVerifiedTraveler trustScore')
      .sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Approve, reject, or request more info on a complaint
// @route PUT /api/admin/complaints/:id
const updateComplaintStatus = async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    complaint.status = status || complaint.status;
    complaint.adminNote = adminNote !== undefined ? adminNote : complaint.adminNote;
    await complaint.save();

    // If approved, nudge the user's trust score up slightly
    if (status === 'approved') {
      await User.findByIdAndUpdate(complaint.user, { $inc: { trustScore: 1 } });
    }

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get all users
// @route GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Suspend or unsuspend a user
// @route PUT /api/admin/users/:id/suspend
const toggleSuspendUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.suspended = !user.suspended;
    await user.save();

    res.json({ message: `User ${user.suspended ? 'suspended' : 'unsuspended'}`, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Grant or revoke Verified Traveler badge
// @route PUT /api/admin/users/:id/verify
const toggleVerifiedTraveler = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isVerifiedTraveler = !user.isVerifiedTraveler;
    await user.save();

    res.json({ message: `Verified traveler status: ${user.isVerifiedTraveler}`, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getAllComplaints,
  updateComplaintStatus,
  getAllUsers,
  toggleSuspendUser,
  toggleVerifiedTraveler,
};