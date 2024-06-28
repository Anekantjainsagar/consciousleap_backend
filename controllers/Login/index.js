const Login = require("../../model/loginSchema");
const Therapist = require("../../model/therapistSchema");
const Admin = require("../../model/adminSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const transporter = require("../../Routes/transporter");
var pdf = require("html-pdf");

exports.signUp = async (req, res) => {
  let { name, email, password, phone } = req.body;

  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);
  email = email.toLowerCase();

  const data = await Login.findOne({ email });

  if (data) {
    res.status(203).json({ data: "Email Already Exists", success: false });
  } else {
    const loginObj = Login({
      email,
      name,
      password,
      phone,
    });
    const jwtToken = jwt.sign(
      {
        user: loginObj._id,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "1d",
      }
    );
    loginObj
      .save()
      .then((result) => {
        res
          .status(200)
          .send({ data: loginObj, token: jwtToken, success: true });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Internal server error");
      });
  }
};

exports.signInUser = async (req, res) => {
  let { email, password } = req.body;
  email = email.toLowerCase();

  let data = await Login.findOne({ email });

  if (data) {
    const matched = await bcrypt.compare(password, data.password);

    if (matched) {
      const jwtToken = jwt.sign(
        {
          user: data._id,
        },
        process.env.SECRET_KEY,
        {
          expiresIn: "1d",
        }
      );
      res.status(200).send({ jwtToken, user: "User" });
    } else {
      res.status(203).json({ data: "Invalid credentials", success: false });
    }
  } else {
    data = await Therapist.findOne({ email });
    if (data) {
      const matched = await bcrypt.compare(password, data.password);

      if (matched) {
        const jwtToken = jwt.sign(
          {
            user: data._id,
          },
          process.env.SECRET_KEY,
          {
            expiresIn: "1d",
          }
        );
        res.status(200).send({ jwtToken, user: "Therapist" });
      } else {
        res.status(203).json({ data: "Invalid credentials", success: false });
      }
    } else {
      data = await Admin.findOne({ email });
      if (data) {
        const matched = await bcrypt.compare(password, data.password);

        if (matched) {
          const jwtToken = jwt.sign(
            {
              user: data._id,
            },
            process.env.SECRET_KEY,
            {
              expiresIn: "1d",
            }
          );
          res.status(200).send({ jwtToken, user: "Admin" });
        } else {
          res.status(203).json({ data: "Invalid credentials", success: false });
        }
      } else {
        res.status(203).json({ data: "Invalid credentials", success: false });
      }
    }
  }
};

exports.getUser = async (req, res) => {
  const { id } = req;

  let user = await Login.findById(id);
  res.send(user);
};

exports.updateUser = async (req, res) => {
  const { id } = req;
  let { name, email, phone } = req.body;

  const response = await Login.updateOne({ _id: id }, { name, email, phone });
  res.status(200).send(response);
};

exports.deleteQuestionnaire = async function (req, res) {
  let { id } = req;

  let questionnaire = { age: "", problem: "", answers: [], backendAnswers: [] };

  Login.updateOne({ _id: id }, { questionnaire })
    .then((response) => {
      res.send(response);
    })
    .catch((err) => {
      console.log(err);
    });
};

const generatePDFAndSendEmail = async (
  html,
  user_data,
  id,
  questionnaire,
  res
) => {
  try {
    const pdfPath = `./${user_data?._id}Questionnaire Report.pdf`;

    pdf
      .create(html, {
        childProcessOptions: {
          env: {
            OPENSSL_CONF: "/dev/null",
          },
        },
      })
      .toFile(pdfPath, async (err, resul) => {
        if (err) {
          console.error("Error generating PDF:", err);
          return res.status(500).send("Error generating PDF");
        }

        if (resul.filename) {
          try {
            const result = await transporter.sendMail({
              to: user_data?.email,
              subject: `Questionnaire report from consciousleap`,
              text: `
            Dear ${user_data?.name},
            Confident you're doing well...!

            If you have any questions or require further clarification, please do not hesitate to reach out to consciousleap.co.

            Best
            Team consciousleap.`,
              attachments: [
                {
                  filename: "Questionnaire Report.pdf",
                  path: pdfPath,
                },
              ],
            });

            res.send(questionnaire);
          } catch (emailErr) {
            console.error("Error sending email:", emailErr);
            res.status(500).send("Error sending email");
          }
        }
      });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).send("Unexpected error");
  }
};

