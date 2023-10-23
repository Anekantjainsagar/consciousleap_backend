const express = require("express");
const therapist = express.Router();

// Controllers
const {
  signUp,
  getTherapist,
  updateTherapist,
  reviewTherapist,
} = require("../../controllers/therapists/index");
const { sendMail } = require("../../controllers/therapists/otp");
const {
  sendUrl,
  verifyUrl,
  resetPassword,
} = require("../../controllers/Login/passwordReset");
const {
  getAreaOfExpertise,
  getSpeaks,
  getAllTherapists,
} = require("../../controllers/therapists/filters");

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

// Routes

// Getting routes
therapist.post("/get-therapist", validateSingin, getTherapist);
therapist.post("/update-therapist", validateSingin, updateTherapist);

// Filter routes
therapist.get("/get-area-of-expertise", getAreaOfExpertise);
therapist.get("/get-speaks", getSpeaks);

// Getting all therapists
therapist.get("/get-all-therapists", getAllTherapists);
therapist.post(`/review`, validateSingin, reviewTherapist);

// Login signup routes
therapist.post("/signup", validateSignUp, userValidationResult, signUp);

therapist.use(
  "/otp-verification",
  validateSignUp,
  userValidationResult,
  sendMail
);

therapist.post("/password-reset", sendUrl);
therapist.get("/password-reset/:id/:token", verifyUrl);
therapist.post(
  "/password-reset/reset/:id/:token",
  passswordValidate,
  passswordValidationResult,
  resetPassword
);

module.exports = therapist;
