const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");
const config = require("../src/config");
const { getDb, closeDb } = require("../src/db");

const merchants = [
  "Acme Corp",
  "Globex LLC",
  "Initech",
  "Umbrella Co",
  "Stark Industries",
  "Wayne Enterprises",
  "Cyberdyne",
  "Soylent Foods",
];

function seed() {
  const dbPath = config.databasePath;
  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
    console.log("Removed existing database for fresh seed.");
  }

  const db = getDb();

  const passwordHash = bcrypt.hashSync(config.demoPassword, 10);
  const insertUser = db.prepare(
    `INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)`
  );
  const userResult = insertUser.run(
    config.demoEmail,
    passwordHash,
    "Ops Analyst"
  );
  const userId = userResult.lastInsertRowid;

  const insertTx = db.prepare(
    `INSERT INTO transactions (external_id, amount, currency, merchant, status, created_at)
     VALUES (?, ?, 'USD', ?, 'pending', datetime('now', ?))`
  );

  const txCount = 55;
  for (let i = 0; i < txCount; i += 1) {
    const offset = `-${i} hours`;
    insertTx.run(
      `TX-${String(10000 + i)}`,
      Math.round((Math.random() * 5000 + 10) * 100) / 100,
      merchants[i % merchants.length],
      offset
    );
  }

  console.log(`Seeded analyst: ${config.demoEmail} / ${config.demoPassword}`);
  console.log(`Seeded ${txCount} transactions (user id ${userId}).`);
  closeDb();
}

seed();
