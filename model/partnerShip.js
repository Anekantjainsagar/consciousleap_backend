const mongoose = require("mongoose");

const partnershipForm = new mongoose.Schema({
  name: String,
  email: String,
  company: String,
  phone: String,
  message: String,
});

const Partners = mongoose.model("Partners", partnershipForm);
module.exports = Partners;
