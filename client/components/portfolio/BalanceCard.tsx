import { Loader } from "lucide-react";

type BalanceCardProps = {
  balance: string;
  isLoading?: boolean;
  error?: string | null;
};

const formatBalance = (balance: string): string => {
  try {
    const num = parseFloat(balance);
    if (isNaN(num)) return "0.00";
    // Format to 6 decimal places for display
    return num.toFixed(6).replace(/\.?0+$/, "") || "0";
  } catch {
    return "0.00";
  }
};

export const BalanceCard = ({
  balance,
  isLoading = false,
  error,
}: BalanceCardProps) => {
  const displayBalance = formatBalance(balance);

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">
          Story Balance
        </h3>
        <div className="p-2 rounded-lg bg-amber-400/10 flex-shrink-0">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F2711b768900f460f84e959042bd91f7e%2Fbf98846c81d64a40907b1b44aeda1f23?format=webp&width=80"
            alt="IP Token"
            className="h-5 w-5"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 animate-pulse">
          <Loader className="h-4 w-4 animate-spin text-amber-400" />
          <span className="text-slate-400">Loading balance...</span>
        </div>
      ) : error ? (
        <div>
          <p className="text-xs text-red-400/70 mb-1">Unable to load balance</p>
          <p className="text-2xl font-bold text-slate-300">-- --</p>
        </div>
      ) : (
        <div>
          <p className="text-3xl font-bold text-amber-400 mb-1">
            {displayBalance}
          </p>
          <p className="text-xs text-slate-500">Story (STORY) token</p>
        </div>
      )}
    </div>
  );
};

export default BalanceCard;
