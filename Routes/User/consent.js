const express = require("express");
const consent = express.Router();
const Consent = require("../../model/consentForm");
const Login = require("../../model/loginSchema");
const { validateSingin } = require("../../middlewares/auth");

consent.post("/check", validateSingin, async (req, res) => {
  const { id } = req;

  let data = await Consent.findOne({ userId: id });

  if (data) {
    res.send(true);
  } else {
    res.send(false);
  }
});

consent.post("/", validateSingin, async (req, res) => {
  const { name, emergency, address } = req.body;
  let { id } = req;

  console.log(id);

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

module.exports = consent;
