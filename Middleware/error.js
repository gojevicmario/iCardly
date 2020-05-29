const ErrorResponse = require('../Helpers/errorResponse');
const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;

  if (err.name === 'CastError') {
    const message = `Resource with id: ${err.value} was not found`;
    error = new ErrorResponse(message, 404);
  }
  //Mongose codes
  else if (err.code === 11000) {
    const message = `Duplicate field entered`;
    error = new ErrorResponse(message, 400);
  } else if ((err.name = 'ValidationError')) {
    res.status(500).json(err.name);
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
  });
};

module.exports = errorHandler;
