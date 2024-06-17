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
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

login.post("/send-test-mail", async (req, res) => {
  let email = req.body.email;

  const info = await transporter.sendMail({
    from: '"Maddison Foo Koch 👻" scarlett.sawayn@ethereal.email',
    to: email,
    subject: "Hello ✔",
    text: "Hello world?",
    html: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      * {
        font-family: Verdana, Geneva, Tahoma, sans-serif;
      }
    </style>
  </head>
  <body style="margin: 0; padding: 0">
    <div
      style="
        background: rgb(78, 102, 173);
        padding: 70px 100px;
        background: linear-gradient(
          125deg,
          rgba(78, 102, 173, 0.5) 0%,
          rgba(255, 204, 214, 0.5) 50%,
          rgba(125, 207, 205, 0.5) 100%
        );
      "
    >
      <div>
        <div
          style="
            display: flex;
            align-items: center;
            justify-content: space-between;
          "
        >
          <img
            src="https://res.cloudinary.com/dpbsogbtr/image/upload/v1718605608/tjy89t4q8snlcve2ppqc.png"
            alt="Consciousleap"
            style="margin-left: -30px"
          />
          <img
            src="https://res.cloudinary.com/dpbsogbtr/image/upload/v1718605702/cq9njyqqqugtakbtjbd1.png"
            alt="Consciousleap"
          />
        </div>
        <div
          style="
            background-color: white;
            margin: 0 5px;
            border-radius: 12px;
            margin-top: 15px;
            padding: 15px 45px;
            color: #4e66ad;
            font-weight: 400;
            font-size: 18px;
          "
        >
          <p>Hi there, Anekant Jain</p>
          <p style="padding: 10px 0">
            You have requested an OTP to login to your consciousleap account. If
            this was you, please input the code below to continue.
          </p>
          <h1 style="color: black; letter-spacing: 20px; font-size: 40px">
            550088
          </h1>
          <p style="padding: 10px 0">Don’t share this OTP with anyone.</p>
          <p style="padding: 10px 0">
            Something amiss? You can always contact us for any assistance!
          </p>
          <div style="height: 1px; background: rgba(0, 0, 0, 0.4)"></div>
          <p style="padding-top: 15px; font-weight: 600">See you soon,</p>
          <p style="font-weight: 600">consciousleap.co</p>
        </div>
      </div>
    </div>
  </body>
</html>
`,
  });

  res.status(200).send(info.messageId);
});

module.exports = login;
