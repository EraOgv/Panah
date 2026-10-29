const Complaint = require('../models/Complaint');
const { uploadToCloudinary } = require('../config/cloudinary');

// @desc  Create a new complaint
// @route POST /api/complaints
const createComplaint = async (req, res) => {
  try {
    const { scamCategory, city, locationText, description, dateOfIncident } = req.body;

    if (!scamCategory || !city || !locationText || !description || !dateOfIncident) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    let photoUrl = '';
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'complaints');
      photoUrl = result.secure_url;
    }

    // Trust-based auto-approval: verified travelers or high-trust users skip the queue
    const isTrusted = req.user.isVerifiedTraveler || req.user.trustScore >= 5;
    const initialStatus = isTrusted ? 'approved' : 'pending';

    const complaint = await Complaint.create({
      user: req.user._id,
      scamCategory,
      city,
      locationText,
      description,
      dateOfIncident,
      photoUrl,
      status: initialStatus,
    });

    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get all approved complaints (public)
// @route GET /api/complaints
const getApprovedComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ status: 'approved' }).populate('user', 'name isVerifiedTraveler');
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get logged-in user's own complaints
// @route GET /api/complaints/mine
const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createComplaint, getApprovedComplaints, getMyComplaints };