exports.updateQuestionnaire = async (req, res) => {
  let { age, problem, answers } = req.body;
  let { id } = req;

  console.log("Questionnaire analysis requested");

  let enviromental = parseInt(
    ((answers[0] + answers[1] + answers[2] + answers[3]) / 28) * 100
  );
  let purposeOfLife = parseInt(
    ((answers[4] + answers[5] + answers[6]) / 21) * 100
  );
  let selfAcceptance = parseInt(
    ((answers[7] + answers[8] + answers[9]) / 21) * 100
  );
  let positiveRelation = parseInt(
    ((answers[10] + answers[11] + answers[12]) / 21) * 100
  );

  let backendAnswers = [
    { value: enviromental },
    { value: purposeOfLife },
    { value: selfAcceptance },
    { value: positiveRelation },
  ];

  // Enviromental
  if (enviromental <= 30) {
    backendAnswers[0].text =
      "You have difficulty managing everyday affairs; feel unable to change or improve surrounding contexts; are unaware of surrounding opportunities; and lack a sense of control over the external world.";
  } else if (enviromental > 30 && enviromental <= 50) {
    backendAnswers[0].text =
      "You are in the process of discovering your sense of purpose and creating meaningful goals for yourself. While you may have felt directionless in the past, you are now exploring different outlooks and beliefs that bring a sense of fulfillment and purpose to your life.";
  } else if (enviromental > 50 && enviromental <= 70) {
    backendAnswers[0].text =
      "You have a good sense of mastery & competence in managing environment; control complex external activities; make effective use of surrounding opportunities";
  } else {
    backendAnswers[0].text =
      "You have a high sense of mastery & competence in managing environment; control complex external activities; make effective use of surrounding opportunities";
  }

  // purposeOfLife
  if (purposeOfLife <= 30) {
    backendAnswers[1].text =
      "You lack a sense of meaning in life; have few goals or aims, lack a sense of direction; do not see purpose of your past life; and have no outlook or beliefs that give life meaning.";
  } else if (purposeOfLife > 30 && purposeOfLife <= 50) {
    backendAnswers[1].text =
      "You are in the process of discovering your sense of purpose and creating meaningful goals for yourself. While you may have felt directionless in the past, you are now exploring different outlooks and beliefs that bring a sense of fulfillment and purpose to your life.";
  } else if (purposeOfLife > 50 && purposeOfLife <= 70) {
    backendAnswers[1].text =
      "You depict good sense of directedness; feel there is meaning to your present and past life; hold beliefs that give life purpose; and have aims and objectives for living.";
  } else {
    backendAnswers[1].text =
      "You depict high sense of directedness; feel there is meaning to your present and past life; hold beliefs that give life purpose; and have aims and objectives for living.";
  }

  // selfAcceptance
  if (selfAcceptance <= 30) {
    backendAnswers[2].text =
      "You feel dissatisfied with yourself; are disappointed with what has occurred in your past life; are troubled about certain personal qualities; and wish to be different than what you are.";
  } else if (selfAcceptance > 30 && selfAcceptance <= 50) {
    backendAnswers[2].text =
      "You possess a low level of self-awareness and are actively working towards personal growth and development. While acknowledging your past experiences and personal traits, you strive to improve and become the best version of yourself. You are motivated and optimistic about the potential for positive change in your life.";
  } else if (selfAcceptance > 50 && selfAcceptance <= 70) {
    backendAnswers[2].text =
      "You possess a positive attitude toward yourself; acknowledge and accept multiple aspects of yourself including both good and bad qualities; and feel positive about your past life.";
  } else {
    backendAnswers[2].text =
      "You possess a highly positive attitude toward yourself; acknowledge and accept multiple aspects of yourself including both good and bad qualities; and feel positive about your past life.";
  }

  // positiveRelation
  if (positiveRelation <= 30) {
    backendAnswers[3].text =
      "You have few close, trusting relationships with others; find it difficult to be warm, open, and concerned about others; are isolated and frustrated in interpersonal relationships.";
  } else if (positiveRelation > 30 && positiveRelation <= 50) {
    backendAnswers[3].text =
      "You cherish your close relationships and are working towards improving your ability to show warmth, openness, and concern towards others. While feeling some isolation and frustration in interpersonal relationships, you remain hopeful and committed to building fulfilling connections with others.";
  } else if (positiveRelation > 50 && positiveRelation <= 70) {
    backendAnswers[3].text =
      "You have warm, satisfying, trusting relationships with others; are concerned about the welfare of others; are capable of strong empathy, affection, and intimacy; and understand the give and take of human relationships.";
  } else {
    backendAnswers[3].text =
      "You have very warm, satisfying, trusting relationships with others; are concerned about the welfare of others; are capable of strong empathy, affection, and intimacy; and understand the give and take of human relationships.";
  }

  let questionnaire = { age, problem, answers, backendAnswers };

  console.log("Questionnaire analysis calculated");

  await Login.updateOne({ _id: id }, { questionnaire });
  const user_data = await Login.findOne({ _id: id });

  const html = `<html>
  <body
    style="
      font-family: Verdana, Geneva, Tahoma, sans-serif;
      margin: 0;
      padding: 20px 0;
      width: 85%;
      margin: auto;
    "
  >
    <h1
      class="element"
      style="color: #4961ac; font-weight: 500; text-align: center"
    >
      Initial Analysis
    </h1>
    <div
      class="line"
      style="height: 1px; background-color: black; margin: 15px 0"
    ></div>
    <div>
      <table
        width="100%"
        style="
          padding: 10px;
          border-radius: 100px;
          border: 2px solid #4961ac;
          margin-bottom: 20px;
        "
      >
        <tr>
          <th width="10%">
            <img
              src="https://res.cloudinary.com/dpbsogbtr/image/upload/v1719560041/ary1p9pkmebmvlnvqf77.png"
              alt="Image"
              style="width: 20vw"
            />
          </th>
          <th width="80%" style="margin-left: 15px">
            <h4
              style="
                font-size: 24px;
                margin: 0;
                font-weight: 500;
                color: #4961ac;
                text-align: start;
              "
            >
              Enviromental Mastery (${backendAnswers[0].value}%)
            </h4>
            <p
              style="
                margin: 0;
                font-size: 14px;
                font-weight: 400;
                color: #777777;
                text-align: start;
              "
            >
              ${backendAnswers[0].text}
            </p>
          </th>
        </tr>
      </table>
      <table
        width="100%"
        style="
          padding: 10px;
          border-radius: 100px;
          border: 2px solid #4961ac;
          margin-bottom: 20px;
        "
      >
        <tr>
          <th width="10%">
            <img
              src="https://res.cloudinary.com/dpbsogbtr/image/upload/v1719560621/cfv0gfoggbshj05iwhhf.png"
              alt="Image"
              style="width: 20vw"
            />
          </th>
          <th width="80%" style="margin-left: 15px">
            <h4
              style="
                font-size: 24px;
                margin: 0;
                font-weight: 500;
                color: #4961ac;
                text-align: start;
              "
            >
              Purpose In Life (${backendAnswers[1].value}%)
            </h4>
            <p
              style="
                margin: 0;
                font-size: 14px;
                font-weight: 400;
                color: #777777;
                text-align: start;
              "
            >
              ${backendAnswers[1].text}
            </p>
          </th>
        </tr>
      </table>
      <table
        width="100%"
        style="
          padding: 10px;
          border-radius: 100px;
          border: 2px solid #4961ac;
          margin-bottom: 20px;
        "
      >
        <tr>
          <th width="10%">
            <img
              src="https://res.cloudinary.com/dpbsogbtr/image/upload/v1719560652/chwws3rmwauw34ay7zph.png"
              alt="Image"
              style="width: 20vw"
            />
          </th>
          <th width="80%" style="margin-left: 15px">
            <h4
              style="
                font-size: 24px;
                margin: 0;
                font-weight: 500;
                color: #4961ac;
                text-align: start;
              "
            >
              Self Acceptance (${backendAnswers[2].value}%)
            </h4>
            <p
              style="
                margin: 0;
                font-size: 14px;
                font-weight: 400;
                color: #777777;
                text-align: start;
              "
            >
              ${backendAnswers[2].text}
            </p>
          </th>
        </tr>
      </table>
      <table
        width="100%"
        style="padding: 10px; border-radius: 100px; border: 2px solid #4961ac"
      >
        <tr>
          <th width="10%">
            <img
              src="https://res.cloudinary.com/dpbsogbtr/image/upload/v1719560677/xpixafdugyxxhphaby7y.png"
              alt="Image"
              style="width: 20vw"
            />
          </th>
          <th width="80%" style="margin-left: 15px">
            <h4
              style="
                font-size: 24px;
                margin: 0;
                font-weight: 500;
                color: #4961ac;
                text-align: start;
              "
            >
              Relations with Others (${backendAnswers[3].value}%)
            </h4>
            <p
              style="
                margin: 0;
                font-size: 14px;
                font-weight: 400;
                color: #777777;
                text-align: start;
              "
            >
              ${backendAnswers[3].text}
            </p>
          </th>
        </tr>
      </table>
    </div>
    <div
      class="desc"
      style="
        padding-top: 10px;
        text-align: center;
        font-size: 14px;
        color: #777777;
      "
    >
      Disclaimer: This questionnaire is intended to provide a general assessment
      of mental health and should not be considered a substitute for
      professional evaluation or advice.The results of this questionnaire are
      based solely on the provided responses and should be interpreted with
      caution.It is important to consult with a qualified mental health
      professional for assessment and personalized guidance.
    </div>
  </body>
</html>
`;

  generatePDFAndSendEmail(html, user_data, id, questionnaire, res);
};
