const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: String,
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
});

const Orders = mongoose.model("Orders", orderSchema);
module.exports = Orders;
