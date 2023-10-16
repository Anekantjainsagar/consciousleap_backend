const mongoose = require("mongoose");

const therapistSchema = new mongoose.Schema({
  email: {
    type: String,
    require: true,
  },
  phone: {
    type: String,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  displayName: {
    type: String,
    require: true,
  },
  desc: {
    type: String,
    require: true,
  },
  about: {
    type: String,
    require: true,
  },
  experience: {
    type: String,
  },
  about: {
    type: String,
  },
  qualifications: [String],
  speaks: [String],
  expertise: [String],
});

const Therapists = mongoose.model("Therapist", therapistSchema);
module.exports = Therapists;
