import express from "express";
import cors from "cors";
import helmet from "helmet";
import { publicRouter } from "./routes/public.js";
import { adminRouter } from "./routes/admin.js";
import { agentRouter } from "./routes/agent.js";
import { swaggerRouter } from "./routes/swagger.js";
import { errorHandler } from "./lib/errors.js";

export function createApp() {
  const app = express();

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
          styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
          imgSrc: ["'self'", "data:", "https://cdn.jsdelivr.net"],
          connectSrc: ["'self'", "http://localhost:3000"],
        },
      },
    }),
  );
  app.use(cors());
  app.use(express.json({ limit: "2mb" }));

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use(swaggerRouter);
  app.use("/api/v1", publicRouter);
  app.use("/api/v1/admin", adminRouter);
  app.use("/api/v1/agent", agentRouter);

  app.use((_req, res) => {
    res.status(404).json({
      error: {
        code: "not_found",
        message: "Endpoint not found.",
      },
    });
  });

  app.use(errorHandler);

  return app;
}
