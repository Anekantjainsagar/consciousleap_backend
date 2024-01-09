const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  date: {
    type: Date,
    default: Date.now(),
  },
});

const Blog = mongoose.model("Blogs", blogSchema);
module.exports = Blog;
