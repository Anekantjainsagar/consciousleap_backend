const mongoose = require("mongoose");

const therapistSchema = new mongoose.Schema({
  email: {
    type: String,
    require: true,
  },
  photo: {
    type: String,
    default:
      "https://res.cloudinary.com/dfk09gblw/image/upload/v1697568033/wknzilhus8xoxd32h2zd.jpg",
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
  date: {
    type: Date,
    default: new Date(),
  },
  reviews: [
    {
      user: String,
      positivenss: String,
      knowledgable: String,
      comfortability: String,
      experience: String,
    },
  ],
});

const Therapists = mongoose.model("Therapist", therapistSchema);
module.exports = Therapists;
