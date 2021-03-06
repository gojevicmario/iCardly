const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../Helpers/errorResponse');
const User = require('../Models/User');

//Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  console.log(req.headers.authorization);
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
    //Podjsetnik samom sebi na startsWiTch koji mi je tu uzeo previše vremena. Živio typescript
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    next(new ErrorResponse('Not authorized to access this route!', 401));
  }

  try {
    //verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    next(new ErrorResponse('Not authorized to access this route!', 401));
  }
});

//Kasnije dodati neki middleware koji bi određene operacije dozvolio samo
//nekim "klasama" korisnika recimo dodavanje novih termina(prijevoznici) itd.
