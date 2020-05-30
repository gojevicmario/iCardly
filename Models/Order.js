const mongoose = require('mongoose');
const ticket = require('./Ticket');
const ticketWarehouse = require('./TicketWarehouse');
const colors = require('colors');
const ErrorResponse = require('../Helpers/errorResponse');
//TODO: implement better logging

const OrderSchema = new mongoose.Schema({
  ticket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ticket',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

OrderSchema.pre('save', async function(next) {
  //scalability, više requestova u isto vrijeme???
  let availableTickets = (
    await this.model('TicketWarehouse').findOne({
      ticket: this.ticket
    })
  ).availableTickets;

  if (availableTickets === 0) {
    next(new ErrorResponse(`This line is soldout`, 403));
  }

  await this.model('TicketWarehouse').findOneAndUpdate(
    { ticket: this.ticket },
    {
      //mora biti neki bolji način
      availableTickets: --availableTickets
    },
    { new: true }
  );
  console.log(
    `User: ${this.user} just bought ticket: ${this.ticket} timestamp:${this.createdAt}`
      .yellow
  );
  next();
});

module.exports = mongoose.model('Order', OrderSchema);
