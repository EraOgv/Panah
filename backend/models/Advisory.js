const mongoose = require('mongoose');

const advisorySchema = new mongoose.Schema(
  {
    country: { type: String, required: true, unique: true },
    countryCode: { type: String, default: '' },
    level: { type: Number, min: 1, max: 4, required: true },
    levelLabel: { type: String, default: '' },
    summary: { type: String, default: '' },
    link: { type: String, default: '' },
    source: { type: String, default: 'U.S. Department of State' },
    sourceUpdatedAt: { type: Date },
    manualOverride: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Advisory', advisorySchema);