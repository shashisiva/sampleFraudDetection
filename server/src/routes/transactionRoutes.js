const express = require("express");
const { requireAuth } = require("../middleware/requireAuth");
const {
  listTransactions,
  updateStatus,
} = require("../services/transactionService");
const { getHistory } = require("../services/auditService");

const router = express.Router();

router.use(requireAuth);

router.get("/", (req, res) => {
  const page = Number(req.query.page) || 1;
  const result = listTransactions(page);
  return res.json(result);
});

router.patch("/:id/status", (req, res) => {
  const id = Number(req.params.id);
  const body = req.body || {};

  if (!Object.prototype.hasOwnProperty.call(body, "status")) {
    return res.status(400).json({ error: "status is required" });
  }

  const { status } = body;

  try {
    const updated = updateStatus(id, status, req.user);
    return res.json(updated);
  } catch (err) {
    const code = err.status || 500;
    return res.status(code).json({ error: err.message });
  }
});

router.get("/:id/history", (req, res) => {
  const id = Number(req.params.id);

  try {
    const history = getHistory(id);
    return res.json({ transactionId: id, history });
  } catch (err) {
    const code = err.status || 500;
    return res.status(code).json({ error: err.message });
  }
});

module.exports = router;
