const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const connectDB = require('./Config/Dev/db');
const errorHandler = require('./Middleware/error');
const cookieParser = require('cookie-parser');

//Load environment variables
dotenv.config({ path: './Config/Dev/config.env' });

//Connect DB
connectDB();

//Route files
const tickets = require('./Routes/tickets');
const auth = require('./Routes/auth');

const app = express();

//Body parser
app.use(express.json());
app.use(cookieParser());

if (process.env.NODE_ENV === 'dev') {
  app.use(morgan('dev'));
}

//Mount routers
app.use('/api/v1/tickets', tickets);
app.use('/api/v1/auth', auth);

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
