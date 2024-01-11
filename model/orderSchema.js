const mongoose = require("mongoose");
const Login = require("./loginSchema"); // Adjust the path accordingly

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "Login" },
  products: Array,
  localPickup: String,
  additional: String,
  address: {
    address: String,
    postal: String,
    city: String,
    state: String,
    country: String,
    phone: String,
  },
  mode: String,
  date: {
    type: Date,
    default: Date.now(),
  },
});

const Orders = mongoose.model("Orders", orderSchema);
module.exports = Orders;
