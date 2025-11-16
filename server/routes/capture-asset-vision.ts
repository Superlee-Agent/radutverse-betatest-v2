import type { RequestHandler } from "express";

export const handleCaptureAssetVision: RequestHandler = async (_req, res) => {
  res.status(503).json({
    ok: false,
    error:
      "Asset capture feature unavailable - image processing not supported in this deployment",
  });
};
