// server/utils/remix-hash-whitelist.ts

// PERBAIKAN: Menghapus 'del' dari imports karena tidak digunakan (TS6133).
// 'put' dan 'list' tetap ada karena digunakan.
import { put, list } from "@vercel/blob";

/**
 * Whitelist storage using Vercel Blob:
 * - Stores all entries in a single JSON file: "remix-hashes.json"
 * - File is publicly accessible for reading
 * - Uses Vercel Blob API: put, list
 */

interface RemixImageMetadata {
  ipId: string;
  title: string;
  timestamp: number;
  pHash?: string;
  visionDescription?: string;
  ownerAddress?: string;
  mediaType?: string;
  score?: number | null;
  description?: string;
  parentIpIds?: string[];
  licenseTermsIds?: string[];
  licenseTemplates?: string[];
  parentIpDetails?: any;
  royaltyContext?: string;
  maxMintingFee?: string;
  maxRts?: string;
  maxRevenueShare?: number;
  licenseVisibility?: string;
  licenses?: any[];
  isDerivative?: boolean;
  parentsCount?: number;
  matchType?: string;
  similarity?: number;
  [key: string]: any;
}

interface RemixHashEntry {
  hash: string;
  metadata: RemixImageMetadata;
}

interface RemixHashWhitelist {
  entries: RemixHashEntry[];
  lastUpdated: number;
}

const BLOB_NAME = "remix-hashes.json";

/**
 * Load whitelist from Vercel Blob
 */
async function loadWhitelist(): Promise<RemixHashWhitelist> {
  try {
    // List blobs to find our whitelist file
    const { blobs } = await list({ prefix: BLOB_NAME });

    if (blobs.length === 0) {
      console.log("[Remix Hash Blob] Starting with empty whitelist");
      return { entries: [], lastUpdated: Date.now() };
    }

    // Get the blob URL and fetch its content
    const blobUrl = blobs[0].url;
    const response = await fetch(blobUrl);

    if (!response.ok) {
      console.warn(`[Remix Hash Blob] Failed to fetch blob: ${response.status}`);
      return { entries: [], lastUpdated: Date.now() };
    }

    const content = await response.text();
    const parsed = JSON.parse(content);

    // Support both old and new formats
    if (parsed.entries && parsed.entries.length > 0) {
      if (parsed.entries[0].metadata) {
        // New format: already separated
        return parsed;
      } else if (parsed.entries[0].ipId) {
        // Old format: needs migration
        console.log("[Remix Hash Blob] Migrating whitelist to new format...");
        const migratedEntries = parsed.entries.map((entry: any) => ({
          hash: entry.hash,
          metadata: {
            ipId: entry.ipId,
            title: entry.title,
            timestamp: entry.timestamp,
            pHash: entry.pHash,
            visionDescription: entry.visionDescription,
          },
        }));

        return {
          entries: migratedEntries,
          lastUpdated: parsed.lastUpdated || Date.now(),
        };
      }
    }

    return parsed;
  } catch (error) {
    console.warn("[Remix Hash Blob] Error loading whitelist:", error);
    return { entries: [], lastUpdated: Date.now() };
  }
}

/**
 * Save whitelist to Vercel Blob
 * Note: Using put() directly without delete - it overwrites automatically
 */
async function saveWhitelist(whitelist: RemixHashWhitelist): Promise<void> {
  whitelist.lastUpdated = Date.now();
  const content = JSON.stringify(whitelist, null, 2);

  try {
    // put() with allowOverwrite to replace existing blob
    await put(BLOB_NAME, content, {
      contentType: "application/json",
      access: "public",
      allowOverwrite: true,
    });

    console.log("[Remix Hash Blob] Whitelist saved");
  } catch (error) {
    console.error("[Remix Hash Blob] Failed to save whitelist:", error);
    throw error;
  }
}

/**
 * Add hash to whitelist with separated metadata
 * @param hash SHA256 hash of pure image pixels only
 * @param metadata Image metadata (ipId, title, etc)
 */
export async function addHashToWhitelist(
  hash: string,
  metadata: RemixImageMetadata,
): Promise<void> {
  const whitelist = await loadWhitelist();

  // Check if hash already exists
  const exists = whitelist.entries.some((entry) => entry.hash === hash);

  if (!exists) {
    whitelist.entries.push({
      hash,
      metadata,
    });

    await saveWhitelist(whitelist);
    console.log(
      `[Remix Hash Blob] Added hash ${hash} for IP ${metadata.ipId} (${metadata.title})`,
    );
  }
}

/**
 * Check if hash exists in whitelist
 * Returns the metadata if found, null otherwise
 */
export async function checkHashInWhitelist(
  hash: string,
): Promise<RemixImageMetadata | null> {
  const whitelist = await loadWhitelist();
  const entry = whitelist.entries.find((entry) => entry.hash === hash);
  return entry?.metadata || null;
}

/**
 * Get all hashes in whitelist
 */
export async function getAllWhitelistHashes(): Promise<string[]> {
  const whitelist = await loadWhitelist();
  return whitelist.entries.map((entry) => entry.hash);
}

/**
 * Get all entries with metadata
 */
export async function getAllWhitelistEntries(): Promise<RemixHashEntry[]> {
  const whitelist = await loadWhitelist();
  return whitelist.entries;
}

/**
 * Clear whitelist (admin function)
 */
export async function clearWhitelist(): Promise<void> {
  const whitelist: RemixHashWhitelist = {
    entries: [],
    lastUpdated: Date.now(),
  };
  await saveWhitelist(whitelist);
  console.log("[Remix Hash Blob] Whitelist cleared");
}

/**
 * Update metadata for a hash (add visionDescription, etc)
 */
export async function updateHashMetadata(
  hash: string,
  partialMetadata: Partial<RemixImageMetadata>,
): Promise<void> {
  const whitelist = await loadWhitelist();
  const entry = whitelist.entries.find((e) => e.hash === hash);

  if (entry) {
    entry.metadata = { ...entry.metadata, ...partialMetadata };
    await saveWhitelist(whitelist);
    console.log(`[Remix Hash Blob] Updated metadata for hash ${hash}`);
  }
}

/**
 * Delete hash from whitelist
 */
export async function deleteHashFromWhitelist(hash: string): Promise<void> {
  const whitelist = await loadWhitelist();
  const initialLength = whitelist.entries.length;
  whitelist.entries = whitelist.entries.filter((entry) => entry.hash !== hash);

  if (whitelist.entries.length < initialLength) {
    await saveWhitelist(whitelist);
    console.log(`[Remix Hash Blob] Deleted hash ${hash} from whitelist`);
  }
}
