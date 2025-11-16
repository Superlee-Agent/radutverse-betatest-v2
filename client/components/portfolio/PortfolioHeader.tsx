import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

type PortfolioHeaderProps = {
  walletAddress?: string | null;
  assetCount?: number;
  onDisconnect?: () => void;
};

export const PortfolioHeader = ({
  walletAddress,
  assetCount = 0,
  onDisconnect,
}: PortfolioHeaderProps) => {
  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="bg-slate-800/30 border-b border-slate-700/30 px-6 py-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex-1">
          <h2 className="text-xl font-bold text-slate-100 mb-1">
            My IP Portfolio
          </h2>
          <p className="text-sm text-slate-400">
            {walletAddress && (
              <>
                Connected:{" "}
                <span className="text-[#FF4DA6]">
                  {truncateAddress(walletAddress)}
                </span>
              </>
            )}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {assetCount !== undefined && (
            <div className="text-right">
              <p className="text-sm text-slate-400">Total IP Assets</p>
              <p className="text-2xl font-bold text-[#FF4DA6]">{assetCount}</p>
            </div>
          )}

          {onDisconnect && (
            <Button
              onClick={onDisconnect}
              className="bg-slate-700/50 hover:bg-slate-600/50 text-slate-200 border border-slate-600/50 flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Disconnect</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioHeader;
