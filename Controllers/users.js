const ErrorResponse = require('../Helpers/errorResponse');
const asyncHandler = require('../Middleware/async');
const TicketWarehouse = require('../Models/TicketWarehouse');
const Ticket = require('../Models/Ticket');
const Order = require('../Models/Order');
const moment = require('moment');

// @Description      Gets all purchased tickets
// @Route            GET /api/v1/user/tickets
// @Access           logged in user only
exports.getTickets = asyncHandler(async (req, res, next) => {
  const myTickets = await Order.find({
    user: req.user.id
  }).select('-user');
  res.status(200).json({ success: true, data: myTickets });
});

// @Description      Tries to get a refund for a ticket
// @Route            POST /api/v1/user/tickets/:id/refund
// @Access           logged in user only
// @LifeProTip       Would probably be smarter to have an orders controller for buying/refunding
exports.refundTicket = asyncHandler(async (req, res, next) => {
  const order = await Order.findOne({
    ticket: req.params.ticketId,
    user: req.user.id
  });

  if (!order) {
    throw new ErrorResponse('Ticket refund failed');
  }

  const ticket = await Ticket.findOne({ _id: req.params.ticketId });

  if (!ticket) {
    throw new ErrorResponse('Ticket not found');
  }

  var timeLeftToDeparture = Math.abs(
    moment(Date.now()).diff(ticket.departure, 'hours', true)
  );

  if (timeLeftToDeparture < 1) {
    throw new ErrorResponse(
      `The departure time is less than an hours. Operation not allowed.`,
      403
    );
  }

  await Order.deleteOne(order);
  await TicketWarehouse.findOneAndUpdate(
    { ticket: req.params.ticketId },
    {
      $inc: {
        availableTickets: 1
      }
    },
    { new: true }
  );
  console.log(
    `User: ${req.user.email} just refunded one order timestamp:${Date.now()}`
      .blue
  );
  res.status(200).json({ success: true });
});
