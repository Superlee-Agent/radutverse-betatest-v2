import path from "path";
import { createServer } from "./index";
import * as express from "express";

const port = process.env.PORT || 3000;
const __dirname = import.meta.dirname;
const distPath = path.join(__dirname, "../spa");

async function start() {
  const app = await createServer();

  // Serve static files
  app.use(express.static(distPath));

  // Handle React Router - serve index.html for all non-API routes
  app.use((req, res, next) => {
    // Don't serve index.html for API routes
    if (req.path.startsWith("/api/") || req.path.startsWith("/health")) {
      return next();
    }

    res.sendFile(path.join(distPath, "index.html"));
  });

  app.listen(port, () => {
    console.log(`🚀 Fusion Starter server running on port ${port}`);
    console.log(`📱 Frontend: http://localhost:${port}`);
    console.log(`🔧 API: http://localhost:${port}/api`);
  });

  // Graceful shutdown
  process.on("SIGTERM", () => {
    console.log("🛑 Received SIGTERM, shutting down gracefully");
    process.exit(0);
  });

  process.on("SIGINT", () => {
    console.log("🛑 Received SIGINT, shutting down gracefully");
    process.exit(0);
  });
}

start().catch((error) => {
  console.error("❌ Failed to start server:", error);
  process.exit(1);
});
