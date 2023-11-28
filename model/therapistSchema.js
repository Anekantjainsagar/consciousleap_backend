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
  meeting_url: {
    url: {
      type: String,
      default:
        "https://colecowellbeingopcpvtltd.zohobookings.in/#/customer/sagrikaa",
    },
    price: {
      type: String,
      default: "0",
    },
  },
  full_meeting_url: {
    url: {
      type: String,
      default:
        "https://colecowellbeingopcpvtltd.zohobookings.in/#/customer/sagrikaa",
    },
    price: {
      type: String,
      default: "0",
    },
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
  notes: [
    {
      name: String,
      age: String,
      date: String,
      occupation: String,
      gender: String,
      relationship: String,
      session: String,
      complaints: {
        complaint1: String,
        complaint2: String,
        complaint3: String,
        complaint4: String,
      },
      notes: String,
      homework: String,
    },
  ],
});

const Therapists = mongoose.model("Therapist", therapistSchema);
module.exports = Therapists;
