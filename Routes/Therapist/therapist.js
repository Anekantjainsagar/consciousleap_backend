const express = require("express");
const therapist = express.Router();
const Therapists = require("../../model/therapistSchema");

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

therapist.post("/note", validateSingin, async (req, res) => {
  const { id } = req;
  const {
    name,
    age,
    date,
    occupation,
    gender,
    relationship,
    session,
    complaints,
    notes,
    homework,
  } = req.body;

  let note = {
    name,
    age,
    date,
    occupation,
    gender,
    relationship,
    session,
    complaints,
    notes,
    homework,
  };

  const response = await Therapists.updateOne(
    { _id: id },
    { $push: { notes: note } }
  );
  res.status(200).send(response);
});

therapist.post("/note/edit", validateSingin, async (req, res) => {
  const { id } = req;
  const {
    note_id,
    name,
    age,
    date,
    occupation,
    gender,
    relationship,
    session,
    complaints,
    notes,
    homework,
  } = req.body;

  let updatedNote = {
    name,
    age,
    date,
    occupation,
    gender,
    relationship,
    session,
    complaints,
    notes,
    homework,
  };

  const therapist = await Therapists.findById(id);
  const noteIndex = therapist.notes.findIndex((note) => note._id == note_id);

  if (noteIndex !== -1) {
    therapist.notes[noteIndex] = updatedNote;
    await therapist.save();

    res.status(200).send("Note updated successfully.");
  } else {
    res.status(404).send("Note not found.");
  }
});

module.exports = therapist;
