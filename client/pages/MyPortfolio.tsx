import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  ConnectWalletView,
  BalanceCard,
  IpAssetsGrid,
  PortfolioHeader,
} from "@/components/portfolio";
import { NetworkSelector } from "@/components/portfolio/NetworkSelector";
import { usePortfolioDataBothNetworks } from "@/hooks/usePortfolioDataBothNetworks";
import type { NetworkType } from "@/lib/network-config";

const MyPortfolio = () => {
  const navigate = useNavigate();
  const { ready, authenticated, login, logout, user } = usePrivy();
  const { wallets } = useWallets();
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkType>("testnet");

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

  // Get filtered assets and balance based on selected network
  const filteredAssets = useMemo(() => {
    return selectedNetwork === "testnet" ? testnetAssets : mainnetAssets;
  }, [selectedNetwork, testnetAssets, mainnetAssets]);

  const selectedBalance = useMemo(() => {
    return selectedNetwork === "testnet" ? balanceTestnet : balanceMainnet;
  }, [selectedNetwork, balanceTestnet, balanceMainnet]);

  const networkDisplayName = selectedNetwork === "testnet" ? "Story Testnet" : "Story Mainnet";

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
            {/* Network Selector */}
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-slate-100">Chain Selection</h2>
              <NetworkSelector
                currentNetwork={selectedNetwork}
                onNetworkChange={setSelectedNetwork}
              />
            </div>

            {/* Balance Card for selected network */}
            <div>
              <BalanceCard
                balance={selectedBalance}
                isLoading={isLoading}
                error={error}
                networkName={networkDisplayName}
              />
            </div>

            {/* Total Assets Summary */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-lg p-6">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-4">
                Assets Summary - {networkDisplayName}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-400 mb-2">Total Assets</p>
                  <p className="text-3xl font-bold text-[#FF4DA6]">
                    {filteredAssets.length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-2">All Networks</p>
                  <p className="text-2xl font-bold text-slate-300">
                    {totalAssets}
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
                  {filteredAssets.length > 0
                    ? `You own ${filteredAssets.length} IP Asset${filteredAssets.length !== 1 ? "s" : ""} on ${networkDisplayName}`
                    : `No IP assets yet on ${networkDisplayName}`}
                </p>
              </div>

              <IpAssetsGrid
                assets={filteredAssets}
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
