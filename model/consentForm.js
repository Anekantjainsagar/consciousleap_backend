const mongoose = require("mongoose");

const consentSchema = new mongoose.Schema({
  userId: String,
  name: String,
  address: String,
  emergency: {
    name: String,
    phone: String,
    address: String,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

const Consent = mongoose.model("Consent", consentSchema);
module.exports = Consent;
