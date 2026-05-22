const { getDb } = require("../db");

function getHistory(transactionId) {
  const db = getDb();
  const tx = db
    .prepare(`SELECT id FROM transactions WHERE id = ?`)
    .get(transactionId);

  if (!tx) {
    const err = new Error("Transaction not found");
    err.status = 404;
    throw err;
  }

  const rows = db
    .prepare(
      `SELECT a.id, a.transaction_id, a.user_id, a.user_email, a.action,
              a.previous_status, a.new_status, a.created_at, u.name AS marked_by_name
       FROM audit_log a
       LEFT JOIN users u ON u.id = a.user_id
       WHERE a.transaction_id = ?
       ORDER BY a.created_at DESC, a.id DESC`
    )
    .all(transactionId);

  return rows.map((row) => ({
    id: row.id,
    transactionId: row.transaction_id,
    userId: row.user_id,
    userEmail: row.user_email,
    markedBy: row.marked_by_name || row.user_email,
    action: row.action,
    previousStatus: row.previous_status,
    newStatus: row.new_status,
    createdAt: row.created_at,
  }));
}

module.exports = { getHistory };
