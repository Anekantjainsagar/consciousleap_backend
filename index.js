require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

const connect = require("./db/conn");

const login = require("./Routes/User/login");
const therapist = require("./Routes/Therapist/therapist");
const user = require("./Routes/User-things/user");
const consent = require("./Routes/User/consent");
const product = require("./Routes/product");

const https = require("https");
const fs = require("fs");

connect();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;
// Load SSL certificate and private key
const options = {
  // key: fs.readFileSync("/home/ec2-user/ssl/consciousleap.co/privkey1.pem"),
  // cert: fs.readFileSync("/home/ec2-user/ssl/consciousleap.co/fullchain1.pem"),
};

const httpsServer = https.createServer(options, app);

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.use("/api/login", login);
app.use("/api/user", user);
app.use("/api/product", product);
app.use("/api/consent", consent);
app.use("/api/therapist", therapist);

app.listen(port, () => {
  console.log(`App is listening on port ${process.env.PORT}`);
});
