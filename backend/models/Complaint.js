const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    scamCategory: {
      type: String,
      enum: [
        'Taxi Scam',
        'Hotel Scam',
        'Fake Guide',
        'Pickpocket',
        'Unsafe Area',
        'Fake Currency Exchange',
        'Restaurant Fraud',
        'Vehicle/Equipment Rental Scam',
        'Free-Gift Trap',
      ],
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    locationText: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    photoUrl: {
      type: String,
      default: '',
    },
    dateOfIncident: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'needs_info'],
      default: 'pending',
    },
    adminNote: {
      type: String,
      default: '',
    },
    flagged: {
      type: Boolean,
      default: false,
    },
    flagCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Complaint', complaintSchema);