import { useState, useEffect, useCallback } from "react";
import { formatEther, createPublicClient, http } from "viem";
import { type NetworkType, getNetworkConfig } from "@/lib/network-config";

export type PortfolioAsset = {
  ipId: string;
  title: string;
  mediaUrl?: string;
  mediaType?: string;
  thumbnailUrl?: string;
  ownerAddress?: string;
  creator?: string;
  registrationDate?: string;
  [key: string]: any;
};

export type PortfolioData = {
  balance: string;
  assets: PortfolioAsset[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

export function usePortfolioData(
  walletAddress: string | null | undefined,
  network: NetworkType = "testnet",
): PortfolioData {
  const [balance, setBalance] = useState<string>("0");
  const [assets, setAssets] = useState<PortfolioAsset[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPortfolioData = useCallback(async () => {
    if (!walletAddress) {
      setBalance("0");
      setAssets([]);
      setError(null);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Fetch IP Assets using the existing API
      // The API endpoint handles both testnet and mainnet queries
      const response = await fetch("/api/check-ip-assets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: walletAddress,
          network, // Pass network parameter for filtering
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.details ||
            `Failed to fetch IP assets from ${network === "mainnet" ? "Story Mainnet" : "Story Testnet"}`,
        );
      }

      const data = await response.json();

      if (data.ok && Array.isArray(data.assets)) {
        // Transform assets to match our portfolio format
        const portfolioAssets: PortfolioAsset[] = data.assets.map(
          (asset: any) => ({
            ipId: asset.ipId,
            title: asset.title || asset.name || "Untitled Asset",
            mediaUrl: asset.mediaUrl,
            mediaType: asset.mediaType,
            thumbnailUrl: asset.thumbnailUrl,
            ownerAddress: asset.ownerAddress,
            creator: asset.creator,
            registrationDate: asset.registrationDate,
            ...asset,
          }),
        );

        setAssets(portfolioAssets);

        // For now, balance is hardcoded or would need a separate API call
        // The Story chain balance would be fetched from a blockchain RPC call
        setBalance("0.00");
      } else {
        setAssets([]);
        setBalance("0.00");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load portfolio data";
      setError(errorMessage);
      setAssets([]);
      setBalance("0");
    } finally {
      setIsLoading(false);
    }
  }, [walletAddress, network]);

  useEffect(() => {
    fetchPortfolioData();
  }, [fetchPortfolioData]);

  return {
    balance,
    assets,
    isLoading,
    error,
    refresh: fetchPortfolioData,
  };
}
