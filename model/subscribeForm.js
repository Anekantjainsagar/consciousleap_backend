const mongoose = require("mongoose");

const subscribeForm = new mongoose.Schema({
  email: String,
  date: {
    type: Date,
    default: Date.now(),
  },
});

const Subscribe = mongoose.model("suhscribes", subscribeForm);
module.exports = Subscribe;
