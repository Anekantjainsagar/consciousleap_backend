const express = require("express");
const user = express.Router();

const { validateSingin } = require("../../middlewares/auth");
const Login = require("../../model/loginSchema");
const Subscribe = require("../../model/subscribeForm");
const Partners = require("../../model/partnerShip");
const Bussiness = require("../../model/bussinessForm");
const Orders = require("../../model/orderSchema");

const stripe = require("stripe")(
  "sk_test_51NItdrSDHBoNQbmebZ9lSZwej7XFgGqhvaeaIALMcOv4c7SiVh8arQrmU82c7Q9D6Dtxg2DyZ1bpgG2L0PRv00QF00NP0MQFgO"
);

user.post("/subscribe", (req, res) => {
  const user = Subscribe({ email: req.body.email });

  user
    .save()
    .then((response) => {
      res.send(response);
    })
    .catch((err) => {
      console.log(err);
    });
});

user.post("/partners", async (req, res) => {
  const { name, company, email, phone, message } = req.body;

  const partners = Partners({ name, company, email, phone, message });
  partners
    .save()
    .then((resp) => {
      res.send(resp);
    })
    .catch((err) => {
      console.log(err);
    });
});

user.post("/bussiness", async (req, res) => {
  const {
    name,
    phone,
    company,
    noOfEmployees,
    workEmail,
    industry,
    country,
    about,
  } = req.body;

  const partners = Bussiness({
    name,
    phone,
    company,
    noOfEmployees,
    workEmail,
    industry,
    country,
    about,
  });
  partners
    .save()
    .then((resp) => {
      res.send(resp);
    })
    .catch((err) => {
      console.log(err);
    });
});

user.post("/thoughts", validateSingin, async (req, res) => {
  const { thoughts } = req.body;
  const { id } = req;

  const response = await Login.updateOne({ _id: id }, { thoughts });
  res.status(200).send(response);
});

user.post("/thingsMyself", validateSingin, async (req, res) => {
  const { selfCare, thingsMyself, thingsPast } = req.body;
  const { id } = req;

  let obj = { thingsMyself, selfCare, thingsPast };

  const response = await Login.updateOne({ _id: id }, { thingsMyself: obj });
  res.status(200).send(response);
});

user.post("/gratitude", validateSingin, async (req, res) => {
  const { proud, tomorrow, gratefulFor } = req.body;
  const { id } = req;

  let obj = { proud, tomorrow, gratefulFor };

  const response = await Login.updateOne({ _id: id }, { gratitude: obj });
  res.status(200).send(response);
});

user.post("/add-address", validateSingin, async (req, res) => {
  const { address } = req.body;
  const { id } = req;

  const response = await Login.updateOne(
    { _id: id },
    { $push: { addresses: address } }
  );
  res.status(200).send(response);
});

user.post("/order", validateSingin, async (req, res) => {
  const { id } = req;
  const { cart, order, mode } = req.body;

  const orderItem = Orders({
    user: id,
    products: cart,
    localPickup: order?.localPickup,
    address: order?.address,
    additional: order?.additional,
    mode,
  });

  const lineItmes = cart?.map((e) => ({
    price_data: {
      currency: "inr",
      product_data: {
        name: e?.name,
      },
      unit_amount: e?.price * 100 + e?.price * 18,
    },
    quantity: e?.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: lineItmes,
    success_url: `https://consciousleap.co/cart/5/${orderItem?._id}`,
    cancel_url: "https://consciousleap.co/cancel-payment",
  });

  orderItem.save().then((response) => {
    console.log(response);
  });

  res.json({ id: session.id, orderItem });
});

user.post("/get_order", async (req, res) => {
  const { id } = req.body;

  const data = await Orders.findOne({ _id: id });
  res.send(data);
});

user.post("/add-to-wishlist", async (req, res) => {
  const { item_id } = req.body;
  const { id } = req;

  const response = await Login.updateOne(
    { _id: id },
    { $push: { wishlist: item_id } }
  );
  res.send(response);
});

module.exports = user;
