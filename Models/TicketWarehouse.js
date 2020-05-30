const mongoose = require('mongoose');

const TicketWarehouseSchema = new mongoose.Schema({
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
//enkapsulacija _id? saftey feature?
module.exports = mongoose.model('TicketWarehouse', TicketWarehouseSchema);
