interface ResultMediaDisplayProps {
  url: string;
  type: "image" | "video";
}

const ResultMediaDisplay = ({ url, type }: ResultMediaDisplayProps) => {
  return (
    <div className="mb-8">
      <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-[#FF4DA6]/20 p-1">
        <div className="bg-black rounded-xl overflow-hidden">
          {type === "image" ? (
            <img
              src={url}
              alt="Generated creation"
              className="w-full h-auto object-cover max-h-[600px]"
            />
          ) : (
            <video
              src={url}
              controls
              className="w-full h-auto object-cover max-h-[600px]"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultMediaDisplay;
