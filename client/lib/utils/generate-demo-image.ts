export const generateDemoImage = (): string => {
  const width = 1024;
  const height = 1024;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Failed to get canvas context");
  }

  // Create a gradient background
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#FF4DA6");
  gradient.addColorStop(0.5, "#6366f1");
  gradient.addColorStop(1, "#3b82f6");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Add "DEMO" text
  ctx.font =
    "bold 120px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const textY = height / 2 - 40;
  ctx.fillText("DEMO", width / 2, textY);

  // Add subtitle text
  ctx.font = "24px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
  const subtitleY = height / 2 + 80;
  ctx.fillText("Try Demo Mode", width / 2, subtitleY);

  // Convert canvas to data URL
  return canvas.toDataURL("image/png");
};
