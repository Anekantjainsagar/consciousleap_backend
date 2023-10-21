require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

const connect = require("./db/conn");

const login = require("./Routes/User/login");
const therapist = require("./Routes/Therapist/therapist");
const fetch = require("fetch");

connect();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.use("/api/login", login);
app.use("/api/therapist", therapist);

app.post(`/`, async (req, res) => {
  fetch("https://zoom.us/oauth/token", {
    method: "POST",
    headers: {
      Authorization: "Basic 9LDDMolro2s9y5L0P9bQlOEdVZuEOEn0Q",
      Host: "zoom.us",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: JSON.stringify({
      grant_type: "authorization_code",
      code: "9LDDMolro2s9y5L0P9bQlOEdVZuEOEn0Q",
      redirect_uri: "https://anekantjainsagar.netlify.app/",
    }),
  })
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log("Error");
      console.log(err);
    });
});

app.listen(process.env.PORT, () => {
  console.log(`App is listening on port ${process.env.PORT}`);
});
