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
  purchasedAt: {
    type: Date,
    default: Date.now
  }
});

OrderSchema.pre('save', async function(next) {
  //scalability, više requestova u isto vrijeme???

  if (
    (await this.model('TicketWarehouse')
      .findOne({
        ticket: this.ticket
      })
      .select('availableTickets')) === 0
  ) {
    throw new ErrorResponse(`This line is soldout`, 403);
  }

  await this.model('TicketWarehouse').findOneAndUpdate(
    { ticket: this.ticket },
    {
      $inc: {
        availableTickets: -1
      }
    },
    { new: true }
  );
  console.log(
    `User: ${this.user} just bought ticket: ${this.ticket} timestamp:${this.purchasedAt}`
      .yellow
  );
  next();
});

// OrderSchema.post('deleteOne', async function(order, next) {
//   console.log('dokumnet'.red);
//   console.log(order);
//   await this.model('TicketWarehouse').findOneAndUpdate(
//     { ticket: ObjectId(order.ticket) },
//     {
//       $inc: {
//         availableTickets: 1
//       }
//     },
//     { new: true }
//   );
//   console.log(
//     `User: ${this.user} just refunded ticket: ${this.ticket} timestamp:${this.purchasedAt}`
//       .blue
//   );
//   next();
// });

module.exports = mongoose.model('Order', OrderSchema);
