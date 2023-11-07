const jwt = require("jsonwebtoken");

exports.validateSingin = (req, res, next) => {
  try {
    if (req.body.token) {
      const token = req.body.token;
      console.log(token);
      if (!token) {
        res.status(404).json({ success: false, data: "Cookie not found" });
        next();
      } else {
        jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
          if (err) {
            res.status(400).json({ success: false, data: "Invalid token" });
          }
          console.log(user);
          req.id = user?.user;
          next();
        });
      }
    }
  } catch (err) {
    res.status(500).send(err);
  }
  next();
};
