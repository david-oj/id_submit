// server.js

// Load .env.local
import "dotenv/config";

import express from "express";
import handler from "./api/submit.js";  // your existing function

const app = express();

// Mount your function at /api/submit
app.all("/api/submit", handler);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`API test server running: http://localhost:${PORT}/api/submit`);
});
