require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });

const path = require("path");

const isProduction = process.env.NODE_ENV === "production";
const isTest = process.env.NODE_ENV === "test";

function resolveJwtSecret() {
  if (process.env.JWT_SECRET) {
    return process.env.JWT_SECRET;
  }
  if (isProduction) {
    return null;
  }
  if (isTest) {
    return "test-jwt-secret";
  }
  return "dev-only-jwt-secret-not-for-production";
}

const jwtSecret = resolveJwtSecret();

const config = {
  port: Number(process.env.PORT) || 3000,
  jwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "8h",
  demoEmail: process.env.DEMO_ANALYST_EMAIL || "analyst@globalbank.com",
  demoPassword: process.env.DEMO_ANALYST_PASSWORD || "analyst123",
  databasePath:
    process.env.DATABASE_PATH ||
    path.join(__dirname, "..", "data", "fraud.db"),
  publicDir: path.join(__dirname, "..", "..", "public"),
  pageSize: 50,
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
  isProduction,
  isTest,
};

function validateConfig() {
  if (isProduction && !String(process.env.JWT_SECRET || "").trim()) {
    throw new Error(
      "JWT_SECRET environment variable is required when NODE_ENV=production"
    );
  }
  if (!config.jwtSecret) {
    throw new Error("JWT_SECRET is not configured");
  }
  if (isProduction && config.jwtSecret.length < 32) {
    throw new Error(
      "JWT_SECRET must be at least 32 characters when NODE_ENV=production"
    );
  }
  if (!isProduction && !process.env.JWT_SECRET) {
    console.warn(
      "[security] Using development JWT secret. Set JWT_SECRET in .env before production deploy."
    );
  }
}

module.exports = config;
module.exports.validateConfig = validateConfig;
