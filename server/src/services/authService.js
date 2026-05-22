const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config");
const { getDb } = require("../db");

function findUserByEmail(email) {
  return getDb()
    .prepare(
      `SELECT id, email, password_hash, name FROM users WHERE email = ?`
    )
    .get(email);
}

function login(email, password) {
  const user = findUserByEmail(email);
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return null;
  }

  const payload = { sub: user.id, email: user.email };
  const token = jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  };
}

function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    const user = getDb()
      .prepare(`SELECT id, email, name FROM users WHERE id = ?`)
      .get(decoded.sub);
    if (!user) return null;
    return { id: user.id, email: user.email, name: user.name };
  } catch {
    return null;
  }
}

module.exports = { login, verifyToken };
