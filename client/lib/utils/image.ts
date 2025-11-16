/**
 * Image compression and manipulation utilities
 * Provides functions for compressing images with quality and size constraints
 */

/**
 * Compresses an image file to a JPEG blob with specified parameters
 * @param file - The image file to compress
 * @param maxWidth - Maximum width in pixels (default: 800)
 * @param quality - JPEG quality 0-1 (default: 0.75)
 * @returns Promise resolving to compressed blob
 */
export const compressToBlob = async (
  file: File,
  maxWidth = 800,
  quality = 0.75,
): Promise<Blob> =>
  new Promise((resolve, reject) => {
    if (!file.type || !file.type.startsWith("image/")) {
      reject(new Error("File is not an image"));
      return;
    }
    const img = new Image();
    const reader = new FileReader();
    reader.onload = () => {
      img.onload = () => {
        try {
          const scale = Math.min(1, maxWidth / img.width);
          const width = Math.round(img.width * scale);
          const height = Math.round(img.height * scale);
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Canvas not supported"));
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("Compression failed"));
                return;
              }
              resolve(blob);
            },
            "image/jpeg",
            quality,
          );
        } catch (error) {
          reject(error);
        }
      };
      img.onerror = () => reject(new Error("Image load failed"));
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error("File read failed"));
    reader.readAsDataURL(file);
  });

/**
 * Compresses an image while ensuring the blob doesn't exceed target size
 * Iteratively reduces quality and width until size constraint is met
 * @param file - The image file to compress
 * @param targetSize - Target size in bytes (default: 250KB)
 * @returns Promise resolving to size-constrained blob
 */
export const compressAndEnsureSize = async (
  file: File,
  targetSize = 250 * 1024,
): Promise<Blob> => {
  let quality = 0.75;
  let maxWidth = 800;
  let blob = await compressToBlob(file, maxWidth, quality);
  let attempts = 0;

  while (blob.size > targetSize && attempts < 6) {
    if (quality > 0.4) {
      quality = Math.max(0.35, quality - 0.15);
    } else {
      maxWidth = Math.max(300, Math.floor(maxWidth * 0.8));
    }
    try {
      blob = await compressToBlob(file, maxWidth, quality);
    } catch (error) {
      console.error("Compression loop error", error);
      break;
    }
    attempts += 1;
  }

  return blob;
};
