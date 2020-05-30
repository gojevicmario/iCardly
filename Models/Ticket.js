const mongoose = require('mongoose');
const TicketWarehouse = require('./TicketWarehouse');

const TicketSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter a name.'],
      trim: true,
      maxlength: [50, `Name can't be more than 50 characters.`]
    },
    price: {
      type: Number,
      required: [true, 'Please enter a price.'],
      min: 1
    },
    departure: {
      type: Date,
      required: [true, 'Departure time is a required field'],
      min: new Date().toISOString()
    },
    arrival: {
      type: Date,
      required: [true, 'Arrival time is a required field'],
      min: new Date().toISOString()
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

TicketSchema.virtual('TicketWarehouse', {
  ref: 'TicketWarehouse',
  localField: '_id',
  foreignField: 'ticket',
  justOne: true
});

module.exports = mongoose.model('Ticket', TicketSchema);
