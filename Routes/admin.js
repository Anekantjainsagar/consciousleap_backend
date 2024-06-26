const express = require("express");
const admin = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../model/adminSchema");
const Blog = require("../model/blogSchema");
const Orders = require("../model/orderSchema");
const Login = require("../model/loginSchema");

admin.post(`/add`, async (req, res) => {
  let { email, password } = req.body;

  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);
  email = email.toLowerCase();

  const data = await Admin.findOne({ email });

  if (data) {
    res.status(203).json({ data: "Email Already Exists", success: false });
  } else {
    const loginObj = Admin({
      email,
      password,
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
});

// Blogs
admin.get("/get-blogs", async (req, res) => {
  const result = await Blog.find();
  res.status(200).send(result);
});

admin.post("/add-blog", async (req, res) => {
  const { title, description, image } = req.body;

  const blog = Blog({ title, description, image });
  blog
    .save()
    .then((resp) => {
      res.status(200).send(resp);
    })
    .catch((err) => {
      console.log(err);
    });
});

admin.post("/update-blog/:id", async (req, res) => {
  const { title, description, image } = req.body;
  const { id } = req.params;

  const response = await Blog.updateOne(
    { _id: id },
    { title, description, image }
  );
  res.status(200).send(response);
});

admin.post("/delete-blog/:id", async (req, res) => {
  const { id } = req.params;

  const response = await Blog.deleteOne({ _id: id });
  res.status(200).send(response);
});

// Like or Unlike a blog
admin.post("/toggle-like/:id", async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).send("Blog not found");
    }

    const index = blog.likes.indexOf(userId);
    if (index === -1) {
      blog.likes.push(userId);
    } else {
      blog.likes.splice(index, 1);
    }

    await blog.save();
    res.status(200).send(blog);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

// Add a comment to a blog
admin.post("/add-comment/:id", async (req, res) => {
  const { id } = req.params;
  const { text, postedBy } = req.body;

  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).send("Blog not found");
    }
    blog.comments.push({ text, postedBy });
    await blog.save();
    res.status(200).send(blog);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

// Orders post
admin.get("/get-orders", async (req, res) => {
  try {
    const response = await Orders.find().populate("user");
    res.send(response);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

module.exports = admin;
