const express = require('express');
const router = express.Router();
const { getEmergencyContacts, createEmergencyContact } = require('../controllers/emergencyController');

router.get('/', getEmergencyContacts);
router.post('/', createEmergencyContact);

module.exports = router;