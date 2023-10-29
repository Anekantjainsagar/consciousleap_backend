const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");
const Login = require("../../model/loginSchema");
const emailjs = require("@emailjs/nodejs");

exports.sendMail = async (req, res) => {
  let email = req.body.email;
  email = email.toLowerCase();

  let data = await Login.findOne({ email });

  if (data) {
    res.status(202).send({ data: "Email Already Exists", success: false });
  } else {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    if (email) {
      const otp = otpGenerator.generate(4, {
        upperCaseAlphabets: false,
        specialChars: false,
        digits: true,
        lowerCaseAlphabets: false,
      });
      const result = await transporter.sendMail({
        to: email,
        subject: "Verify you login",
        html: `<p>Hello user,</p><p>Thank you for choosing consciousleap, Use this OTP to complete your Sign Up procedure and verify your account on consciousleap </p><p>Remember, Never share this OTP with anyone, not even if Tap Karo asks you..</p><p>${otp}</p><p>Regards,</p><p>Team consciousleap</p>`,
      });
      emailjs
        .send(
          "service_jdcafm3",
          "template_76co9rr",
          {
            email: email,
            otp: otp,
            name: "Anekant",
            from_name: "Consciousleap",
          },
          "ud6oI9829OBeCMz6O"
        )
        .then(
          function (response) {
            console.log("SUCCESS!", response.status, response.text);
          },
          function (error) {
            console.log("FAILED...", error);
          }
        );

      if (
        result.accepted.includes(email) ||
        result.accepted.includes(modifiedMail)
      ) {
        res.status(200).send({
          data: "OTP sended successfully via Email. If not receiving email check spam folder",
          otp: otp,
          success: true,
        });
      } else {
        res.status(203).send({
          data: "Internal Server Error",
          success: false,
        });
      }
    } else {
      res
        .status(203)
        .json({ data: "Please enter a valid email", success: false });
    }
  }
};
