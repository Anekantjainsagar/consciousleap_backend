const mongoose = require("mongoose");

const collabrationSchema = new mongoose.Schema({
  name: String,
  email: String,
  contactPerson: String,
  contact: String,
  city: String,
  website: String,
  organisationType: String,
  registered: String,
  mission: String,
  cause: String,
  date: {
    type: Date,
    default: Date.now(),
  },
});

const Collab = mongoose.model("Collab", collabrationSchema);
module.exports = Collab;
