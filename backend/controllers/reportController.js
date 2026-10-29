const Report = require('../models/Report');
const Complaint = require('../models/Complaint');
const Review = require('../models/Review');

const FLAG_THRESHOLD = 3;

const getModel = (targetType) => (targetType === 'review' ? Review : Complaint);

// @desc  Submit a report against a review or complaint
// @route POST /api/reports
const createReport = async (req, res) => {
  try {
    const { targetType, targetId, reason, note } = req.body;

    if (!targetType || !targetId || !reason) {
      return res.status(400).json({ message: 'Please provide targetType, targetId, and reason' });
    }

    const Model = getModel(targetType);
    const target = await Model.findById(targetId);
    if (!target) return res.status(404).json({ message: 'Target not found' });

    const report = await Report.create({
      reporter: req.user._id,
      targetType,
      targetId,
      reason,
      note,
    });

    target.flagCount = (target.flagCount || 0) + 1;
    if (target.flagCount >= FLAG_THRESHOLD) {
      target.flagged = true;
    }
    await target.save();

    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get all flagged items (for admin queue)
// @route GET /api/reports/flagged
const getFlaggedItems = async (req, res) => {
  try {
    const flaggedComplaints = await Complaint.find({ flagged: true }).populate('user', 'name email');
    const flaggedReviews = await Review.find({ flagged: true }).populate('user', 'name email');

    res.json({ complaints: flaggedComplaints, reviews: flaggedReviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Resolve a flagged item (clear the flag, item stays as-is)
// @route PUT /api/reports/resolve
const resolveFlag = async (req, res) => {
  try {
    const { targetType, targetId } = req.body;
    const Model = getModel(targetType);
    const target = await Model.findById(targetId);
    if (!target) return res.status(404).json({ message: 'Target not found' });

    target.flagged = false;
    target.flagCount = 0;
    await target.save();

    await Report.updateMany({ targetType, targetId }, { resolved: true });

    res.json({ message: 'Flag resolved', target });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Remove a flagged item entirely (reject it)
// @route PUT /api/reports/remove
const removeFlaggedItem = async (req, res) => {
  try {
    const { targetType, targetId } = req.body;
    const Model = getModel(targetType);
    const target = await Model.findById(targetId);
    if (!target) return res.status(404).json({ message: 'Target not found' });

    target.status = 'rejected';
    target.flagged = false;
    await target.save();

    await Report.updateMany({ targetType, targetId }, { resolved: true });

    res.json({ message: 'Item removed', target });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createReport, getFlaggedItems, resolveFlag, removeFlaggedItem };