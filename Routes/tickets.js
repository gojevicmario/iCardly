const express = require('express');
const { getTickets, getTicket, buyTicket } = require('../Controllers/tickets');

const Ticket = require('../Models/Ticket');
const advancedResults = require('../Middleware/advancedResults');

const router = express.Router();

const { protect } = require('../Middleware/auth');

router.route('/').get(advancedResults(Ticket, 'TicketWarehouse'), getTickets);

router.route('/:id').get(getTicket);
router.route('/:id/buy').post(protect, buyTicket);

module.exports = router;
