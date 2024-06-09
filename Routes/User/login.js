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
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "scarlett.sawayn@ethereal.email",
    pass: "Uq7qCXw9xBdsszVSMa",
  },
});

login.get("/send-test-mail", async (req, res) => {
  const info = await transporter.sendMail({
    from: '"Maddison Foo Koch 👻" scarlett.sawayn@ethereal.email', // sender address
    to: req.body.email, // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  });

  res.send("Message sent: %s", info.messageId);
});

module.exports = login;
