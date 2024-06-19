const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const Login = require("../../model/loginSchema");
const bcrypt = require("bcryptjs");
const transporter = require('../../Routes/transporter')

exports.sendUrl = async (req, res) => {
  const email = req.body.email;
  const modifiedMail = email.toLowerCase();

  let data = await Login.findOne({ email: modifiedMail });
  if (data) {
    const jwtToken = jwt.sign(
      {
        user: data._id,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "1hr",
      }
    );
    const uri = `${"https://consciousleap.co"}/user/password-reset/${
      data._id
    }/${jwtToken}`;

    const info = await transporter.sendMail({
      from: '"Consciousleap" otp@consciousleap.co',
      to: email,
      subject: "Password reset for consciousleap",
      text: "Welcome to Consciousleap",
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
        <div>
          <img
            src="https://res.cloudinary.com/dpbsogbtr/image/upload/v1718777961/pcxxnb6ngla25q2z16dy.png"
            alt="Consciousleap"
            style="width: 25vw"
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
          <p>Hi there, ${data?.name}</p>
          <p style="padding: 10px 0">
            You are about to reset your password for consciousleap. Please click
            on the button below to reset your password.
          </p>
          <a
            href=${uri}
            style="
              background: #4e66ad;
              color: white;
              padding: 10px 25px;
              border-radius: 10px;
              text-decoration: none;
              font-size: 16px;
              font-weight: 600;
            "
          >
            Click here to reset your password!
          </a>
          <p style="padding: 10px 0">
            Something amiss? You can always contact us for any assistance!
          </p>
          <div style="height: 1px; background: rgba(0, 0, 0, 0.4)"></div>
          <p style="padding-top: 15px; font-weight: 600">Best Wishes,</p>
          <p style="font-weight: 600">Oneness</p>
          <p style="font-weight: 600">consciousleap.co</p>
        </div>
      </div>
    </div>
  </body>
</html>

`,
    });

    let sended = false;

    if (info.accepted.includes(email)) {
      sended = true;
    }

    res.status(200).send({
      data: "Password reset link sent to your email account. If not received check spam folder once.",
      url: uri,
      user: data,
      sended,
    });
  } else {
    res.status(203).json({ data: "User not found", success: false });
  }
};

exports.verifyUrl = async (req, res) => {
  const { id, token } = req.params;

  if (!token) {
    res.status(404).json({ success: false, data: "Cookie not found" });
  } else {
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
      if (err) {
        res.status(203).json({ success: false, data: "Invalid Url" });
      } else if (user?.user === id) {
        res.status(200).json({ success: true, data: "Url verified" });
      } else {
        res.status(203).json({ success: false, data: "Invalid Url" });
      }
    });
  }
};

exports.resetPassword = async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  const data = await Login.findById(id);
  if (data) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const response = await Login.updateOne(
      { _id: id },
      { password: hashedPassword }
    );
    res.status(200).json({ data: data, success: true });
  }
};
