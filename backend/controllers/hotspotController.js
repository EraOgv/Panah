const Hotspot = require('../models/Hotspot');

// @desc  Get hotspots, optionally filtered by city
// @route GET /api/hotspots?city=kualalumpur
const getHotspots = async (req, res) => {
  try {
    const { city } = req.query;
    const filter = city ? { city } : {};
    const hotspots = await Hotspot.find(filter);
    res.json(hotspots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Create a hotspot (admin)
// @route POST /api/hotspots
const createHotspot = async (req, res) => {
  try {
    const hotspot = await Hotspot.create(req.body);
    res.status(201).json(hotspot);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getHotspots, createHotspot };