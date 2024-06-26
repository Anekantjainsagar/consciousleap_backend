const express = require("express");
const product = express.Router();
const Products = require("../model/productSchema");

product.post("/add", (req, res) => {
  const {
    name,
    size,
    discountPrice,
    price,
    available,
    colors,
    febric,
    images,
    description,
    rating,
  } = req.body;

  const product = Products({
    name,
    size,
    discountPrice,
    price,
    available,
    colors,
    febric,
    images,
    description,
    rating,
  });
  product
    .save()
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((err) => {
      console.log(err);
    });
});

product.post("/update/:id", async (req, res) => {
  const { id } = req.params;
  const {
    name,
    size,
    discountPrice,
    price,
    available,
    colors,
    febric,
    images,
    description,
    rating,
  } = req.body;

  const product = await Products.updateOne(
    { _id: id },
    {
      name,
      size,
      discountPrice,
      price,
      available,
      colors,
      febric,
      images,
      description,
      rating,
    }
  );
  res.status(200).send(product);
});

product.post("/delete/:id", async (req, res) => {
  const { id } = req.params;
  const response = await Products.deleteOne({ _id: id });
  res.status(200).send(response);
});

product.post("/get/:id", async (req, res) => {
  const { id } = req.params;

  const data = await Products.findOne({ _id: id });
  res.status(200).send(data);
});

product.post("/get-all", async (req, res) => {
  let search = req.query.search;
  let page = parseInt(req.query.page) || 1; // Default to page 1
  let limit = 20 * page;

  let query = {};
  const products_length = await Products.find();
  if (search?.length > 0) {
    query.name = { $regex: search, $options: "i" };
  }

  try {
    let products = await Products.find(query).sort({ _id: -1 }).limit(limit);
    res.send({ products, length: products_length.length });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = product;
