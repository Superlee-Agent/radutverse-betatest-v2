import { useCallback, useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { formatEther, createPublicClient, http } from "viem";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  ConnectWalletView,
  BalanceCard,
  IpAssetsGrid,
  PortfolioHeader,
} from "@/components/portfolio";
import { getNetworkConfig } from "@/lib/network-config";

type PortfolioAsset = {
  ipId: string;
  title: string;
  mediaUrl?: string;
  mediaType?: string;
  thumbnailUrl?: string;
  ownerAddress?: string;
  creator?: string;
  registrationDate?: string;
};

const MyPortfolio = () => {
  const navigate = useNavigate();
  const { ready, authenticated, login, logout, user } = usePrivy();
  const { wallets } = useWallets();

  const [assets, setAssets] = useState<PortfolioAsset[]>([]);
  const [balance, setBalance] = useState<string>("0");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get primary wallet address
  const primaryWalletAddress = useMemo(() => {
    if (wallets && wallets.length > 0) {
      const walletWithAddress = wallets.find((w) => w.address);
      if (walletWithAddress?.address) {
        return walletWithAddress.address;
      }
    }
    return user?.wallet?.address ?? null;
  }, [wallets, user?.wallet?.address]);

  // Fetch portfolio data only from mainnet
  useEffect(() => {
    if (!primaryWalletAddress) {
      setAssets([]);
      setBalance("0");
      setError(null);
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const networkConfig = getNetworkConfig("mainnet");

        // Fetch balance
        try {
          const publicClient = createPublicClient({
            transport: http(networkConfig.rpc),
          });

          const balanceInWei = await publicClient.getBalance({
            address: primaryWalletAddress as `0x${string}`,
          });

          setBalance(formatEther(balanceInWei));
        } catch (balanceError) {
          console.warn(
            "Failed to fetch balance from mainnet blockchain:",
            balanceError,
          );
          setBalance("0");
        }

        // Fetch IP Assets
        const response = await fetch("/api/check-ip-assets", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            address: primaryWalletAddress,
            network: "mainnet",
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          setError(errorData.details || "Failed to fetch IP assets");
          setAssets([]);
          return;
        }

        const data = await response.json();
        if (data.ok && Array.isArray(data.assets)) {
          setAssets(data.assets);
          setError(null);
        } else {
          setAssets([]);
          setError(null);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load portfolio data";
        setError(errorMessage);
        setAssets([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [primaryWalletAddress]);

  // Handle wallet connection
  const handleWalletConnect = useCallback(() => {
    if (!ready) return;
    if (!authenticated) {
      void login({ loginMethods: ["wallet"] });
    }
  }, [ready, authenticated, login]);

  // Handle wallet disconnection
  const handleWalletDisconnect = useCallback(async () => {
    await logout();
  }, [logout]);

  // Handle remix - navigate to IP Imagine with asset data
  const handleRemix = useCallback(
    (asset: any) => {
      // Store the selected asset in sessionStorage to pass to IP Imagine
      sessionStorage.setItem(
        "remixAsset",
        JSON.stringify({
          ipId: asset.ipId,
          title: asset.title,
          mediaUrl: asset.mediaUrl,
          mediaType: asset.mediaType,
        }),
      );
      navigate("/ip-imagine");
    },
    [navigate],
  );

  // Show connect wallet view when not authenticated
  if (!authenticated || !primaryWalletAddress) {
    return (
      <DashboardLayout title="My Portfolio">
        <ConnectWalletView
          onConnect={handleWalletConnect}
          onDisconnect={handleWalletDisconnect}
          isConnected={false}
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="My Portfolio">
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <PortfolioHeader
          walletAddress={primaryWalletAddress}
          assetCount={assets.length}
          onDisconnect={handleWalletDisconnect}
        />

        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Balance Card */}
            <div>
              <BalanceCard
                balance={balance}
                isLoading={isLoading}
                error={error}
                networkName="Story Mainnet"
              />
            </div>

            {/* Total Assets Summary */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-lg p-6">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-4">
                Assets Summary - Story Mainnet
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <p className="text-sm text-slate-400 mb-2">Total Assets</p>
                  <p className="text-3xl font-bold text-[#FF4DA6]">
                    {assets.length}
                  </p>
                </div>
              </div>
            </div>

            {/* IP Assets Section */}
            <div>
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-slate-100 mb-1">
                  Your IP Assets
                </h3>
                <p className="text-sm text-slate-400">
                  {assets.length > 0
                    ? `You own ${assets.length} IP Asset${assets.length !== 1 ? "s" : ""} on Story Mainnet`
                    : "No IP assets yet on Story Mainnet"}
                </p>
              </div>

              <IpAssetsGrid
                assets={assets}
                isLoading={isLoading}
                error={error}
                onRemix={handleRemix}
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MyPortfolio;
