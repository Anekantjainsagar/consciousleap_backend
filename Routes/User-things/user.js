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

user.get("/get-subscribe", async (req, res) => {
  const response = await Subscribe.find();
  res.status(200).send(response);
});

user.post("/delete-subscribe/:id", async (req, res) => {
  const { id } = req.params;
  const response = await Subscribe.deleteOne({ _id: id });
  res.status(200).send(response);
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

user.post("/get-partners", async (req, res) => {
  const response = await Partners.find();
  res.send(response);
});

user.post("/delete-partner/:id", async (req, res) => {
  const { id } = req.params;
  const response = await Partners.deleteOne({ _id: id });
  res.status(200).send(response);
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

user.post("/get-busssiness", async (req, res) => {
  const response = await Bussiness.find();
  res.send(response);
});

user.post("/delete-bussiness/:id", async (req, res) => {
  const { id } = req.params;
  const response = await Bussiness.deleteOne({ _id: id });
  res.status(200).send(response);
});

user.post("/thoughts", validateSingin, async (req, res) => {
  const { thoughts } = req.body;
  const { id } = req;

  const response = await Login.updateOne({ _id: id }, { $push: { thoughts } });
  res.status(200).send(response);
});

user.post("/delete-thoughts", async (req, res) => {
  try {
    const { userId, noteId } = req.body;

    const response = await Login.updateOne(
      { _id: userId },
      { $pull: { thoughts: noteId } }
    );

    res
      .status(200)
      .json({ message: "Thoughts deleted successfully", response });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

user.post("/thingsMyself", validateSingin, async (req, res) => {
  const { selfCare, thingsPast } = req.body;
  const { id } = req;

  let obj = { thingsMyself: req.body.thingsMyself, selfCare, thingsPast };

  const response = await Login.updateOne(
    { _id: id },
    { $push: { thingsMyself: obj } }
  );
  res.status(200).send(response);
});

user.post("/delete-thingsMyself", async (req, res) => {
  try {
    const { userId, noteId } = req.body;

    const response = await Login.updateOne(
      { _id: userId },
      { $pull: { thingsMyself: { _id: noteId } } }
    );

    res
      .status(200)
      .json({ message: "ThingsMyself deleted successfully", response });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

user.post("/gratitude", validateSingin, async (req, res) => {
  const { proud, tomorrow, gratefulFor } = req.body;
  const { id } = req;

  let obj = { proud, tomorrow, gratefulFor };

  const response = await Login.updateOne(
    { _id: id },
    { $push: { gratitude: obj } }
  );
  res.status(200).send(response);
});

user.post("/delete-gratitude", async (req, res) => {
  try {
    const { userId, noteId } = req.body;

    const response = await Login.updateOne(
      { _id: userId },
      { $pull: { gratitude: { _id: noteId } } }
    );

    res
      .status(200)
      .json({ message: "Gratitude deleted successfully", response });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
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

user.get("/get-order-report", async (req, res) => {
  const orders = await Orders.find();
  let report = {
    day: 0,
    week: 0,
    month: 0,
  };

  orders.map((e) => {
    if (
      new Date(e.date).toString().slice(0, 16) ===
      new Date().toString().slice(0, 16)
    ) {
      report.day++;
    }
    if (e.date > Date.now() - 7 * 24 * 60 * 60 * 1000) {
      report.week++;
    }
    if (new Date(e?.date).getMonth() >= new Date().getMonth()) {
      report.month++;
    }
  });
  res.status(200).send(report);
});

user.get("/get-users-report", async (req, res) => {
  const users = await Login.find();
  let report = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  users.map((e) => {
    report[new Date(e.date).getMonth()]++;
  });

  res.status(200).send(report);
});

user.get("/get-revenue", async (req, res) => {
  const payment = await Orders.find();
  let report = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  let totalAmount = 0;
  payment.map((e) => {
    let total = e?.products
      ?.reduce((acc, item) => acc + item?.price * item?.quantity, 0)
      .toFixed(2);
    total = parseInt(total) + parseInt(total * 0.18);
    console.log(total);
    report[new Date(e.date).getMonth()] += total;
    totalAmount += total;
  });
  res.status(200).send({ report, total: totalAmount });
});

user.post("/get_order", async (req, res) => {
  const { id } = req.body;

  const data = await Orders.findOne({ _id: id });
  res.send(data);
});

user.post("/add-to-wishlist", validateSingin, async (req, res) => {
  const { item_id } = req.body;
  const { id } = req;

  const response = await Login.updateOne(
    { _id: id },
    { $push: { wishlist: item_id } }
  );
  res.send(response);
});

user.get("/get-users", async (req, res) => {
  const response = await Login.find();
  res.status(200).send(response);
});

user.post("/delete-user/:id", async (req, res) => {
  const { id } = req.params;
  const response = await Login.deleteOne({ _id: id });
  res.status(200).send(response);
});

user.post("/rain", validateSingin, async (req, res) => {
  const { id } = req;

  try {
    const count = await Login.findOne({ _id: id });
    const response = await Login.updateOne(
      { _id: id },
      { rain: count?.rain + 1 }
    );
    res
      .status(200)
      .json({ message: "Rain count incremented successfully", response });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

user.post("/sunshine", validateSingin, async (req, res) => {
  const { id } = req;

  try {
    const count = await Login.findOne({ _id: id });
    const response = await Login.updateOne(
      { _id: id },
      { sunshine: count?.sunshine + 1 }
    );
    res
      .status(200)
      .json({ message: "Rain count incremented successfully", response });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Internal server error" });
  }
});

user.post("/cloud", validateSingin, async (req, res) => {
  const { id } = req;

  try {
    const count = await Login.findOne({ _id: id });
    const response = await Login.updateOne(
      { _id: id },
      { cloud: count?.cloud + 1 }
    );
    res
      .status(200)
      .json({ message: "Rain count incremented successfully", response });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

user.post("/light", validateSingin, async (req, res) => {
  const { id } = req;

  try {
    const count = await Login.findOne({ _id: id });
    const response = await Login.updateOne(
      { _id: id },
      { light: count?.light + 1 }
    );
    res
      .status(200)
      .json({ message: "Rain count incremented successfully", response });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = user;
