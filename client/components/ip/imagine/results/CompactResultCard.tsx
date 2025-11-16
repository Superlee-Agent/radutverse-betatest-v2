import { useState, Dispatch, SetStateAction } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CompactResultCardProps {
  imageUrl: string;
  type: "image" | "video";
  isLoading: boolean;
  onDownload: () => void;
  onShare: () => void;
  onUpscale?: () => void;
  onCreateAnother: () => void;
  isExpanded?: boolean;
  setIsExpanded?: Dispatch<SetStateAction<boolean>>;
}

const CompactResultCard = ({
  imageUrl,
  type,
  isLoading,
  onDownload,
  onShare,
  onUpscale,
  onCreateAnother,
  isExpanded: externalIsExpanded = false,
  setIsExpanded: externalSetIsExpanded,
}: CompactResultCardProps) => {
  const [localIsExpanded, setLocalIsExpanded] = useState(false);
  const isExpanded = externalSetIsExpanded
    ? externalIsExpanded
    : localIsExpanded;
  const setIsExpanded = externalSetIsExpanded || setLocalIsExpanded;
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);

  if (isExpanded) {
    return (
      <motion.div
        key="expanded"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-2xl mx-auto flex flex-col h-[calc(100vh-180px)]"
      >
        {/* Large Image */}
        <motion.div
          className="relative rounded-lg overflow-hidden bg-black border-2 border-[#FF4DA6]/50 shadow-lg flex-1 flex items-center justify-center min-h-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {type === "image" ? (
            <img
              src={imageUrl}
              alt="Generation result"
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <video
              src={imageUrl}
              className="max-w-full max-h-full object-contain"
              controls
            />
          )}

          {/* Type Badge */}
          <div className="absolute top-3 right-3 text-xs font-medium bg-slate-900/80 text-slate-300 px-2 py-1 rounded">
            {type === "image" ? "🖼" : "🎬"}
          </div>

          {/* Close Button */}
          <button
            onClick={() => setIsExpanded(false)}
            className="absolute top-3 left-3 p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 transition-colors"
            type="button"
            aria-label="Close expanded view"
          >
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </motion.div>

        {/* Action Buttons - Horizontal */}
        <motion.div
          className="flex flex-wrap gap-2 justify-center mt-4 flex-shrink-0"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <button
            onClick={onDownload}
            className="flex-1 min-w-[100px] px-4 py-3 rounded-lg bg-[#FF4DA6] hover:bg-[#FF4DA6]/80 text-white font-medium transition-colors flex items-center justify-center gap-2"
            title="Download"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Download
          </button>

          <button
            onClick={onShare}
            className="flex-1 min-w-[100px] px-4 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 font-medium transition-colors flex items-center justify-center gap-2"
            title="Share"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C9.589 12.881 10.647 12.5 12 12.5c1.353 0 2.411.381 3.316.842M9 6a3 3 0 110-6 3 3 0 010 6zM9 6h.01M15 20c0 1.105-.895 2-2 2s-2-.895-2-2m0 0c0 1.105-.895 2-2 2s-2-.895-2-2m0 0c0-5.39 4.478-9.75 10-9.75s10 4.36 10 9.75"
              />
            </svg>
            Share
          </button>

          {onUpscale && type === "image" && (
            <button
              onClick={onUpscale}
              className="flex-1 min-w-[100px] px-4 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 font-medium transition-colors flex items-center justify-center gap-2"
              title="Upscale"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16V4m0 0L3 8m4-4l4 4V20m6-4v4m0-12l4-4m-4 4l-4-4"
                />
              </svg>
              Upscale
            </button>
          )}

          <div className="relative">
            <button
              onClick={() => setShowSettingsMenu(!showSettingsMenu)}
              className="flex-1 min-w-[100px] px-4 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 font-medium transition-colors flex items-center justify-center gap-2"
              title="Options"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="5" cy="12" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="19" cy="12" r="2" />
              </svg>
              Options
            </button>

            {/* Settings Menu Popup */}
            <AnimatePresence>
              {showSettingsMenu && (
                <>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 8 }}
                    className="absolute bottom-full mb-2 right-0 bg-slate-950 border border-slate-800 rounded-lg shadow-xl z-50 min-w-[200px]"
                  >
                    <button
                      onClick={() => {
                        setShowSettingsMenu(false);
                        // Navigate to remix mode or open remix dialog
                        window.location.hash = "#remix";
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-slate-900 first:rounded-t-lg transition-colors flex items-center gap-3 group"
                    >
                      <svg
                        className="w-5 h-5 text-[#FF4DA6] group-hover:text-[#FF4DA6]/80"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16V4m0 0L3 8m4-4l4 4V20m6-4v4m0-12l4-4m-4 4l-4-4"
                        />
                      </svg>
                      <div>
                        <p className="font-medium text-slate-100">Remix</p>
                        <p className="text-xs text-slate-400">
                          Create variations
                        </p>
                      </div>
                    </button>

                    <div className="border-t border-slate-800" />

                    <button
                      onClick={() => {
                        setShowSettingsMenu(false);
                        // Navigate to licensing or open licensing dialog
                        window.location.hash = "#licensing";
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-slate-900 last:rounded-b-lg transition-colors flex items-center gap-3 group"
                    >
                      <svg
                        className="w-5 h-5 text-[#FF4DA6] group-hover:text-[#FF4DA6]/80"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <div>
                        <p className="font-medium text-slate-100">Licensing</p>
                        <p className="text-xs text-slate-400">Manage rights</p>
                      </div>
                    </button>
                  </motion.div>

                  {/* Close menu when clicking outside */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowSettingsMenu(false)}
                  />
                </>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      key="compact"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      onClick={() => setIsExpanded(true)}
      className="relative w-40 h-40 rounded-lg overflow-hidden bg-black border-2 border-[#FF4DA6]/50 shadow-lg group cursor-pointer hover:border-[#FF4DA6] hover:shadow-lg hover:shadow-[#FF4DA6]/20 transition-all"
    >
      {type === "image" ? (
        <img
          src={imageUrl}
          alt="Generation result"
          className="w-full h-full object-cover"
        />
      ) : (
        <video src={imageUrl} className="w-full h-full object-cover" />
      )}

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
        <p className="text-xs text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          Click to expand
        </p>
      </div>

      {/* Type Badge */}
      <div className="absolute top-1 right-1 text-xs font-medium bg-slate-900/80 text-slate-300 px-2 py-1 rounded">
        {type === "image" ? "🖼" : "🎬"}
      </div>
    </motion.div>
  );
};

export default CompactResultCard;
