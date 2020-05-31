const express = require('express');
const { getTickets, refundTicket } = require('../Controllers/users');

const User = require('../Models/User');
const advancedResults = require('../Middleware/advancedResults');

const router = express.Router();

const { protect } = require('../Middleware/auth');

router.route('/tickets').get(protect, getTickets);
router.route('/tickets/:orderId/refund').post(protect, refundTicket);

module.exports = router;
