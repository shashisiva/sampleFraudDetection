const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");
const config = require("../config");
const { SCHEMA_SQL } = require("./schema");

let db;

function getDb() {
  if (!db) {
    const dir = path.dirname(config.databasePath);
    fs.mkdirSync(dir, { recursive: true });
    db = new Database(config.databasePath);
    db.pragma("journal_mode = WAL");
    db.exec(SCHEMA_SQL);
  }
  return db;
}

function closeDb() {
  if (db) {
    db.close();
    db = null;
  }
}

module.exports = { getDb, closeDb };
