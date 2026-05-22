const { createApp } = require("./app");
const config = require("./config");
const { getDb } = require("./db");

config.validateConfig();
getDb();

const app = createApp();

app.listen(config.port, () => {
  console.log(`Fraud review API running at http://localhost:${config.port}`);
  console.log(`UI: http://localhost:${config.port}/transactions.html`);
});
