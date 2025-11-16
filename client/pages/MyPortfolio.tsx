import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  ConnectWalletView,
  BalanceCard,
  IpAssetsGrid,
  PortfolioHeader,
} from "@/components/portfolio";
import { usePortfolioDataBothNetworks } from "@/hooks/usePortfolioDataBothNetworks";

const MyPortfolio = () => {
  const navigate = useNavigate();
  const { ready, authenticated, login, logout, user } = usePrivy();
  const { wallets } = useWallets();

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

  // Fetch portfolio data from both networks
  const {
    totalAssets,
    allAssets,
    balanceTestnet,
    balanceMainnet,
    testnetAssets,
    mainnetAssets,
    isLoading,
    error,
    refresh,
  } = usePortfolioDataBothNetworks(primaryWalletAddress);

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
          assetCount={totalAssets}
          onDisconnect={handleWalletDisconnect}
        />

        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Balance Cards for both networks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <BalanceCard
                balance={balanceTestnet}
                isLoading={isLoading}
                error={error}
                networkName="Story Testnet"
              />
              <BalanceCard
                balance={balanceMainnet}
                isLoading={isLoading}
                error={error}
                networkName="Story Mainnet"
              />
            </div>

            {/* Total Assets Summary */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-lg p-6">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-4">
                Total Assets Summary
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-slate-400 mb-2">Total Assets</p>
                  <p className="text-3xl font-bold text-[#FF4DA6]">
                    {totalAssets}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-2">Testnet Assets</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {testnetAssets.length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-2">Mainnet Assets</p>
                  <p className="text-2xl font-bold text-green-400">
                    {mainnetAssets.length}
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
                  {allAssets.length > 0
                    ? `You own ${allAssets.length} IP Asset${allAssets.length !== 1 ? "s" : ""} across both networks`
                    : "No IP assets yet on either network"}
                </p>
              </div>

              <IpAssetsGrid
                assets={allAssets}
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
