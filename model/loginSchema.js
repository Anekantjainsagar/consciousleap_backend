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
});

const Login = mongoose.model("Users", loginSchema);
module.exports = Login;
