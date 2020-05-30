const mongoose = require('mongoose');

const TicketWarehouseSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.ObjectId,
    select: false
  },
  ticket: {
    type: mongoose.Schema.ObjectId,
    ref: 'Ticket',
    required: true
  },
  availableTickets: {
    type: Number,
    required: [true, 'The number of available tickets is a required field'],
    min: 1
  }
});

module.exports = mongoose.model('TicketWarehouse', TicketWarehouseSchema);
