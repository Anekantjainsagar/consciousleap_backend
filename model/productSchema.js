const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  size: Array,
  discountPrice: Number,
  price: Number,
  available: Number,
  colors: Array,
  febric: Array,
  images: Array,
  description: String,
  rating: Number,
  date:{
    type:Date,
    deafult:Date.now()
  }
});

const Products = mongoose.model("Products", productSchema);
module.exports = Products;
