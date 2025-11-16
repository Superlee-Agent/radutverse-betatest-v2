// server/routes/check-ip-assets.ts

// Hapus import yang bermasalah (Request, Response)
// Kita hanya menyisakan RequestHandler untuk anotasi fungsi secara keseluruhan
import { RequestHandler } from "express";

// Definisikan tipe untuk body request agar TypeScript mengenali properti 'address'
interface CheckIpAssetsRequestBody {
  address?: string;
  network?: "testnet" | "mainnet";
}

const IDP_CHECK = new Map<string, { status: number; body: any; ts: number }>();

const PINATA_GATEWAY = process.env.PINATA_GATEWAY;

function convertIpfsUriToHttp(uri: string): string {
  if (!uri) return uri;

  const PUBLIC_GATEWAY = "dweb.link";

  if (uri.startsWith("ipfs://")) {
    const cid = uri.replace("ipfs://", "");
    return `https://${PUBLIC_GATEWAY}/ipfs/${cid}`;
  }

  if (uri.includes("ipfs.io/ipfs/")) {
    const cid = uri.split("/ipfs/")[1];
    return `https://${PUBLIC_GATEWAY}/ipfs/${cid}`;
  }

  if (uri.includes("mypinata.cloud")) {
    return uri;
  }

  if (uri.includes("/ipfs/") && !uri.includes(PUBLIC_GATEWAY)) {
    const cid = uri.split("/ipfs/")[1];
    return `https://${PUBLIC_GATEWAY}/ipfs/${cid}`;
  }

  return uri;
}

