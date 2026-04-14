const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const t = require("../utils/i18n");


router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: t(req, "INVALID_DATA") });
  }

  const existing = await User.findOne({ email });

  if (existing) {
    return res.status(400).json({ message: t(req, "USER_EXISTS") });
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    ...req.body,
    password: hashed
  });

  res.json(user);
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(400).json({ message: t(req, "USER_NOT_FOUND") });
  }

  const valid = await bcrypt.compare(req.body.password, user.password);

  if (!valid) {
    return res.status(400).json({ message: t(req, "WRONG_PASSWORD") });
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET
  );

  res.json({ token });
});

module.exports = router;