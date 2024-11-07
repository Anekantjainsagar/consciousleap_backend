const nodemailer = require("nodemailer");
const Therapist = require("../../model/therapistSchema");

exports.sendMail = async (req, res) => {
  let email = req.body.email;
  email = email.toLowerCase();
  const { name, phone, experience, desc, resume } = req.body;

  let data = await Therapist.findOne({ email });

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
      const result = await transporter.sendMail({
        to: ["hr@consciousleap.co", "anekant.jain.consciousleap@gmail.com"],
        subject: "New Therapist Application",
        html: `<p>Hello Hr,</p><p>We've got a new therapist application at consciousleap </p><p>Name: ${name}</p><p>Phone Number: ${phone}</p><p>Email ID: ${email}</p><p>Experience in Years: ${experience}</p><p>Experience Description: ${desc}</p><p>Resume Link: ${resume}</p><p>Regards,</p><p>Team consciousleap</p>`,
      });

      if (
        result.accepted.includes(email) ||
        result.accepted.includes(modifiedMail)
      ) {
        res.status(200).send({
          data: "Application Sent",
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
