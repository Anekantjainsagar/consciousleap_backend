const otpGenerator = require("otp-generator");
const Login = require("../../model/loginSchema");
const transporter = require("../../Routes/transporter");
const emailjs = require("@emailjs/nodejs");

exports.sendMail = async (req, res) => {
  let email = req.body.email;
  let name = req.body.name;
  email = email.toLowerCase();

  let data = await Login.findOne({ email });

  if (data) {
    res.status(202).send({ data: "Email Already Exists", success: false });
  } else {
    if (email) {
      const otp = otpGenerator.generate(4, {
        upperCaseAlphabets: false,
        specialChars: false,
        digits: true,
        lowerCaseAlphabets: false,
      });

      const info = await transporter.sendMail({
        from: '"Consciousleap" otp@consciousleap.co',
        to: email,
        subject: "Verification OTP from consciousleap",
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
          <p>Hi there, ${name}</p>
          <p style="padding: 10px 0">
            You have requested an OTP to login to your consciousleap account. If
            this was you, please input the code below to continue.
          </p>
          <h1 style="color: black; letter-spacing: 20px; font-size: 40px">
            ${otp}
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

      let sended = false;

      if (info.accepted.includes(email)) {
        sended = true;
      }
      res.status(200).send({
        data: "OTP sent successfully via Email. If not receiving email check spam folder",
        otp: otp,
        success: true,
        sended: sended,
      });
    } else {
      res
        .status(203)
        .json({ data: "Please enter a valid email", success: false });
    }
  }
};
