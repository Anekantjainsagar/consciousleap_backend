const express = require("express");
const consent = express.Router();
const Consent = require("../../model/consentForm");
const Login = require("../../model/loginSchema");

consent.post("/", async (req, res) => {
  const { name, emergency, address, id } = req.body;

  let data = await Login.findOne({ _id: id });

  if (data) {
    res.send("Already filled");
  } else {
    const consent = Consent({ name, address, emergency, userId: id });
    consent
      .save()
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((err) => {
        res.send(err);
      });
  }
});

module.exports = consent;
