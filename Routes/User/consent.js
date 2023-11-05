const express = require("express");
const consent = express.Router();
const Consent = require("../../model/consentForm");

consent.post("/", async (req, res) => {
  const { name, emergency, address } = req.body;

  const consent = Consent({ name, address, emergency });

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
