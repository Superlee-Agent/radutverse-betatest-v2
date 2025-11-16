import { Globe } from "lucide-react";
import { type NetworkType } from "@/lib/network-config";

type NetworkSelectorProps = {
  currentNetwork: NetworkType;
  onNetworkChange: (network: NetworkType) => void;
};

export const NetworkSelector = ({
  currentNetwork,
  onNetworkChange,
}: NetworkSelectorProps) => {
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg">
      <Globe className="h-4 w-4 text-[#FF4DA6]" />
      <select
        value={currentNetwork}
        onChange={(e) => onNetworkChange(e.target.value as NetworkType)}
        className="bg-transparent text-sm font-medium text-slate-200 border-0 outline-none cursor-pointer hover:text-[#FF4DA6] transition-colors"
      >
        <option value="testnet" className="bg-slate-900 text-slate-100">
          Testnet (Aeneid)
        </option>
        <option value="mainnet" className="bg-slate-900 text-slate-100">
          Mainnet
        </option>
      </select>
    </div>
  );
};

export default NetworkSelector;
