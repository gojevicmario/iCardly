const ErrorResponse = require('../Helpers/errorResponse');
const asyncHandler = require('../Middleware/async');
const TicketWarehouse = require('../Models/TicketWarehouse');

// @Description      Get all tickets
// @Route            GET /api/v1/tickets
// @Access           Public
exports.getTickets = asyncHandler(async (req, res, next) => {
  const tickets = await TicketWarehouse.find();
  res.status(200).json({ success: true, data: tickets });
});

// @Description      Get single ticket
// @Route            GET /api/v1/tickets/:id
// @Access           Public
exports.getTicket = asyncHandler(async (req, res, next) => {
  const ticket = await TicketWarehouse.findById(req.params.id);

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
  const ticket = await TicketWarehouse.create(req.body);

  res.status(201).json({
    success: true,
    data: ticket,
  });
});
