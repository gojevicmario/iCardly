// @Description      Get all tickets
// @Route            GET /api/v1/tickets
// @Access           Public
exports.getTickets = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'Show all tickets' });
};

// @Description      Get single ticket
// @Route            GET /api/v1/tickets/:id
// @Access           Public
exports.getTicket = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Show ticket with ID: ${req.params.id}` });
};
