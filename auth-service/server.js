const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const User = require("./models/User");
const bcrypt = require("bcrypt");

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const adminExists = await User.findOne({ email: "admin@gmail.com" });
  if (!adminExists) {
    const hashed = await bcrypt.hash("1234", 10);
    await User.create({
      name: "Admin",
      email: "admin@gmail.com",
      password: hashed,
      role: "admin"
    });
    console.log("Admin created");
  }
});
app.use("/", require("./routes/auth"));

app.listen(4000, () => console.log("Auth service running"));