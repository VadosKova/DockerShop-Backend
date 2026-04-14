const router = require("express").Router();
const Product = require("../models/Product");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");


router.get("/", async (req, res) => {
  const { category, search } = req.query;

  const cacheKey = `products:${category || "all"}:${search || ""}`;
  const cached = await req.redis.get(cacheKey);

  if (cached) return res.json(JSON.parse(cached));

  let query = {};

  if (category) query.category = category;
  if (search) query.title = { $regex: search, $options: "i" };

  const products = await Product.find(query);

  await req.redis.set(cacheKey, JSON.stringify(products), { EX: 120 });

  res.json(products);
});

router.get("/:id", async (req, res) => {
  const key = `product:${req.params.id}`;
  const cached = await req.redis.get(key);

  if (cached) return res.json(JSON.parse(cached));

  const product = await Product.findById(req.params.id);

  if (!product) return res.status(404).json({ message: "Not found" });

  await req.redis.set(key, JSON.stringify(product), { EX: 120 });

  res.json(product);
});

router.post("/", auth, admin, async (req, res) => {
  const product = await Product.create(req.body);

  await req.redis.flushAll();

  res.json(product);
});

router.put("/:id", auth, admin, async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  await req.redis.flushAll();

  res.json(product);
});

router.delete("/:id", auth, admin, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);

  await req.redis.flushAll();

  res.json({ message: "Deleted" });
});

module.exports = router;