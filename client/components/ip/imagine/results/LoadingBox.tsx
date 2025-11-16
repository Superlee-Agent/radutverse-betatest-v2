import { motion } from "framer-motion";

interface LoadingBoxProps {
  message?: string;
}

const LoadingBox = ({
  message = "Crafting your image...",
}: LoadingBoxProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="fixed top-6 left-6 md:left-[calc(256px+1.5rem)] z-50 w-40 h-40 rounded-lg bg-black border-2 border-[#FF4DA6]/50 shadow-lg flex flex-col items-center justify-center p-6"
    >
      {/* Spinner */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="mb-4"
      >
        <svg
          className="h-10 w-10 text-[#FF4DA6]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      </motion.div>

      {/* Text */}
      <p className="text-sm font-semibold text-slate-200 text-center leading-tight">
        {message}
      </p>
    </motion.div>
  );
};

export default LoadingBox;
