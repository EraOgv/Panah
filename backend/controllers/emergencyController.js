const EmergencyContact = require('../models/EmergencyContact');

// @desc  Get emergency contacts, optionally filtered by city
// @route GET /api/emergency?city=kualalumpur
const getEmergencyContacts = async (req, res) => {
  try {
    const { city, type } = req.query;

    const filter = {};
    if (city) filter.city = city;
    if (type) filter.type = type;

    const contacts = await EmergencyContact.find(filter);
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Create a new emergency contact
// @route POST /api/emergency
const createEmergencyContact = async (req, res) => {
  try {
    const { city, type, name, phone, address, latitude, longitude } = req.body;

    const contact = await EmergencyContact.create({
      city,
      type,
      name,
      phone,
      address,
      latitude,
      longitude,
    });

    res.status(201).json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getEmergencyContacts, createEmergencyContact };