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
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { useStoryNetwork } from "@/hooks/useStoryNetwork";

const MyPortfolio = () => {
  const navigate = useNavigate();
  const { ready, authenticated, login, logout, user } = usePrivy();
  const { wallets } = useWallets();
  const { network, switchNetwork } = useStoryNetwork();

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

  // Fetch portfolio data for the selected network
  const { balance, assets, isLoading, error, refresh } =
    usePortfolioData(primaryWalletAddress, network);

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
          currentNetwork={network}
          onNetworkChange={switchNetwork}
        />

        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Balance Card */}
            <BalanceCard
              balance={balance}
              isLoading={isLoading}
              error={error}
            />

            {/* IP Assets Section */}
            <div>
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-slate-100 mb-1">
                  Your IP Assets
                </h3>
                <p className="text-sm text-slate-400">
                  {assets.length > 0
                    ? `You own ${assets.length} IP Asset${assets.length !== 1 ? "s" : ""}`
                    : "No IP assets yet"}
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
