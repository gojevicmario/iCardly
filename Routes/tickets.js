const express = require('express');
const { getTickets, getTicket } = require('../Controllers/tickets');

const router = express.Router();

router.route('/').get(getTickets);

router.route('/:id').get(getTicket);

module.exports = router;
