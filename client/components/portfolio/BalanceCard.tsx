import { Coins, Loader } from "lucide-react";

type BalanceCardProps = {
  balance: string;
  isLoading?: boolean;
  error?: string | null;
};

export const BalanceCard = ({
  balance,
  isLoading = false,
  error,
}: BalanceCardProps) => {
  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">
          Story Balance
        </h3>
        <div className="p-2 rounded-lg bg-[#FF4DA6]/10">
          <Coins className="h-4 w-4 text-[#FF4DA6]" />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 animate-pulse">
          <Loader className="h-4 w-4 animate-spin text-[#FF4DA6]" />
          <span className="text-slate-400">Loading balance...</span>
        </div>
      ) : error ? (
        <div>
          <p className="text-xs text-red-400/70 mb-1">Unable to load balance</p>
          <p className="text-2xl font-bold text-slate-300">-- --</p>
        </div>
      ) : (
        <div>
          <p className="text-3xl font-bold text-[#FF4DA6] mb-1">{balance}</p>
          <p className="text-xs text-slate-500">Story (STORY) token</p>
        </div>
      )}
    </div>
  );
};

export default BalanceCard;
