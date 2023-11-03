const express = require("express");
const login = express.Router();

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

module.exports = login;
