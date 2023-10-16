require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

const connect = require("./db/conn");

const login = require("./Routes/User/login");
const therapist = require("./Routes/Therapist/therapist");

connect();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.use("/api/login", login);
app.use("/api/therapist", therapist);

app.listen(process.env.PORT, () => {
  console.log(`App is listening on port ${process.env.PORT}`);
});
