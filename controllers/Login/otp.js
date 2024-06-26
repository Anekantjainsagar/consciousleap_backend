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
      body {
        margin: 0;
        padding: 0;
      }
      .container {
        background: rgb(78, 102, 173);
        padding: 70px 100px;
        background: linear-gradient(
          125deg,
          rgba(78, 102, 173, 0.5) 0%,
          rgba(255, 204, 214, 0.5) 50%,
          rgba(125, 207, 205, 0.5) 100%
        );
      }
      .logo img {
        width: 25vw;
      }
      .content {
        background-color: white;
        margin: 0 5px;
        border-radius: 12px;
        margin-top: 15px;
        padding: 15px 45px;
        color: #4e66ad;
        font-weight: 400;
        font-size: 18px;
      }
      .otp {
        color: black;
        letter-spacing: 20px;
        font-size: 40px;
      }
      .divider {
        height: 1px;
        background: rgba(0, 0, 0, 0.4);
      }
      .footer {
        padding-top: 15px;
        font-weight: 600;
      }
      .para {
        padding: 10px 0;
      }
      .hoverClass {
        background: linear-gradient(to right, #4961ac, #f2685d, #4ec1ba);
        background-clip: text;
        -webkit-background-clip: text;
        color: transparent;
        width: fit-content;
        margin: auto;
      }
      @media (max-width: 600px) {
        .container {
          padding: 30px 20px;
        }
        .content {
          padding: 7px 25px;
          font-size: 16px;
        }
        .otp {
          color: black;
          letter-spacing: 12px;
          font-size: 30px;
        }
        .footer {
          padding-top: 5px;
        }
        .para {
          padding: 3px 0;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="logo">
        <h1 class="hoverClass">consciousleap</h1>
      </div>
      <div class="content">
        <p>Hi there, ${name}</p>
        <p class="para">
          You have requested an OTP to login to your consciousleap account. If
          this was you, please input the code below to continue.
        </p>
        <h1 class="otp">${otp}</h1>
        <p class="para">Don’t share this OTP with anyone.</p>
        <p class="para">
          Something amiss? You can always contact us for any assistance!
        </p>
        <div class="divider"></div>
        <p class="footer">See you soon,</p>
        <p class="footer">consciousleap.co</p>
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
