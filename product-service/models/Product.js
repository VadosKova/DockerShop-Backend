const mongoose = require("mongoose");

module.exports = mongoose.model("Product", {
  title: String,
  title_uk: String,
  category: String,
  description: String,
  description_uk: String,
  price: Number,
});