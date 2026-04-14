const router = require("express").Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

router.get("/me", auth, admin, (req, res) => {
  res.json(req.user);
});

module.exports = router;