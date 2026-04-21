const router = require("express").Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const Product = require("../models/Product");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const t = require("../utils/i18n");

const UPLOAD_DIR = path.join(__dirname, "../uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${req.params.id}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = [".jpg", ".jpeg", ".png"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error("Only JPG and PNG allowed"));
  },
});

router.get("/image/:filename", (req, res) => {
  const file = path.join(UPLOAD_DIR, req.params.filename);
  if (!fs.existsSync(file)) return res.status(404).json({ message: "Not found" });
  res.sendFile(file);
});

router.post("/:id/image", auth, admin, upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: t(req, "INVALID_DATA") });

  const existing = await Product.findById(req.params.id);
  if (existing?.image) {
    const old = path.join(UPLOAD_DIR, existing.image);
    if (fs.existsSync(old)) fs.unlinkSync(old);
  }

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { image: req.file.filename },
    { new: true }
  );

  if (!product) return res.status(404).json({ message: t(req, "NOT_FOUND") });

  await req.redis.flushAll();
  res.json(product);
});

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

  if (!product) {
    return res.status(404).json({ message: t(req, "NOT_FOUND") });
  }

  await req.redis.set(key, JSON.stringify(product), { EX: 120 });

  res.json(product);
});

router.post("/", auth, admin, async (req, res) => {
  const { title, category, description, price } = req.body;

  if (!title || !category || !description || !price) {
    return res.status(400).json({ message: t(req, "INVALID_DATA") });
  }

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

  if (!product) {
    return res.status(404).json({ message: t(req, "NOT_FOUND") });
  }

  await req.redis.flushAll();

  res.json(product);
});

router.delete("/:id", auth, admin, async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return res.status(404).json({ message: t(req, "NOT_FOUND") });
  }

  if (product.image) {
    const file = path.join(UPLOAD_DIR, product.image);
    if (fs.existsSync(file)) fs.unlinkSync(file);
  }

  await req.redis.flushAll();

  res.json({ message: "Deleted" });
});

module.exports = router;