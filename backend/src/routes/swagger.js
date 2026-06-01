import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Router } from "express";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "../../..");
const openApiPath = resolve(repoRoot, "docs/API_SPEC_OSHC_Platform.yaml");

export const swaggerRouter = Router();

swaggerRouter.get("/openapi.yaml", async (_req, res, next) => {
  try {
    const spec = await readFile(openApiPath, "utf8");
    res.type("text/yaml").send(spec);
  } catch (error) {
    next(error);
  }
});

swaggerRouter.get(["/docs", "/docs/"], (_req, res) => {
  res.type("html").send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>OSHC Platform API - Swagger UI</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css" />
    <style>
      body { margin: 0; background: #fff; }
    </style>
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script>
      window.addEventListener("load", () => {
        window.ui = SwaggerUIBundle({
          url: "/openapi.yaml",
          dom_id: "#swagger-ui",
          deepLinking: true,
          displayRequestDuration: true,
          filter: true,
          persistAuthorization: true
        });
      });
    </script>
  </body>
</html>`);
});
