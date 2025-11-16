import type { RequestHandler } from "express";

export const handleVisionImageDetection: RequestHandler = async (_req, res) => {
  res.status(503).json({
    ok: false,
    error:
      "Vision detection feature unavailable - image processing not supported in this deployment",
  });
};
