const express = require("express");
const user = express.Router();

const { validateSingin } = require("../../middlewares/auth");
const Login = require("../../model/loginSchema");

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
