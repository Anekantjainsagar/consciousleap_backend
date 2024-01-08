const mongoose = require("mongoose");

const partnershipForm = new mongoose.Schema({
  name: String,
  email: String,
  company: String,
  phone: String,
  message: String,
  date: {
    type: Date,
    default: Date.now(),
  },
});

const Partners = mongoose.model("Partners", partnershipForm);
module.exports = Partners;
