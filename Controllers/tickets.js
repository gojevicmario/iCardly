const TicketWarehouse = require('../Models/TicketWarehouse');
// @Description      Get all tickets
// @Route            GET /api/v1/tickets
// @Access           Public
exports.getTickets = async (req, res, next) => {
  const tickets = await TicketWarehouse.find();
  res.status(200).json({ success: true, data: tickets });
};

// @Description      Get single ticket
// @Route            GET /api/v1/tickets/:id
// @Access           Public
exports.getTicket = async (req, res, next) => {
  try {
    const ticket = await TicketWarehouse.findById(req.params.id);

    if (!ticket) {
      return res.status(400).json({ success: false });
    }

    res.status(200).json({ success: true, data: ticket });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

// @Description      Creates single ticket
// @Route            POST /api/v1/tickets
// @Access           Public but in a real world Transport company
exports.createTicket = async (req, res, next) => {
  const ticket = await TicketWarehouse.create(req.body);

  res.status(401).json({
    success: true,
    data: ticket,
  });
};
