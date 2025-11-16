import { useState, useEffect, useCallback } from "react";
import { formatEther, createPublicClient, http } from "viem";
import { getNetworkConfig, type NetworkType } from "@/lib/network-config";

export type PortfolioAsset = {
  ipId: string;
  title: string;
  mediaUrl?: string;
  mediaType?: string;
  thumbnailUrl?: string;
  ownerAddress?: string;
  creator?: string;
  registrationDate?: string;
  network?: NetworkType;
  [key: string]: any;
};

export type PortfolioDataBothNetworks = {
  totalAssets: number;
  testnetAssets: PortfolioAsset[];
  mainnetAssets: PortfolioAsset[];
  allAssets: PortfolioAsset[];
  balanceTestnet: string;
  balanceMainnet: string;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

export function usePortfolioDataBothNetworks(
  walletAddress: string | null | undefined,
): PortfolioDataBothNetworks {
  const [testnetAssets, setTestnetAssets] = useState<PortfolioAsset[]>([]);
  const [mainnetAssets, setMainnetAssets] = useState<PortfolioAsset[]>([]);
  const [balanceTestnet, setBalanceTestnet] = useState<string>("0");
  const [balanceMainnet, setBalanceMainnet] = useState<string>("0");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPortfolioData = useCallback(async () => {
    if (!walletAddress) {
      setTestnetAssets([]);
      setMainnetAssets([]);
      setBalanceTestnet("0");
      setBalanceMainnet("0");
      setError(null);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Fetch data from both networks in parallel
      const [testnetResult, mainnetResult] = await Promise.all([
        fetchNetworkData(walletAddress, "testnet"),
        fetchNetworkData(walletAddress, "mainnet"),
      ]);

      if (testnetResult.error) {
        setTestnetAssets([]);
        setBalanceTestnet("0");
      } else {
        setTestnetAssets(testnetResult.assets);
        setBalanceTestnet(testnetResult.balance);
      }

      if (mainnetResult.error) {
        setMainnetAssets([]);
        setBalanceMainnet("0");
      } else {
        setMainnetAssets(mainnetResult.assets);
        setBalanceMainnet(mainnetResult.balance);
      }

      // Set error only if both networks failed
      if (testnetResult.error && mainnetResult.error) {
        setError("Failed to fetch data from both networks");
      } else if (testnetResult.error) {
        setError(`Failed to fetch testnet data: ${testnetResult.error}`);
      } else if (mainnetResult.error) {
        setError(`Failed to fetch mainnet data: ${mainnetResult.error}`);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load portfolio data";
      setError(errorMessage);
      setTestnetAssets([]);
      setMainnetAssets([]);
      setBalanceTestnet("0");
      setBalanceMainnet("0");
    } finally {
      setIsLoading(false);
    }
  }, [walletAddress]);

  useEffect(() => {
    fetchPortfolioData();
  }, [fetchPortfolioData]);

  const allAssets = [
    ...testnetAssets.map((asset) => ({
      ...asset,
      network: "testnet" as const,
    })),
    ...mainnetAssets.map((asset) => ({
      ...asset,
      network: "mainnet" as const,
    })),
  ];

  return {
    totalAssets: allAssets.length,
    testnetAssets,
    mainnetAssets,
    allAssets,
    balanceTestnet,
    balanceMainnet,
    isLoading,
    error,
    refresh: fetchPortfolioData,
  };
}

async function fetchNetworkData(
  walletAddress: string,
  network: NetworkType,
): Promise<{
  assets: PortfolioAsset[];
  balance: string;
  error: string | null;
}> {
  try {
    const networkConfig = getNetworkConfig(network);

    // Fetch balance from blockchain
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
      console.warn(
        `Failed to fetch balance from ${network} blockchain:`,
        balanceError,
      );
      fetchedBalance = "0";
    }

    // Fetch IP Assets using the API
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
      return {
        assets: [],
        balance: fetchedBalance,
        error:
          errorData.details ||
          `Failed to fetch IP assets from ${network === "mainnet" ? "Story Mainnet" : "Story Testnet"}`,
      };
    }

    const data = await response.json();

    if (data.ok && Array.isArray(data.assets)) {
      return {
        assets: data.assets,
        balance: fetchedBalance,
        error: null,
      };
    } else {
      return {
        assets: [],
        balance: fetchedBalance,
        error: null,
      };
    }
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to load network data";
    return {
      assets: [],
      balance: "0",
      error: errorMessage,
    };
  }
}
