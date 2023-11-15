const express = require("express");
const user = express.Router();

const { validateSingin } = require("../../middlewares/auth");
const Login = require("../../model/loginSchema");
const Subscribe = require("../../model/subscribeForm");
const Partners = require("../../model/partnerShip");
const Bussiness = require("../../model/bussinessForm");

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

module.exports = user;
