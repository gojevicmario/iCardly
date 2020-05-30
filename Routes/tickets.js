const express = require('express');
const {
  getTickets,
  getTicket,
  createTicket,
  updateTicket,
  buyTicket
} = require('../Controllers/tickets');

const Ticket = require('../Models/Ticket');
const advancedResults = require('../Middleware/advancedResults');

const router = express.Router();

router
  .route('/')
  .get(advancedResults(Ticket, 'TicketWarehouse'), getTickets)
  .post(createTicket);

router.route('/:id').get(getTicket);

router.route('/:id/buy').post(buyTicket);

module.exports = router;
