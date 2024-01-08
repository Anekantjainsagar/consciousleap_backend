const mongoose = require("mongoose");

const bussinessForm = new mongoose.Schema({
  name: String,
  phone: String,
  company: String,
  noOfEmployees: String,
  workEmail: String,
  industry: String,
  country: String,
  about: String,
  date: {
    type: Date,
    default: Date.now(),
  },
});

const Bussiness = mongoose.model("Bussiness", bussinessForm);
module.exports = Bussiness;
