const mongoose = require('mongoose');

const hotspotSchema = new mongoose.Schema(
  {
    city: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['scam', 'safe'],
      required: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    reportCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Hotspot', hotspotSchema);