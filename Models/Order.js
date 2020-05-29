const mongoose = require('mongoose');
const ticket = require('./Ticket');
//const user = ???

const OrderSchema = new mongoose.Schema({
  ticket: [
    {
      type: Schema.Types.ObjectId,
      ref: 'ticket',
      required: true,
    },
  ],
  purchasedOn: {
    type: Date,
    default: new Date().toISOString,
  },
});

module.exports = mongoose.model('Order', OrderSchema);
