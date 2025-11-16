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

      // Get network configuration for RPC endpoint
      const networkConfig = getNetworkConfig(network);

      // Fetch balance from the blockchain
      let fetchedBalance = "0";
      try {
        const publicClient = createPublicClient({
          transport: http(networkConfig.rpc),
        });

        const balanceInWei = await publicClient.getBalance({
          address: walletAddress as `0x${string}`,
        });

        fetchedBalance = formatEther(balanceInWei);
      } catch (balanceError) {
        console.warn("Failed to fetch balance from blockchain:", balanceError);
        fetchedBalance = "0";
      }

      // Fetch IP Assets using the existing API
      // The API endpoint handles both testnet and mainnet queries
      const response = await fetch("/api/check-ip-assets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: walletAddress,
          network,
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
        setAssets(data.assets);
        setBalance(fetchedBalance);
      } else {
        setAssets([]);
        setBalance(fetchedBalance);
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
