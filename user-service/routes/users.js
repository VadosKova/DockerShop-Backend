const router = require("express").Router();
const auth = require("../middleware/auth");

router.get("/me", auth, (req, res) => {
  res.json(req.user);
});

module.exports = router;