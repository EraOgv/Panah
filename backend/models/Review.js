const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    relatedTo: {
      type: String,
      enum: ['hotel', 'restaurant', 'guide', 'taxi'],
      required: true,
    },
    proofType: {
      type: String,
      enum: ['receipt', 'booking_confirmation', 'guide_photo', 'contact_number', 'taxi_plate'],
      required: true,
    },
    proofFileUrl: {
      type: String,
      required: true, // proof is mandatory — this is what makes reviews trustworthy
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['approved', 'pending', 'rejected'],
      default: 'approved', // auto-approved by default since proof is required
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

module.exports = mongoose.model('Review', reviewSchema);