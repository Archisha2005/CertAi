import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import express, { Request, Response, NextFunction } from "express";
import registerRoutes from "./routes.js";
import { setupVite, serveStatic, log } from "./vite.js";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const server = createServer(app);

// ES module __dirname workaround
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Increase body size limit to handle large uploads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false, limit: "50mb" }));

// ✅ Request logger middleware
app.use((req, res, next) => {
  const start = Date.now();
  const routePath = req.path;
  let capturedJsonResponse: Record<string, any> | undefined;

  const originalResJson = res.json.bind(res) as (...args: any[]) => Response;
  res.json = function (bodyJson: any, ...args: any[]): Response {
    capturedJsonResponse = bodyJson;
    return originalResJson(bodyJson, ...(args as [any?]));
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (routePath.startsWith("/api")) {
      let logLine = `${req.method} ${routePath} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 120) logLine = logLine.slice(0, 119) + "…";
      log(logLine);
    }
  });

  next();
});

// ✅ Main async initializer
(async () => {
  // Register backend API routes
  registerRoutes(app);

  // ✅ Global error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    console.error(err);
  });

  // ✅ Serve frontend in production or Vite in development
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    // --- FIXED PATH FOR FRONTEND BUILD ---
    // Your built frontend is in: dist/public/
    const clientDistPath = path.resolve(__dirname, "../dist/public");

    // Serve static files
    app.use(express.static(clientDistPath));

    // Catch-all route for SPA (React Router etc.)
    app.get("*", (_req, res) => {
      res.sendFile(path.join(clientDistPath, "index.html"));
    });
  }

  // ✅ Start the server
  const port = process.env.PORT ? Number(process.env.PORT) : 5000;
  const host = "localhost"; // change to 0.0.0.0 when deploying

  server.listen(port, host, () => {
    log(`✅ Server running at: http://${host}:${port}`);
  });
})();
