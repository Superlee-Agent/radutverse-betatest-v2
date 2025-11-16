import { useState, useCallback, useEffect } from "react";
import {
  STORY_NETWORKS,
  type NetworkType,
  getDefaultNetwork,
  setPreferredNetwork,
  getNetworkConfig,
} from "@/lib/network-config";

export function useStoryNetwork() {
  const [network, setNetworkState] = useState<NetworkType>(getDefaultNetwork());

  // Load network preference on mount
  useEffect(() => {
    const saved = localStorage.getItem("storyNetworkPreference") as NetworkType | null;
    if (saved && (saved === "mainnet" || saved === "testnet")) {
      setNetworkState(saved);
    }
  }, []);

  const switchNetwork = useCallback((newNetwork: NetworkType) => {
    setNetworkState(newNetwork);
    setPreferredNetwork(newNetwork);
  }, []);

  const config = getNetworkConfig(network);

  return {
    network,
    config,
    switchNetwork,
    networks: STORY_NETWORKS,
    isMainnet: network === "mainnet",
    isTestnet: network === "testnet",
  };
}
