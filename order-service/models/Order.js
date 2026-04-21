const mongoose = require("mongoose");

module.exports = mongoose.model("Order", {
  userId: String,
  items: Array,
  status: {
    type: String,
    enum: ["Pending", "Paid", "Cancelled"],
    default: "Pending"
  }
});