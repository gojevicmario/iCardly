const mongoose = require('mongoose');
const ticket = require('./Ticket');
const ticketWarehouse = require('./TicketWarehouse');
const moment = require('moment');

//const user = ???

const OrderSchema = new mongoose.Schema({
  ticket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ticket',
    required: true
  },
  user: {
    type: String,
    default: 'štef',
    required: true
  },
  refundedOn: {
    type: Date,
    default: new Date()
  }
});

OrderSchema.pre('save', async function(next) {
  //scalability, više requestova u isto vrijeme???

  // NOT TESTED !!
  let ticketWarehouse = await this.model('TicketWarehouse').findOne({
    ticket: this.ticket
  });

  if (moment(Date.now()).diff(ticketWarehouse.departure, 'hours', true) < 1) {
    new ErrorResponse(
      `The departure time is less than an hours. Operation not allowed.`,
      403
    );
  }

  await this.model('TicketWarehouse').findOneAndUpdate(
    { ticket: this.ticket },
    {
      //mora biti neki bolji način
      availableTickets: ++ticketWarehouse.availableTickets
    },
    { new: true }
  );
  console.log(
    `User: ${this.user} just refunded ticket: ${this.ticket} timestamp:${this.purchasedOn}`
  );
  next();
});

module.exports = mongoose.model('Order', OrderSchema);
