import { motion } from "framer-motion";
import type { Generation } from "@/types/generation";

interface ResultGalleryProps {
  creations: Generation[];
  selectedId: string | null;
  onSelectCreation: (id: string) => void;
  onRemoveCreation: (id: string) => void;
}

const ResultGallery = ({
  creations,
  selectedId,
  onSelectCreation,
  onRemoveCreation,
}: ResultGalleryProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-8"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-100">
          Generation History
        </h3>
        <span className="text-sm text-slate-400">
          {creations.length} creation{creations.length !== 1 ? "s" : ""}
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 rounded-lg bg-slate-900/30 p-4 border border-slate-800/50">
        {creations.map((creation) => (
          <motion.div
            key={creation.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative group cursor-pointer rounded-lg overflow-hidden aspect-square border-2 transition-all ${
              selectedId === creation.id
                ? "border-[#FF4DA6] ring-2 ring-[#FF4DA6]/50"
                : "border-slate-700/50 hover:border-slate-600"
            }`}
            onClick={() => onSelectCreation(creation.id)}
          >
            {creation.type === "image" ? (
              <img
                src={creation.url}
                alt="Creation thumbnail"
                className="w-full h-full object-cover"
              />
            ) : (
              <video
                src={creation.url}
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveCreation(creation.id);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-600/80 hover:bg-red-700 text-white rounded-full p-2"
                title="Delete"
                type="button"
              >
                ✕
              </button>
            </div>
            <div className="absolute top-1 right-1 text-xs font-medium bg-slate-900/80 text-slate-300 px-2 py-1 rounded">
              {creation.type === "image" ? "🖼" : "🎬"}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ResultGallery;
