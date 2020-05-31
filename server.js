const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const errorHandler = require('./Middleware/error');
const cookieParser = require('cookie-parser');
const mongoSanizite = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');

const connectDB = require('./Config/Dev/db');

//Load environment variables
//dotenv.config({ path: './Config/Dev/config.env' });
dotenv.config({ path: './Config/prod.env' });

//Connect DB
connectDB();

//Route files
const tickets = require('./Routes/tickets');
const auth = require('./Routes/auth');
const users = require('./Routes/users');

const app = express();

//register middelware
app.use(express.json());
app.use(cookieParser());
app.use(mongoSanizite());
app.use(helmet());
app.use(xss());

const limiter = rateLimit({
  windowMs: process.env.RATE_LIMITER_TIME,
  max: process.env.RATE_LIMITER_NUMBER_OF_REQUESTS
});
app.use(limiter);
app.use(hpp());
app.use(cors());

if (process.env.NODE_ENV === 'dev') {
  app.use(morgan('dev'));
}

//Mount routers
app.use('/api/v1/tickets', tickets);
app.use('/api/v1/auth', auth);
app.use('/api/v1/user', users);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  if (process.env.NODE_ENV == 'dev') {
    console.log(`${PORT} is your port, mate!\n`.brightGreen.bgBlack.bold);
  }
});

// handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  server.close(() => process.exit(1));
});
