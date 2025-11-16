/**
 * Apply visible watermark to an image
 * Overlays a watermark image on the generated image
 */
export async function applyVisualWatermark(
  imageUrl: string,
  watermarkUrl: string,
  watermarkOpacity: number = 0.8,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      console.error("❌ Failed to get canvas context");
      reject(new Error("Failed to get canvas context"));
      return;
    }

    // First, load base image
    const baseImage = new Image();
    baseImage.crossOrigin = "anonymous";

    const applyWatermarkToCanvas = () => {
      // Now load watermark
      const watermarkImage = new Image();
      watermarkImage.crossOrigin = "anonymous";

      watermarkImage.onload = () => {
        console.log("✅ Watermark image loaded");

        // Draw watermark to fill entire image area
        ctx.globalAlpha = watermarkOpacity;
        ctx.drawImage(watermarkImage, 0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1.0;

        canvas.toBlob((blob) => {
          if (blob) {
            const watermarkedUrl = URL.createObjectURL(blob);
            console.log("✅ Watermark applied successfully");
            resolve(watermarkedUrl);
          } else {
            console.error("❌ Failed to create blob from canvas");
            reject(new Error("Failed to create blob from canvas"));
          }
        }, "image/png");
      };

      watermarkImage.onerror = (error) => {
        console.error(
          "❌ Failed to load watermark image:",
          watermarkUrl,
          error,
        );
        // Fallback: return base image without watermark
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            console.warn("⚠️ Watermark failed, returning base image");
            resolve(url);
          } else {
            reject(new Error("Failed to create blob from canvas"));
          }
        }, "image/png");
      };

      watermarkImage.src = watermarkUrl;
    };

    baseImage.onload = () => {
      console.log("✅ Base image loaded", imageUrl.substring(0, 50));
      canvas.width = baseImage.width;
      canvas.height = baseImage.height;

      // Draw base image first
      ctx.drawImage(baseImage, 0, 0);

      // Then apply watermark
      applyWatermarkToCanvas();
    };

    baseImage.onerror = (error) => {
      console.error("❌ Failed to load base image:", imageUrl, error);
      console.warn(
        "⚠️ Base image failed, returning original URL without watermark",
      );
      // Return original image URL if we can't load it
      resolve(imageUrl);
    };

    baseImage.src = imageUrl;
  });
}
