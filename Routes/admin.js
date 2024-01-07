const express = require("express");
const admin = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../model/adminSchema");

admin.post(`/add`, async (req, res) => {
  let { email, password } = req.body;

  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);
  email = email.toLowerCase();

  const data = await Admin.findOne({ email });

  if (data) {
    res.status(203).json({ data: "Email Already Exists", success: false });
  } else {
    const loginObj = Admin({
      email,
      password,
    });
    const jwtToken = jwt.sign(
      {
        user: loginObj._id,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "1d",
      }
    );
    loginObj
      .save()
      .then((result) => {
        res
          .status(200)
          .send({ data: loginObj, token: jwtToken, success: true });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Internal server error");
      });
  }
});

module.exports = admin;
