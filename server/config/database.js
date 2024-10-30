const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = () => {
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => {
      console.log("connection successfull");
    })
    .catch((e) => {
      console.log("error", e);
      console.error(e);
      process.exit(1);
    });
};
