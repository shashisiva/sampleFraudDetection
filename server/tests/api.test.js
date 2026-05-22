const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");
const request = require("supertest");

const testDbPath = path.join(__dirname, "..", "data", "test-fraud.db");

process.env.NODE_ENV = "test";
process.env.DATABASE_PATH = testDbPath;
process.env.JWT_SECRET = "test-jwt-secret-with-enough-length";
process.env.CORS_ORIGIN = "http://localhost:3000";
process.env.DEMO_ANALYST_EMAIL = "analyst@globalbank.com";
process.env.DEMO_ANALYST_PASSWORD = "analyst123";

const { getDb, closeDb } = require("../src/db");
const { createApp } = require("../src/app");

function seedTestData() {
  if (fs.existsSync(testDbPath)) fs.unlinkSync(testDbPath);
  const db = getDb();

  const hash = bcrypt.hashSync("analyst123", 4);
  db.prepare(
    `INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)`
  ).run("analyst@globalbank.com", hash, "Test Analyst");

  const insertTx = db.prepare(
    `INSERT INTO transactions (external_id, amount, merchant, status, created_at)
     VALUES (?, ?, ?, 'pending', datetime('now', ?))`
  );

  for (let i = 0; i < 55; i += 1) {
    insertTx.run(`TX-T${i}`, 100 + i, "Test Merchant", `-${i} minutes`);
  }
}

let app;
let token;
let sampleTxId;

beforeAll(() => {
  seedTestData();
  app = createApp();
});

afterAll(() => {
  closeDb();
  if (fs.existsSync(testDbPath)) fs.unlinkSync(testDbPath);
});

describe("POST /auth/login", () => {
  test("returns JWT and user for valid credentials", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "analyst@globalbank.com", password: "analyst123" });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe("analyst@globalbank.com");
    token = res.body.token;
  });

  test("returns 401 for invalid credentials", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "analyst@globalbank.com", password: "wrong" });

    expect(res.status).toBe(401);
    expect(res.body.token).toBeUndefined();
  });
});

describe("GET /transactions", () => {
  test("returns 401 without token", async () => {
    const res = await request(app).get("/transactions");
    expect(res.status).toBe(401);
  });

  test("returns paginated list newest first, max 50", async () => {
    const res = await request(app)
      .get("/transactions?page=1")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(50);
    expect(res.body.pagination.limit).toBe(50);
    expect(res.body.pagination.total).toBe(55);
    expect(res.body.pagination.totalPages).toBe(2);

    sampleTxId = res.body.data[0].id;
    const secondPage = await request(app)
      .get("/transactions?page=2")
      .set("Authorization", `Bearer ${token}`);
    expect(secondPage.body.data).toHaveLength(5);
  });

  test("caps page beyond totalPages to last page", async () => {
    const res = await request(app)
      .get("/transactions?page=999")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.pagination.page).toBe(2);
    expect(res.body.data).toHaveLength(5);
  });
});

describe("PATCH /transactions/:id/status", () => {
  test("marks fraud and creates audit entry", async () => {
    const res = await request(app)
      .patch(`/transactions/${sampleTxId}/status`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "fraud" });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("fraud");
  });

  test("rejects invalid status", async () => {
    const res = await request(app)
      .patch(`/transactions/${sampleTxId}/status`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "unknown" });

    expect(res.status).toBe(400);
  });

  test("rejects wrong-case and empty status", async () => {
    const badCase = await request(app)
      .patch(`/transactions/${sampleTxId}/status`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "FRAUD" });
    expect(badCase.status).toBe(400);

    const empty = await request(app)
      .patch(`/transactions/${sampleTxId}/status`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "" });
    expect(empty.status).toBe(400);
  });

  test("rejects body without status key", async () => {
    const res = await request(app)
      .patch(`/transactions/${sampleTxId}/status`)
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/status/i);
  });
});

describe("GET /transactions/:id/history", () => {
  test("returns empty array when no audit entries", async () => {
    const listRes = await request(app)
      .get("/transactions?page=2")
      .set("Authorization", `Bearer ${token}`);
    const cleanTxId = listRes.body.data[0].id;

    const res = await request(app)
      .get(`/transactions/${cleanTxId}/history`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.history).toEqual([]);
  });

  test("returns audit trail", async () => {
    const res = await request(app)
      .get(`/transactions/${sampleTxId}/history`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.history.length).toBeGreaterThanOrEqual(1);
    expect(res.body.history[0].userEmail).toBe("analyst@globalbank.com");
    expect(res.body.history[0].markedBy).toBeTruthy();
    expect(res.body.history[0].action).toBe("marked_fraud");
  });

  test("returns 404 for unknown transaction", async () => {
    const res = await request(app)
      .get("/transactions/99999/history")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
  });
});
