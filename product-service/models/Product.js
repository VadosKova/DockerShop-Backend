const mongoose = require("mongoose");

module.exports = mongoose.model("Product", {
  title: String,
  category: String,
  description: String,
  price: Number,
});