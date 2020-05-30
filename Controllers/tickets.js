const ErrorResponse = require('../Helpers/errorResponse');
const asyncHandler = require('../Middleware/async');
const Ticket = require('../Models/Ticket');

// @Description      Get all tickets
// @Route            GET /api/v1/tickets
// @Access           Public
exports.getTickets = asyncHandler(async (req, res, next) => {
  let query;

  const requestQuery = { ...req.query };

  const removeFields = ['select', 'sort'];

  removeFields.forEach(param => delete requestQuery[param]);

  let queryString = JSON.stringify(requestQuery);

  queryString = queryString.replace(
    /\b(gt|gte|lt|lte|regex|in)\b/g,
    match => `$${match}`
  );

  // queryString = queryString.replace()
  // console.log(queryString);
  //make regex to work for name

  query = Ticket.find(JSON.parse(queryString));

  //Select fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  //sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('departure');
  }

  const tickets = await query;

  res.status(200).json({ success: true, data: tickets });
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
