import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface FlyingImageAnimationProps {
  isActive: boolean;
  targetRef: React.RefObject<HTMLElement>;
  onComplete?: () => void;
}

const FlyingImageAnimation = ({
  isActive,
  targetRef,
  onComplete,
}: FlyingImageAnimationProps) => {
  const startRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive || !targetRef.current || !startRef.current) return;

    const startRect = startRef.current.getBoundingClientRect();
    const targetRect = targetRef.current.getBoundingClientRect();

    const startX = startRect.left + startRect.width / 2;
    const startY = startRect.top + startRect.height / 2;
    const endX = targetRect.left + targetRect.width / 2;
    const endY = targetRect.top + targetRect.height / 2;

    const deltaX = endX - startX;
    const deltaY = endY - startY;

    const animationElement = startRef.current;
    if (animationElement) {
      const animation = animationElement.animate(
        [
          {
            transform: `translate(0, 0) scale(1)`,
            opacity: 1,
          },
          {
            transform: `translate(${deltaX}px, ${deltaY}px) scale(0.3)`,
            opacity: 0,
          },
        ],
        {
          duration: 800,
          easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          fill: "forwards",
        },
      );

      const timer = setTimeout(() => {
        onComplete?.();
      }, 800);

      return () => {
        animation.cancel();
        clearTimeout(timer);
      };
    }
  }, [isActive, targetRef, onComplete]);

  if (!isActive) return null;

  return (
    <div
      ref={startRef}
      className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none"
    >
      <motion.div
        initial={{ opacity: 1, scale: 1 }}
        className="w-16 h-16 rounded-lg bg-gradient-to-br from-[#FF4DA6] to-[#FF4DA6]/60 border-2 border-[#FF4DA6] shadow-lg flex items-center justify-center"
      >
        <svg
          className="w-8 h-8 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      </motion.div>
    </div>
  );
};

export default FlyingImageAnimation;
