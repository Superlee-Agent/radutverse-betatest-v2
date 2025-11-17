export const STORY_NETWORKS = {
  testnet: {
    id: "aeneid",
    chainId: 1514,
    name: "Story Testnet (Aeneid)",
    rpc: import.meta.env.VITE_PUBLIC_STORY_RPC || "https://aeneid.storyrpc.io",
    apiBase: "https://api.storyapis.com/api/v4",
    explorer: "https://aeneid.explorer.story.foundation",
    currency: "IP",
  },
  mainnet: {
    id: "story",
    chainId: 1514,
    name: "Story Mainnet",
    rpc:
      import.meta.env.VITE_PUBLIC_STORY_MAINNET_RPC ||
      "https://mainnet.storyrpc.io",
    apiBase: "https://api.storyapis.com/api/v4",
    explorer: "https://www.storyscan.io",
    currency: "IP",
  },
};

export type NetworkType = keyof typeof STORY_NETWORKS;

export function getNetworkConfig(network: NetworkType) {
  return STORY_NETWORKS[network];
}

export function getDefaultNetwork(): NetworkType {
  // Check if testnet is explicitly requested
  const preferredNetwork = localStorage.getItem("storyNetworkPreference");
  if (preferredNetwork === "testnet") {
    return "testnet";
  }
  // Default to mainnet
  return "mainnet";
}

export function setPreferredNetwork(network: NetworkType) {
  localStorage.setItem("storyNetworkPreference", network);
}
