const jwt = require("jsonwebtoken");
const t = require("../utils/i18n");

module.exports = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) return res.status(401).json({ message: t(req, "NO_TOKEN") });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: t(req, "INVALID_TOKEN") });

    req.user = user;
    next();
  });
};