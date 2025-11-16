import type { RequestHandler } from "express";

export const handleAnalyzeImageVision: RequestHandler = async (_req, res) => {
  res.status(503).json({
    ok: false,
    error:
      "Image analysis feature unavailable - image processing not supported in this deployment",
  });
};
