const express = require("express");
const dotenv = require("dotenv");

//Load environment variables

dotenv.config({ path: "./config/config.env" });

const app = express();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  if (process.env.NODE_ENV == "dev") {
    console.log(`${PORT} is your port, mate!\n`);
  }
});
