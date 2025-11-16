export function RouteLoader() {
  return (
    <div className="flex h-screen items-center justify-center bg-[#05070f]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-[#FF4DA6]"></div>
        <p className="text-sm text-slate-400">Loading...</p>
      </div>
    </div>
  );
}
