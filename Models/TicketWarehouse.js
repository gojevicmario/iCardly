const mongoose = require('mongoose');

const TicketWarehouseSchema = new mongoose.Schema({
  ticket: {
    type: mongoose.Schema.ObjectId,
    ref: 'Ticket',
    required: true,
  },
  availableTickets: {
    type: Number,
    required: [true, 'The number of avaliable tickets is a required field'],
    min: 1,
  },
});

module.exports = mongoose.model('TicketWarehouse', TicketWarehouseSchema);
