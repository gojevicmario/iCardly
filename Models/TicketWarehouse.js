const mongoose = require('mongoose');

const TicketWarehouseSchema = new mongoose.Schema({
  ticket: {
    name: {
      type: String,
      required: [true, 'Please enter a name.'],
      trim: true,
      maxlength: [50, `Name can't be more than 50 characters.`],
    },
    price: {
      type: Number,
      required: [true, 'Please enter a price.'],
      min: 1,
    },
    departure: {
      type: Date,
      required: [true, 'Departure time is a required field'],
      min: new Date().toISOString(),
    },
    arrival: {
      type: Date,
      required: [true, 'Arrival time is a required field'],
      min: new Date().toISOString(),
    },
  },
  availableTickets: {
    type: Number,
    required: [true, 'The number of avaliable tickets is a required field'],
    min: 1,
  },
});

module.exports = mongoose.model('TicketWarehouse', TicketWarehouseSchema);
