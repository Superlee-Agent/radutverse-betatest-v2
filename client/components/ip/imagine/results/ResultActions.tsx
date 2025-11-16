import { Button } from "@/components/ui/button";

interface ResultActionsProps {
  type: "image" | "video";
  isLoading: boolean;
  onDownload: () => void;
  onShare: () => void;
  onUpscale?: () => void;
  onCreateAnother: () => void;
}

const ResultActions = ({
  type,
  isLoading,
  onDownload,
  onShare,
  onUpscale,
  onCreateAnother,
}: ResultActionsProps) => {
  return (
    <div className="flex flex-wrap gap-3 mb-8">
      <Button
        onClick={onDownload}
        className="bg-[#FF4DA6] hover:bg-[#FF4DA6]/80 text-white"
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
          className="bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700"
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
        className="bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700"
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
        className="bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 ml-auto"
        variant="outline"
      >
        Create Another
      </Button>
    </div>
  );
};

export default ResultActions;
