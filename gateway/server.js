const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
app.use(cors());

app.use("/auth", createProxyMiddleware({
  target: "http://auth-service:4000",
  changeOrigin: true,
}));

app.use("/users", createProxyMiddleware({
  target: "http://user-service:4001",
  changeOrigin: true,
}));

app.use("/products", createProxyMiddleware({
  target: "http://product-service:4002",
  changeOrigin: true,
}));

app.use("/orders", createProxyMiddleware({
  target: "http://order-service:4003",
  changeOrigin: true,
}));

app.listen(3000, () => console.log("Gateway running"));