import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Loader, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export type IpAsset = {
  ipId: string;
  title: string;
  mediaUrl?: string;
  mediaType?: string;
  thumbnailUrl?: string;
  ownerAddress?: string;
  creator?: string;
  registrationDate?: string;
  network?: "testnet" | "mainnet";
};

type IpAssetsGridProps = {
  assets: IpAsset[];
  isLoading?: boolean;
  error?: string | null;
  onRemix?: (asset: IpAsset) => void;
};

export const IpAssetsGrid = ({
  assets,
  isLoading = false,
  error,
  onRemix,
}: IpAssetsGridProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader className="h-8 w-8 animate-spin text-[#FF4DA6] mb-3" />
        <p className="text-slate-400">Loading your IP Assets...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20 rounded-lg">
        <AlertCircle className="h-8 w-8 text-red-400 mb-3" />
        <p className="text-red-400 text-center max-w-md">{error}</p>
      </div>
    );
  }

  if (assets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="p-4 rounded-lg bg-slate-800/50 mb-4">
          <Play className="h-8 w-8 text-slate-500" />
        </div>
        <h3 className="text-lg font-semibold text-slate-200 mb-1">
          No IP Assets Yet
        </h3>
        <p className="text-slate-400 text-center max-w-md">
          You haven't created or owned any IP Assets yet. Start by creating your
          first asset using IP Imagine.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <AnimatePresence>
        {assets.map((asset, index) => (
          <motion.div
            key={asset.ipId}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className="group relative bg-slate-800/50 border border-slate-700/50 rounded-lg overflow-hidden hover:border-[#FF4DA6]/30 transition-colors"
          >
            {/* Asset Media */}
            <div className="relative aspect-square bg-slate-900 overflow-hidden">
              {asset.mediaUrl ? (
                asset.mediaType?.startsWith("video") ? (
                  <video
                    src={asset.mediaUrl}
                    poster={asset.thumbnailUrl}
                    className="w-full h-full object-cover"
                  />
                ) : asset.mediaType?.startsWith("audio") ? (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#FF4DA6]/10 mb-3">
                        <svg
                          className="w-8 h-8 text-[#FF4DA6]"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M18 3a1 1 0 00-1.196-.15l-5.694 3.763A1 1 0 0010 6.5v7a1 1 0 001.11.95l5.694-3.763A1 1 0 0018 9.5V3z" />
                          <path d="M2 4a1 1 0 011-1h4a1 1 0 011 1v12a1 1 0 01-1 1H3a1 1 0 01-1-1V4z" />
                        </svg>
                      </div>
                      <p className="text-xs text-slate-400">Audio</p>
                    </div>
                  </div>
                ) : (
                  <img
                    src={asset.mediaUrl}
                    alt={asset.title}
                    className="w-full h-full object-cover"
                  />
                )
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-700/50 mb-2">
                      <span className="text-2xl">🖼️</span>
                    </div>
                    <p className="text-xs text-slate-400">No media</p>
                  </div>
                </div>
              )}

              {/* Overlay */}
              <motion.div
                className="absolute inset-0 bg-black/60 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  onClick={() => onRemix?.(asset)}
                  className="bg-[#FF4DA6] hover:bg-[#FF4DA6]/90 text-white rounded-lg font-semibold flex items-center gap-2"
                >
                  <Play className="h-4 w-4" />
                  Remix
                </Button>
              </motion.div>
            </div>

            {/* Asset Info */}
            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h4 className="font-semibold text-slate-100 text-sm truncate flex-1">
                  {asset.title || "Untitled Asset"}
                </h4>
              </div>

              <div className="space-y-2 text-xs">
                {asset.ipId && (
                  <div>
                    <p className="text-slate-500 mb-0.5">IP ID</p>
                    <p className="text-slate-400 font-mono truncate">
                      {asset.ipId.slice(0, 10)}...{asset.ipId.slice(-8)}
                    </p>
                  </div>
                )}

                {asset.creator && (
                  <div>
                    <p className="text-slate-500 mb-0.5">Creator</p>
                    <p className="text-slate-400 font-mono truncate">
                      {asset.creator.slice(0, 10)}...{asset.creator.slice(-8)}
                    </p>
                  </div>
                )}

                {asset.registrationDate && (
                  <div>
                    <p className="text-slate-500 mb-0.5">Registered</p>
                    <p className="text-slate-400">
                      {new Date(asset.registrationDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default IpAssetsGrid;
