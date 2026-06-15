import express from "express";
import { apiRoutes } from "./routes/apiRoutes.js";
import { env } from "./config/env.js";

const app = express();

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

