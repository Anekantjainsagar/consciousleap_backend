const express = require("express");
const login = express.Router();

var nodemailer = require("nodemailer");

// Controllers
const {
  signInUser,
  signUp,
  getUser,
  updateUser,
  updateQuestionnaire,
  deleteQuestionnaire,
} = require("../../controllers/Login/index");
const { sendMail } = require("../../controllers/Login/otp");
const {
  sendUrl,
  verifyUrl,
  resetPassword,
} = require("../../controllers/Login/passwordReset");

// Middlewares
const {
  validateSignUp,
  userValidationResult,
} = require("../../middlewares/index");
const { validateSingin } = require("../../middlewares/auth");
const {
  passswordValidate,
  passswordValidationResult,
} = require("../../middlewares/passwordReset");

// Password reset
login.post("/password-reset", sendUrl);
login.get("/password-reset/:id/:token", verifyUrl);
login.post(
  "/password-reset/reset/:id/:token",
  passswordValidate,
  passswordValidationResult,
  resetPassword
);

// Routes
login.post("/get-user", validateSingin, getUser);
login.post("/update-user", validateSingin, updateUser);

login.post("/delete-questionnaire", validateSingin, deleteQuestionnaire);
login.post("/update-questionnaire", validateSingin, updateQuestionnaire);

login.post("/signup", validateSignUp, userValidationResult, signUp);
login.post("/signin", signInUser);

login.use("/otp-verification", validateSignUp, userValidationResult, sendMail);

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "anekantjainsagar@gmail.com",
    pass: "imfzrwfdcaiwqqhi",
  },
});

login.post("/send-test-mail", async (req, res) => {
  let email = req.body.email;
  console.log(email);

  const info = await transporter.sendMail({
    from: '"Maddison Foo Koch 👻" scarlett.sawayn@ethereal.email', // sender address
    to: email, // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1>Hello world {{email}}</h1>
</body>
</html>`, // html body
  });

  res.status(200).send("Message sent: %s", info.messageId);
});

module.exports = login;
