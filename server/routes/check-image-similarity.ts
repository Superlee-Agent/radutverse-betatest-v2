import type { RequestHandler } from "express";

export const handleCheckImageSimilarity: RequestHandler = async (_req, res) => {
  res.status(503).json({
    ok: false,
    error:
      "Image similarity feature unavailable - image processing not supported in this deployment",
  });
};
