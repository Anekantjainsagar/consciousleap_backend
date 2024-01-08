const express = require("express");
const consent = express.Router();
const Consent = require("../../model/consentForm");
const Login = require("../../model/loginSchema");
const { validateSingin } = require("../../middlewares/auth");

consent.post("/check", validateSingin, async (req, res) => {
  const { id } = req;
  let data = await Consent.findOne({ userId: id });

  console.log(id + data);

  if (data) {
    res.send(true);
  } else {
    res.send(false);
  }
});

consent.post("/", validateSingin, async (req, res) => {
  const { name, emergency, address } = req.body;
  let { id } = req;

  const consent = Consent({ name, address, emergency, userId: id });
  console.log(consent);
  consent
    .save()
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((err) => {
      res.send(err);
    });
});

consent.get("/get-consents", async (req, res) => {
  const response = await Consent.find();
  res.status(200).send(response);
});

consent.post("/delete-consent/:id", async (req, res) => {
  const { id } = req.params;
  const response = await Subscribe.deleteOne({ _id: id });
  res.status(200).send(response);
});

module.exports = consent;
