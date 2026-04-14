const t = require("../utils/i18n");

module.exports = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: t(req, "ADMIN_ONLY") });
  }
  next();
};