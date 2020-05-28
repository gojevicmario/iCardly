const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');

//Route files
const tickets = require('./Routes/tickets');

//Load environment variables
dotenv.config({ path: './Config/Dev/config.env' });

const app = express();

if (process.env.NODE_ENV === 'dev') {
  app.use(morgan('dev'));
}

//Mount routers
app.use('/api/v1/tickets', tickets);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  if (process.env.NODE_ENV == 'dev') {
    console.log(`${PORT} is your port, mate!\n`);
  }
});
