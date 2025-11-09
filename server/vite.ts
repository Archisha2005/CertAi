import express, { type Express } from "express";
import fs from "fs/promises";
import path from "path";
import { createServer as createViteServer, createLogger, type InlineConfig } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config.js";
import { nanoid } from "nanoid";

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions: any = {
    middlewareMode: true,
    hmr: {
      server,
    },
    allowedHosts: true,
  };

  const vite = await createViteServer({
    ...(viteConfig as InlineConfig),
    configFile: false,
    server: serverOptions,
    appType: "custom",
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
  });

  app.use(vite.middlewares);

  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(process.cwd(), "client", "index.html");

      // ✅ fs.readFile is fully recognized now
      let template = await fs.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );

      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(process.cwd(), "dist");

  import("fs").then((fsSync) => {
    if (!fsSync.existsSync(distPath)) {
      throw new Error(
        `Could not find the build directory: ${distPath}. Make sure to build the client first (npm run build).`
      );
    }

    app.use(express.static(distPath));

    // Fallback to index.html for SPA routes
    app.use("*", (_req, res) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
  });
}
