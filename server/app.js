import express from "express";
import path from "path";
import { existsSync } from "fs";
import { fileURLToPath } from "url";
import { apiRoutes } from "./routes/apiRoutes.js";
import { env } from "./config/env.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, "../dist");
const distIndexFile = path.join(distDir, "index.html");
const hasBuiltFrontend = existsSync(distIndexFile);

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    mode: env.sourceMode,
    dataSource: env.dataSource,
    sfAlias: env.sfAlias,
    previewOnly: true
  });
});

app.use("/api", apiRoutes);

if (hasBuiltFrontend) {
  app.use(express.static(distDir));
  app.get("/{*path}", (req, res, next) => {
    if (req.path.startsWith("/api") || req.path === "/health") return next();
    return res.sendFile(distIndexFile);
  });
}

app.use((err, _req, res, next) => {
  void next;
  // Keep errors safe for a demo environment.
  console.error("[middleware] unexpected error", err);
  res.status(500).json({
    error: "INTERNAL_ERROR",
    message: "Unexpected middleware error.",
    previewOnly: true
  });
});

export { app };

