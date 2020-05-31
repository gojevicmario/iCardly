const ErrorResponse = require('../Helpers/errorResponse');
const asyncHandler = require('../Middleware/async');
const User = require('../Models/User');
const moment = require('moment');

// @Description      Register user
// @Route            POST /api/v1/auth/register
// @Access           Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password
  });

  sendTokenResponse(user, 200, res);
});

// @Description      Login user
// @Route            POST /api/v1/auth/login
// @Access           Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse('Please enter email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  const allowLogin = await user.matchPassword(password);

  if (!allowLogin) {
    return next(new ErrorResponse('Please enter email and password', 400));
  }
  sendTokenResponse(user, 200, res);
});

//Get token from the model and send token as a cookie
const sendTokenResponse = (user, statusCode, res) => {
  //Create token
  const token = user.getSignedJWT();

  const options = {
    expires: moment(Date.now())
      .add(process.env.JWT_COOKIE_EXPIRE, 'd')
      .toDate(),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({ success: true, token });
};

// @Description      Get current logged in user
// @Route            GET /api/v1/auth/login
// @Access           private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user
  });
});

// @Description      Log user out and clear cookie
// @Route            GET /api/v1/auth/logout
// @Access           private
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: moment(Date.now())
      .add('3', 's')
      .toDate(),
    httpOnly: true
  });
  res.status(200).json({
    success: true,
    data: {}
  });
});