async function fetchIpaMetadata(ipaMetadataUri: string): Promise<any> {
  if (!ipaMetadataUri) return null;

  try {
    let url = ipaMetadataUri;

    if (url.startsWith("ipfs://")) {
      const cid = url.replace("ipfs://", "");
      url = PINATA_GATEWAY
        ? `https://${PINATA_GATEWAY}/ipfs/${cid}`
        : `https://ipfs.io/ipfs/${cid}`;
    }

    const response = await fetch(url, {
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) {
      console.warn(
        `Failed to fetch IPA metadata from ${url}: ${response.status}`,
      );
      return null;
    }

    const metadata = await response.json();
    return metadata;
  } catch (error) {
    console.warn(`Error fetching IPA metadata from ${ipaMetadataUri}:`, error);
    return null;
  }
}

// Menggunakan tipe any untuk req dan res agar kompiler tidak gagal
export const handleCheckIpAssets: RequestHandler = async (
  req: any, // Kunci perbaikan: Menggunakan any
  res: any, // Kunci perbaikan: Menggunakan any
) => {
  try {
    // Properti 'get' sekarang akan dikenali oleh kompiler TS karena tipe argumen adalah 'any'
    const idempotencyKey = (req.get("Idempotency-Key") ||
      req.get("Idempotency-Key")) as string | undefined;

    if (idempotencyKey && IDP_CHECK.has(idempotencyKey)) {
      const cached = IDP_CHECK.get(idempotencyKey)!;
      if (Date.now() - cached.ts < 60_000) {
        // Properti 'status' dan 'json' dikenali
        res.status(cached.status).json({ ok: true, ...cached.body });
        return;
      } else {
        IDP_CHECK.delete(idempotencyKey);
      }
    }

    // Properti 'body' sekarang dikenali
    const requestBody = req.body as CheckIpAssetsRequestBody; // Tetap lakukan casting untuk type safety di dalam fungsi
    const { address, network = "testnet" } = requestBody;

    if (!address || typeof address !== "string") {
      return res.status(400).json({
        ok: false,
        error: "address_required",
        message: "Address is required",
      });
    }

    const trimmedAddress = address.trim();
    if (!/^0x[a-fA-F0-9]{40}$/.test(trimmedAddress)) {
      return res.status(400).json({
        ok: false,
        error: "invalid_address",
        message: "Invalid Ethereum address format",
      });
    }

    const apiKey = process.env.STORY_API_KEY;
    if (!apiKey) {
      console.error("STORY_API_KEY environment variable not configured");
      return res.status(500).json({
        ok: false,
        error: "server_config_missing",
        message: "Server configuration error: STORY_API_KEY not set",
      });
    }

    let allAssets: any[] = [];
    let offset = 0;
    let hasMore = true;
    const limit = 100;
    const maxIterations = 10;
    let iterations = 0;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    try {
      while (hasMore && iterations < maxIterations) {
        iterations += 1;

        try {
          const response = await fetch(
            "https://api.storyapis.com/api/v4/assets",
            {
              method: "POST",
              headers: {
                "X-Api-Key": apiKey,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                options: {
                  where: {
                    ipAccountOwner: trimmedAddress,
                  },
                  pagination: {
                    limit,
                    offset,
                  },
                },
              }),
              signal: controller.signal,
            },
          ).catch(async () => {
            // Fallback to v3 if v4 fails
            return fetch("https://api.storyapis.com/api/v3/assets", {
              method: "POST",
              headers: {
                "X-Api-Key": apiKey,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                options: {
                  where: {
                    ipAccountOwner: trimmedAddress,
                  },
                  pagination: {
                    limit,
                    offset,
                  },
                },
              }),
              signal: controller.signal,
            });
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error(
              `Story API Error: ${response.status} - ${errorText}`,
              {
                address: trimmedAddress,
                offset,
                iteration: iterations,
              },
            );

            let errorDetail = errorText;
            try {
              const errorJson = JSON.parse(errorText);
              errorDetail = errorJson.message || errorJson.error || errorText;
            } catch {
              // Keep the raw text if not JSON
            }

            clearTimeout(timeoutId);
            return res.status(response.status).json({
              ok: false,
              error: `story_api_error`,
              details: errorDetail,
              status: response.status,
            });
          }

          const data = await response.json();

          if (!data) {
            console.error("Empty response from Story API", {
              address: trimmedAddress,
              offset,
              iteration: iterations,
            });
            break;
          }

          const assets = Array.isArray(data) ? data : data?.data || [];

          if (!Array.isArray(assets)) {
            console.warn("Unexpected response format from Story API", {
              address: trimmedAddress,
              offset,
              iteration: iterations,
              dataKeys: Object.keys(data || {}),
              dataType: typeof data,
            });
            break;
          }

          const validAssets = assets.filter((asset: any) => {
            if (!asset || typeof asset !== "object") {
              console.warn("Invalid asset object", { asset });
              return false;
            }
            return true;
          });

          allAssets = allAssets.concat(validAssets);

          const pagination = data?.pagination;
          hasMore = pagination?.hasMore === true && validAssets.length > 0;
          offset += limit;

          if (
            pagination?.hasMore === false ||
            !pagination ||
            validAssets.length === 0
          ) {
            hasMore = false;
          }
        } catch (fetchError: any) {
          if (fetchError.name === "AbortError") {
            console.error("Request timeout while fetching IP assets", {
              address: trimmedAddress,
              offset,
              iteration: iterations,
            });
            clearTimeout(timeoutId);
            return res.status(504).json({
              ok: false,
              error: "timeout",
              details:
                "The Story API is responding slowly. Please try again in a moment.",
            });
          }

          console.error("Fetch request failed for Story API", {
            address: trimmedAddress,
            offset,
            iteration: iterations,
            error: fetchError?.message,
            errorType: fetchError?.name,
          });
          clearTimeout(timeoutId);
          return res.status(500).json({
            ok: false,
            error: "network_error",
            details: fetchError?.message || "Unable to connect to Story API",
          });
        }
      }

      clearTimeout(timeoutId);

      if (iterations >= maxIterations) {
        console.warn("Max iterations reached when fetching IP assets", {
          address: trimmedAddress,
          assetsCollected: allAssets.length,
        });
      }

      const originalCount = allAssets.filter((asset: any) => {
        const parentsCount = asset?.parentsCount || 0;
        return parentsCount === 0;
      }).length;

      const remixCount = allAssets.filter((asset: any) => {
        const parentsCount = asset?.parentsCount || 0;
        return parentsCount > 0;
      }).length;

      const totalCount = allAssets.length;

      // Fetch additional metadata for each asset
      const enrichedAssets = await Promise.all(
        allAssets.map(async (asset: any) => {
          let enrichedData = { ...asset };
          let ipaMetadata: any = null;

          // Fetch IPA metadata from IPFS if available
          if (asset.ipaMetadataUri) {
            ipaMetadata = await fetchIpaMetadata(asset.ipaMetadataUri);
          }

          // Try to fetch detailed asset information if we have an ipId
          if (asset.ipId && !asset.metadata) {
            try {
              const detailResponse = await fetch(
                "https://api.storyapis.com/api/v4/assets",
                {
                  method: "POST",
                  headers: {
                    "X-Api-Key": apiKey,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    options: {
                      where: {
                        ipId: asset.ipId,
                      },
                    },
                  }),
                  signal: AbortSignal.timeout(5000),
                },
              ).catch(() => null);

              if (detailResponse?.ok) {
                const detailData = await detailResponse.json();
                const detailedAsset = Array.isArray(detailData)
                  ? detailData[0]
                  : detailData?.data?.[0];
                if (detailedAsset) {
                  enrichedData = {
                    ...enrichedData,
                    ...detailedAsset,
                    metadata: detailedAsset.metadata || asset.metadata,
                    nftMetadata: detailedAsset.nftMetadata || asset.nftMetadata,
                  };
                }
              }
            } catch {
              // Silently continue if detail fetch fails
            }
          }

          // Add IPA metadata to enriched data
          if (ipaMetadata) {
            enrichedData.ipaMetadata = ipaMetadata;
          }

          return enrichedData;
        }),
      );

      // Transform assets to include required fields for portfolio display
      const assets = enrichedAssets.map((asset: any) => {
        // Extract metadata from multiple possible sources
        const nftMetadata = asset.nftMetadata || {};
        const metadata = asset.metadata || {};
        const tokenMetadata = asset.tokenMetadata || {};
        const ipaMetadata = asset.ipaMetadata || {};

        // Extract image URL from various possible fields
        let imageUrl =
          asset.mediaUrl ||
          asset.imageUrl ||
          ipaMetadata.image ||
          ipaMetadata.imageUrl ||
          nftMetadata.imageUrl ||
          nftMetadata.image ||
          metadata.imageUrl ||
          metadata.image ||
          tokenMetadata.image ||
          null;

        // Convert IPFS URIs to HTTP URLs if needed
        if (imageUrl && imageUrl.startsWith("ipfs://")) {
          imageUrl = convertIpfsUriToHttp(imageUrl);
        }

        return {
          ipId: asset.ipId,
          title:
            asset.title ||
            ipaMetadata.title ||
            metadata.title ||
            nftMetadata.name ||
            asset.name ||
            "Untitled Asset",
          mediaUrl: imageUrl,
          mediaType: asset.mediaType || metadata.mediaType,
          thumbnailUrl: imageUrl,
          ownerAddress: asset.ownerAddress || asset.ipAccountOwner,
          creator:
            asset.creator ||
            ipaMetadata.creator ||
            nftMetadata.creator ||
            metadata.creator ||
            null,
          registrationDate: asset.registrationDate || asset.blockTimestamp,
          parentsCount: asset.parentsCount || 0,
          ...asset,
        };
      });

      const body = {
        address: trimmedAddress,
        network,
        totalCount,
        originalCount,
        remixCount,
        assets,
      };
      if (idempotencyKey)
        IDP_CHECK.set(idempotencyKey, { status: 200, body, ts: Date.now() });
      res.json({ ok: true, ...body });
    } catch (innerError: any) {
      clearTimeout(timeoutId);
      throw innerError;
    }
  } catch (error: any) {
    console.error("Check IP Assets Error:", error);
    res.status(500).json({
      ok: false,
      error: error?.message || "Internal server error",
      details:
        process.env.NODE_ENV !== "production"
          ? error?.stack
          : "An unexpected error occurred",
    });
  }
};
