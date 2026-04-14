const router = require("express").Router();
const Order = require("../models/Order");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const sendEvent = require("../rabbit");


router.post("/", auth, async (req, res) => {
  const order = await Order.create({
    userId: req.user.id,
    items: req.body.items
  });

  await sendEvent({
    type: "order.created",
    orderId: order._id,
    userId: req.user.id
  });

  res.json(order);
});

router.get("/my", auth, async (req, res) => {
  const orders = await Order.find({ userId: req.user.id });
  res.json(orders);
});

router.get("/", auth, admin, async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
});

router.put("/:id/status", auth, admin, async (req, res) => {
  const { status } = req.body;

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  await sendEvent({
    type: "order.status",
    orderId: order._id,
    status
  });

  res.json(order);
});

module.exports = router;