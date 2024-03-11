const collab = require("express").Router();
const Collab = require("../model/collabrationSchema");

collab.post("/add", (req, res) => {
  console.log(req.body)
  const {
    name,
    email,
    contactPerson,
    contact,
    city,
    website,
    organisationType,
    registered,
    mission,
    cause,
  } = req.body;

  const obj = Collab({
    name,
    email,
    contactPerson,
    contact,
    city,
    website,
    organisationType,
    registered,
    mission,
    cause,
  });

  obj
    .save()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

collab.get("/get-all", async (req, res) => {
  const response = await Collab.find();
  res.send(response);
});

collab.get("/get/:id", async (req, res) => {
  const { id } = req.params;
  const response = await Collab.findById(id);
  res.send(response);
});

module.exports = collab;
