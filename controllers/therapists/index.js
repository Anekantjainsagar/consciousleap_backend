const Login = require("../../model/loginSchema");
const bcrypt = require("bcryptjs");
const Therapist = require("../../model/therapistSchema");
const jwt = require("jsonwebtoken");

exports.signUp = async (req, res) => {
  let { name, email, password, phone, displayName, desc } = req.body;

  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);
  email = email.toLowerCase();

  const data = await Therapist.findOne({ email });

  if (data) {
    res.status(203).json({ data: "Email Already Exists", success: false });
  } else {
    const therapistUser = Therapist({
      email,
      name,
      password,
      phone,
      displayName,
      desc,
    });
    const jwtToken = jwt.sign(
      {
        user: therapistUser._id,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "1d",
      }
    );
    therapistUser
      .save()
      .then((result) => {
        res
          .status(200)
          .send({ data: therapistUser, token: jwtToken, success: true });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Internal server error");
      });
  }
};

exports.getTherapist = async (req, res) => {
  const { id } = req;

  let user = await Therapist.findById(id);
  res.send(user);
};

exports.updateTherapist = async (req, res) => {
  const { id } = req;
  let {
    name,
    desc,
    phone,
    experience,
    expertise,
    qualifications,
    speaks,
    about,
  } = req.body;

  const response = await Therapist.updateOne(
    { _id: id },
    { name, desc, phone, experience, expertise, qualifications, speaks, about }
  );
  res.status(200).send(response);
};
