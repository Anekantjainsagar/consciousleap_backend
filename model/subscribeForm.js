const mongoose = require("mongoose");

const subscribeForm = new mongoose.Schema({
  email: String,
});

const Subscribe = mongoose.model("suhscribes", subscribeForm);
module.exports = Subscribe;
