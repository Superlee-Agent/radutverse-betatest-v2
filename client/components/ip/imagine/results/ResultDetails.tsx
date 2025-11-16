interface ResultDetailsProps {
  type: "image" | "video";
}

const ResultDetails = ({ type }: ResultDetailsProps) => {
  const formattedDate = new Date().toLocaleString();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="md:col-span-2">
        <div className="rounded-xl bg-slate-900/50 border border-slate-800/50 p-6">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">
            Result Type
          </h3>
          <p className="text-slate-200 leading-relaxed capitalize">
            {type} generation completed successfully
          </p>
        </div>
      </div>

      <div>
        <div className="rounded-xl bg-slate-900/50 border border-slate-800/50 p-6">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">
            Details
          </h3>
          <div className="space-y-3 text-sm">
            <div>
              <div className="text-xs text-slate-500 mb-1">Type</div>
              <div className="text-slate-200 capitalize font-medium">
                {type}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">Generated At</div>
              <div className="text-slate-200 text-xs">{formattedDate}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultDetails;
