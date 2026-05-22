const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");

const testDbPath = path.join(__dirname, "..", "data", "test-tx-service.db");

process.env.NODE_ENV = "test";
process.env.DATABASE_PATH = testDbPath;
process.env.JWT_SECRET = "test-jwt-secret-with-enough-length";

const { getDb, closeDb } = require("../src/db");
const {
  listTransactions,
  updateStatus,
} = require("../src/services/transactionService");

function seed() {
  if (fs.existsSync(testDbPath)) fs.unlinkSync(testDbPath);
  const db = getDb();
  const hash = bcrypt.hashSync("x", 4);
  const user = db
    .prepare(
      `INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)`
    )
    .run("a@test.com", hash, "Analyst One");
  const insertTx = db.prepare(
    `INSERT INTO transactions (external_id, amount, merchant, status, created_at)
     VALUES (?, ?, ?, 'pending', datetime('now', ?))`
  );
  for (let i = 0; i < 55; i += 1) {
    insertTx.run(`ACC-${i}`, 10 + i, "M", `-${i} hours`);
  }
  return user.lastInsertRowid;
}

let userId;

beforeAll(() => {
  userId = seed();
});

afterAll(() => {
  closeDb();
  if (fs.existsSync(testDbPath)) fs.unlinkSync(testDbPath);
});

describe("transactionService.listTransactions", () => {
  test("returns max 50 per page ordered newest first", () => {
    const page1 = listTransactions(1);
    expect(page1.data).toHaveLength(50);
    expect(page1.pagination.limit).toBe(50);
    const dates = page1.data.map((t) => t.createdAt);
    const sorted = [...dates].sort().reverse();
    expect(dates).toEqual(sorted);
  });

  test("caps page beyond totalPages", () => {
    const result = listTransactions(999);
    expect(result.pagination.page).toBe(2);
    expect(result.data.length).toBeGreaterThan(0);
  });
});

describe("transactionService.updateStatus", () => {
  test("accepts legitimate and writes audit", () => {
    const tx = listTransactions(1).data[0];
    const updated = updateStatus(tx.id, "legitimate", {
      id: userId,
      email: "a@test.com",
    });
    expect(updated.status).toBe("legitimate");
    const db = getDb();
    const audit = db
      .prepare(
        `SELECT * FROM audit_log WHERE transaction_id = ? ORDER BY id DESC LIMIT 1`
      )
      .get(tx.id);
    expect(audit).toBeTruthy();
    expect(audit.new_status).toBe("legitimate");
  });

  test("rejects invalid status values", () => {
    const tx = listTransactions(1).data[1];
    expect(() =>
      updateStatus(tx.id, "FRAUD", { id: userId, email: "a@test.com" })
    ).toThrow();
    expect(() =>
      updateStatus(tx.id, "", { id: userId, email: "a@test.com" })
    ).toThrow();
    expect(() =>
      updateStatus(tx.id, null, { id: userId, email: "a@test.com" })
    ).toThrow();
  });
});
