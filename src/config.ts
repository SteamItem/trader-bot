export = {
  NODE_ENV: process.env.NODE_ENV || "development",
  CORS_WHITELIST: process.env.CORS_WHITELIST || "INVALID WHITELIST",
  DB_URL: process.env.DB_URL || "INVALID DB URL",
  RDB_URL: process.env.RDB_URL || "INVALID RDB URL",
  PUPPET_API: process.env.PUPPET_API || "INVALID PUPPET API",
  TELEGRAM_TOKEN: process.env.TELEGRAM_TOKEN || "INVALID TOKEN",
  TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID || "INVALID CHAT ID"
}
