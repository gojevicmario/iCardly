const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

dotenv.config({ path: './Config/Dev/config.env' });

const Ticket = require('./Models/Ticket');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

//Read JSON
const tickets = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/ticketsSeedData.json`, 'utf-8')
);

//import to db
const importData = async () => {
  try {
    await Ticket.create(tickets);
    console.log('Data seeded :)'.white.bgGreen.underline.bold);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

const deleteData = async () => {
  try {
    await Ticket.deleteMany();
    console.log('Data destroyed :/'.white.bgRed.underline.bold);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === '-import') {
  importData();
} else if (process.argv[2] === '-delete') {
  deleteData();
}
