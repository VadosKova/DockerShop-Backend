const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/", require("./routes/users"));

app.listen(4001, () => console.log("User service running"));