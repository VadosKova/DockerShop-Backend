const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("User service connected to MongoDB");
});

app.use("/", require("./routes/users"));

app.listen(4001, () => console.log("User service running"));