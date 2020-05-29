const express = require('express');
const {
  getTickets,
  getTicket,
  createTicket,
  updateTicket,
} = require('../Controllers/tickets');

const router = express.Router();

router.route('/').get(getTickets).post(createTicket);

router.route('/:id').get(getTicket);

module.exports = router;
