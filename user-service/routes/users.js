const router = require("express").Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const mongoose = require("mongoose");

const User = mongoose.model("User", new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: "customer" }
}), "users");

router.get("/me", auth, (req, res) => {
  res.json(req.user);
});

router.get("/", auth, admin, async (req, res) => {
  const users = await User.find({}, "-password");
  res.json(users);
});

router.put("/:id/role", auth, admin, async (req, res) => {
  const { role } = req.body;
  if (!["admin", "customer"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }
  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

module.exports = router;