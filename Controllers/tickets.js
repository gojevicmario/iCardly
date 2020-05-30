const ErrorResponse = require('../Helpers/errorResponse');
const asyncHandler = require('../Middleware/async');
const Ticket = require('../Models/Ticket');
const TicketWarehouse = require('../Models/TicketWarehouse');
const Order = require('../Models/Order');
const advancedResults = require('../Middleware/advancedResults');

// @Description      Get all tickets
// @Route            GET /api/v1/tickets
// @Access           Public
exports.getTickets = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @Description      Get single ticket
// @Route            GET /api/v1/tickets/:id
// @Access           Public
exports.getTicket = asyncHandler(async (req, res, next) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    return next(
      new ErrorResponse(`Ticket with id: ${req.params.id} was not found`, 404)
    );
  }

  res.status(200).json({ success: true, data: ticket });
});

// @Description      Creates single ticket
// @Route            POST /api/v1/tickets
// @Access           Public but in a real world Transport company
exports.createTicket = asyncHandler(async (req, res, next) => {
  const ticket = await Ticket.create(req.body);

  res.status(201).json({
    success: true,
    data: ticket
  });
});

// @Description      Buy a single ticket
// @Route            POST /api/v1/tickets/:id/buy
// @Access           Loggedin users only
exports.buyTicket = asyncHandler(async (req, res, next) => {
  let cardNumber = req.body.cardNumber;
  if (!cardNumber) {
    next(new ErrorResponse(`Card number is required for purchase!`, 400));
  }

  const order = await Order.create(req.body);

  res.status(500).json({
    success: false,
    data: order
  });
});
