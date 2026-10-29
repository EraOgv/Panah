const mongoose = require('mongoose');

const emergencyContactSchema = new mongoose.Schema(
  {
    city: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['police', 'hospital', 'embassy', 'pharmacy'],
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('EmergencyContact', emergencyContactSchema);