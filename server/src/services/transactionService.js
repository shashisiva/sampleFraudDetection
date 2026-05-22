const config = require("../config");
const { getDb } = require("../db");

function mapTransaction(row) {
  return {
    id: row.id,
    externalId: row.external_id,
    amount: row.amount,
    currency: row.currency,
    merchant: row.merchant,
    status: row.status,
    createdAt: row.created_at,
  };
}

function listTransactions(page = 1) {
  const limit = config.pageSize;

  const db = getDb();
  const total = db
    .prepare(`SELECT COUNT(*) AS count FROM transactions`)
    .get().count;

  const totalPages = Math.ceil(total / limit) || 1;
  const safePage = Math.min(Math.max(1, Number(page) || 1), totalPages);
  const offset = (safePage - 1) * limit;

  const rows = db
    .prepare(
      `SELECT id, external_id, amount, currency, merchant, status, created_at
       FROM transactions
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`
    )
    .all(limit, offset);

  return {
    data: rows.map(mapTransaction),
    pagination: {
      page: safePage,
      limit,
      total,
      totalPages,
    },
  };
}

function getTransactionById(id) {
  const row = getDb()
    .prepare(
      `SELECT id, external_id, amount, currency, merchant, status, created_at
       FROM transactions WHERE id = ?`
    )
    .get(id);
  return row ? mapTransaction(row) : null;
}

function updateStatus(transactionId, newStatus, user) {
  const allowed = ["fraud", "legitimate"];
  if (newStatus == null || typeof newStatus !== "string") {
    const err = new Error('Status must be "fraud" or "legitimate"');
    err.status = 400;
    throw err;
  }
  const trimmed = newStatus.trim();
  if (trimmed === "" || !allowed.includes(trimmed)) {
    const err = new Error('Status must be "fraud" or "legitimate"');
    err.status = 400;
    throw err;
  }
  newStatus = trimmed;

  const db = getDb();
  const existing = db
    .prepare(`SELECT id, status FROM transactions WHERE id = ?`)
    .get(transactionId);

  if (!existing) {
    const err = new Error("Transaction not found");
    err.status = 404;
    throw err;
  }

  const action =
    newStatus === "fraud" ? "marked_fraud" : "marked_legitimate";

  const update = db.transaction(() => {
    db.prepare(
      `UPDATE transactions SET status = ? WHERE id = ?`
    ).run(newStatus, transactionId);

    db.prepare(
      `INSERT INTO audit_log
        (transaction_id, user_id, user_email, action, previous_status, new_status)
       VALUES (?, ?, ?, ?, ?, ?)`
    ).run(
      transactionId,
      user.id,
      user.email,
      action,
      existing.status,
      newStatus
    );
  });

  update();
  return getTransactionById(transactionId);
}

module.exports = { listTransactions, getTransactionById, updateStatus };
