  const mongoose = require("mongoose");

  const blogSchema = new mongoose.Schema({
    title: String,
    description: String,
    image: String,
    date: {
      type: Date,
      default: Date.now(),
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users", 
      },
    ],
    comments: [
      {
        text: String,
        postedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Users",
        },
        date: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
  });

  const Blog = mongoose.model("Blogs", blogSchema);
  module.exports = Blog;
