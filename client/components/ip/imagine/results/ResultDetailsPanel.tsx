import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface ResultDetailsPanelProps {
  type: "image" | "video";
  isLoading: boolean;
  onDownload: () => void;
  onShare: () => void;
  onUpscale?: () => void;
  onCreateAnother: () => void;
  onClose: () => void;
}

const ResultDetailsPanel = ({
  type,
  isLoading,
  onDownload,
  onShare,
  onUpscale,
  onCreateAnother,
  onClose,
}: ResultDetailsPanelProps) => {
  const formattedDate = new Date().toLocaleString("id-ID");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      className="absolute top-full mt-2 left-0 w-80 bg-gradient-to-br from-slate-900 to-slate-950 border border-[#FF4DA6]/20 rounded-xl shadow-xl p-6 z-50"
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-slate-400 hover:text-slate-200 transition-colors"
        type="button"
        aria-label="Close details"
      >
        ✕
      </button>

      {/* Result Type */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-2">
          Result Type
        </h3>
        <p className="text-slate-200 leading-relaxed capitalize">
          {type} generation completed successfully
        </p>
      </div>

      {/* Details */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">
          Details
        </h3>
        <div className="space-y-3 text-sm">
          <div>
            <div className="text-xs text-slate-500 mb-1">Type</div>
            <div className="text-slate-200 capitalize font-medium">{type}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-1">Generated At</div>
            <div className="text-slate-200 text-xs">{formattedDate}</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2">
        <Button
          onClick={onDownload}
          className="bg-[#FF4DA6] hover:bg-[#FF4DA6]/80 text-white w-full"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Download
        </Button>

        {type === "image" && onUpscale && (
          <Button
            onClick={onUpscale}
            className="bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 w-full"
            variant="outline"
            disabled={isLoading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 20v-4m0 4h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"
              />
            </svg>
            Upscale
          </Button>
        )}

        <Button
          onClick={onShare}
          className="bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 w-full"
          variant="outline"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.684 13.342C9.589 12.438 10.994 12 12.505 12c1.511 0 2.916.438 3.821 1.342m-9.821 7.115c-3.848-3.848-3.848-10.088 0-13.936 3.848-3.848 10.088-3.848 13.936 0 3.848 3.848 3.848 10.088 0 13.936-3.848 3.848-10.088 3.848-13.936 0z"
            />
          </svg>
          Share
        </Button>

        <Button
          onClick={onCreateAnother}
          className="bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 w-full"
          variant="outline"
        >
          Create Another
        </Button>
      </div>
    </motion.div>
  );
};

export default ResultDetailsPanel;
