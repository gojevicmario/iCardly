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

// @Description      Buy a single ticket
// @Route            POST /api/v1/tickets/:id/buy
// @Access           Loggedin users only
exports.buyTicket = asyncHandler(async (req, res, next) => {
  let cardNumber = req.body.cardNumber;
  if (!cardNumber || cardNumber.length !== 16) {
    //na produ neki regex za provjeru kartice ili npm
    throw new ErrorResponse(
      `A valid card number is required for purchase!`,
      400
    );
  }

  req.body.ticket = req.params.id;

  if (!(await Ticket.exists({ _id: req.body.ticket }))) {
    throw new ErrorResponse(`invalid ticketId`, 400);
  }

  if (
    (await Order.find({
      user: req.user.id,
      ticket: req.body.ticket
    }).countDocuments()) > 0
  ) {
    throw new ErrorResponse(`You have already purchased this ticket`, 400);
  }

  req.body.user = req.user.id;

  const order = await Order.create(req.body);

  res.status(200).json({
    success: true,
    data: order
  });
});
