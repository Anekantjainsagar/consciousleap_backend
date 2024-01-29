const mongoose = require("mongoose");

const loginSchema = new mongoose.Schema({
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
  questionnaire: {
    age: String,
    problem: String,
    answers: Array,
    backendAnswers: [
      {
        value: Number,
        text: String,
      },
    ],
  },
  thoughts: Array,
  thingsMyself: [
    {
      selfCare: String,
      thingsMyself: String,
      thingsPast: String,
    },
  ],
  gratitude: [
    {
      gratefulFor: String,
      proud: String,
      tomorrow: String,
    },
  ],
  addresses: [
    {
      address: String,
      postal: String,
      city: String,
      state: String,
      country: String,
      phone: String,
    },
  ],
  wishlist: Array,
  date: {
    type: Date,
    default: Date.now(),
  },
  rain: {
    type: Number,
    default: 0,
  },
  sunshine: {
    type: Number,
    default: 0,
  },
  cloud: {
    type: Number,
    default: 0,
  },
  light: {
    type: Number,
    default: 0,
  },
});

const Login = mongoose.model("Users", loginSchema);
module.exports = Login;
