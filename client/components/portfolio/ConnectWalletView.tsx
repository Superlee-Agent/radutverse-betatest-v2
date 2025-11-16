import { Wallet, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

type ConnectWalletViewProps = {
  onConnect: () => void;
  onDisconnect: () => void;
  isConnected: boolean;
  walletAddress?: string | null;
};

export const ConnectWalletView = ({
  onConnect,
  onDisconnect,
  isConnected,
  walletAddress,
}: ConnectWalletViewProps) => {
  if (isConnected && walletAddress) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-full">
        <div className="w-full max-w-md bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-xl p-8">
          <div className="flex justify-center mb-6">
            <div className="p-3 rounded-lg bg-[#FF4DA6]/10">
              <Wallet className="h-6 w-6 text-[#FF4DA6]" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center text-slate-100 mb-2">
            Wallet Connected
          </h2>

          <p className="text-center text-slate-400 mb-6">
            Your wallet is ready to explore your portfolio
          </p>

          <div className="bg-slate-950/50 border border-slate-700/30 rounded-lg p-4 mb-6">
            <p className="text-xs text-slate-400 mb-2">Connected Address:</p>
            <p className="text-sm font-mono text-[#FF4DA6] break-all">
              {walletAddress}
            </p>
          </div>

          <button
            onClick={onDisconnect}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-800/50 hover:bg-slate-700/50 text-slate-200 rounded-lg border border-slate-700/50 transition-colors font-medium"
          >
            <LogOut className="h-4 w-4" />
            Disconnect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center min-h-full">
      <div className="w-full max-w-md bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-xl p-8">
        <div className="flex justify-center mb-6">
          <div className="p-3 rounded-lg bg-[#FF4DA6]/10">
            <Wallet className="h-8 w-8 text-[#FF4DA6]" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-slate-100 mb-2">
          Connect Your Wallet
        </h2>

        <p className="text-center text-slate-400 mb-8">
          Connect your wallet to view your IP Assets portfolio, check balance,
          and remix assets directly.
        </p>

        <Button
          onClick={onConnect}
          className="w-full bg-[#FF4DA6] hover:bg-[#FF4DA6]/90 text-white rounded-lg font-semibold py-3"
        >
          <Wallet className="h-4 w-4 mr-2" />
          Connect Wallet
        </Button>

        <p className="text-center text-xs text-slate-500 mt-6">
          Secure connection powered by Privy and Story Protocol
        </p>
      </div>
    </div>
  );
};

export default ConnectWalletView;
