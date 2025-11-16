import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type WelcomeScreenProps = {
  onRegisterWork: () => void;
  onRemixWork: () => void;
};

type GuideStep = "idle" | "choose-file" | "type-register" | "complete";

export const WelcomeScreen = ({
  onRegisterWork,
  onRemixWork,
}: WelcomeScreenProps) => {
  const [guideStep, setGuideStep] = useState<GuideStep>("idle");
  const [fileButtonRect, setFileButtonRect] = useState<DOMRect | null>(null);
  const [inputRect, setInputRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (guideStep === "choose-file") {
      const fileBtn = document.querySelector("[data-file-input-btn]");
      if (fileBtn) {
        setFileButtonRect(fileBtn.getBoundingClientRect());
        const updateRect = () => {
          setFileButtonRect(fileBtn.getBoundingClientRect());
        };
        window.addEventListener("resize", updateRect);
        return () => window.removeEventListener("resize", updateRect);
      }
    }

    if (guideStep === "type-register") {
      const input = document.querySelector(
        "[data-chat-input]",
      ) as HTMLTextAreaElement;
      if (input) {
        setInputRect(input.getBoundingClientRect());
        const updateRect = () => {
          setInputRect(input.getBoundingClientRect());
        };
        window.addEventListener("resize", updateRect);
        return () => window.removeEventListener("resize", updateRect);
      }
    }
  }, [guideStep]);

  const handleRegisterClick = () => {
    setGuideStep("choose-file");
    onRegisterWork();
  };

  const handleFileChosen = () => {
    setGuideStep("type-register");
  };

  const handleSkipGuide = () => {
    setGuideStep("complete");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full flex items-center justify-center px-4"
    >
      {guideStep === "idle" ? (
        <div className="text-center max-w-2xl">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-2"
          >
            Welcome to Radut IP Assistant
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-300 mb-12"
          >
            What do you need?
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={handleRegisterClick}
              className="px-8 py-4 rounded-lg font-semibold text-white transition-all duration-200 bg-[#FF4DA6] hover:bg-[#FF4DA6]/90 hover:shadow-lg hover:shadow-[#FF4DA6]/30"
            >
              Licensing your works & explore
            </button>
            <button
              onClick={onRemixWork}
              className="px-8 py-4 rounded-lg font-semibold text-white transition-all duration-200 bg-slate-700 hover:bg-slate-600 hover:shadow-lg hover:shadow-slate-600/30"
            >
              Remix or create works
            </button>
          </motion.div>
        </div>
      ) : null}

      <AnimatePresence>
        {guideStep === "choose-file" && fileButtonRect && (
          <motion.div
            key="file-guide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-50"
          >
            <motion.div
              className="absolute inset-0 bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />

            <motion.div
              className="absolute border-2 border-[#FF4DA6] rounded-lg pointer-events-none"
              style={{
                left: fileButtonRect.left - 8,
                top: fileButtonRect.top - 8,
                width: fileButtonRect.width + 16,
                height: fileButtonRect.height + 16,
              }}
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(255, 77, 166, 0.7)",
                  "0 0 0 20px rgba(255, 77, 166, 0)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />

            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <motion.div
                className="text-white font-semibold text-lg mb-4 bg-[#FF4DA6] px-4 py-2 rounded-lg whitespace-nowrap"
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                ↑ Click to choose a file
              </motion.div>
            </motion.div>

            <motion.button
              onClick={handleFileChosen}
              className="absolute bottom-8 right-8 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-colors pointer-events-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Next Step →
            </motion.button>
          </motion.div>
        )}

        {guideStep === "type-register" && inputRect && (
          <motion.div
            key="input-guide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-50"
          >
            <motion.div
              className="absolute inset-0 bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />

            <motion.div
              className="absolute border-2 border-[#FF4DA6] rounded-lg pointer-events-none"
              style={{
                left: inputRect.left - 8,
                top: inputRect.top - 8,
                width: inputRect.width + 16,
                height: inputRect.height + 16,
              }}
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(255, 77, 166, 0.7)",
                  "0 0 0 20px rgba(255, 77, 166, 0)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />

            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <motion.div
                className="text-white font-semibold text-lg mb-4 bg-[#FF4DA6] px-4 py-2 rounded-lg whitespace-nowrap"
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                ↓ Type "register"
              </motion.div>
            </motion.div>

            <motion.button
              onClick={handleSkipGuide}
              className="absolute bottom-8 right-8 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-colors pointer-events-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Skip Guide
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
