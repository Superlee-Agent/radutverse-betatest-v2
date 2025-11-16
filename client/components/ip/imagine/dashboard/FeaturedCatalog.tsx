import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const FeaturedCatalog = () => {
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState(false);

  const catalogImages = [
    "https://cdn.builder.io/api/v1/image/assets%2F01304b38e2b147e0ab91328119e9a69b%2Fd908ae6baae64d819c4a9f0eec438149?format=webp&width=800",
    "https://cdn.builder.io/api/v1/image/assets%2F01304b38e2b147e0ab91328119e9a69b%2Fd05ab18fd4264ebc9adf6c8e6fa7c661?format=webp&width=800",
    "https://cdn.builder.io/api/v1/image/assets%2F01304b38e2b147e0ab91328119e9a69b%2F4e6a253681954d7d9004a504916eeddc?format=webp&width=800",
    "https://cdn.builder.io/api/v1/image/assets%2F01304b38e2b147e0ab91328119e9a69b%2Ff5b6eb4c6bf441249e51c4b5ef88c092?format=webp&width=800",
  ];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-2xl overflow-hidden bg-slate-800"
      >
        <img
          src="https://cdn.builder.io/api/v1/image/assets%2F01304b38e2b147e0ab91328119e9a69b%2F2e3c90e4481c48f69e5c39498a60f29e?format=webp&width=800"
          alt="Ippy Background"
          className="w-full h-[180px] sm:h-[220px] md:h-[280px] object-cover"
        />

        <div className="absolute left-6 top-6 text-left">
          <div className="flex items-center gap-2">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
              Ippy
            </h3>
            <span className="text-xs bg-white/10 text-white px-2 py-1 rounded-full">
              IP
            </span>
          </div>
          <div className="mt-2 text-sm text-slate-200">by Story</div>
          <button
            onClick={() => setIsCatalogModalOpen(true)}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/90 text-slate-900 px-4 py-2 text-sm font-semibold shadow"
          >
            View Catalog
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {isCatalogModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
          >
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsCatalogModalOpen(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-slate-900 rounded-lg p-6 w-[90%] max-w-2xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">Catalog</h3>
                <button
                  onClick={() => setIsCatalogModalOpen(false)}
                  className="text-slate-300 hover:text-white"
                >
                  Close
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {catalogImages.map((src, i) => (
                  <div
                    key={i}
                    className="rounded-lg overflow-hidden bg-slate-800 flex items-center justify-center aspect-square"
                  >
                    <img
                      src={src}
                      alt={`catalog-${i}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
