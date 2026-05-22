const express = require("express");
const rateLimit = require("express-rate-limit");
const { login } = require("../services/authService");

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login attempts. Try again later." },
});

router.post("/login", loginLimiter, (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const result = login(email, password);
  if (!result) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  return res.json({
    token: result.token,
    user: result.user,
  });
});

module.exports = router;
