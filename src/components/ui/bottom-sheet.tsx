"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

interface BottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}

/**
 * Apple-style bottom sheet. Springs up from the bottom edge, can be dragged
 * down to dismiss, and hands the drag's velocity + momentum to the settle
 * spring so a flick throws it closed. Fully interruptible — grab it mid-flight
 * and it follows the finger. Respects prefers-reduced-motion with a plain fade.
 */
export function BottomSheet({ open, onOpenChange, children }: BottomSheetProps) {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Scrim — dims the portal to focus the task (Apple §12). */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={() => onOpenChange(false)}
            aria-hidden
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            className="fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[92dvh] w-full max-w-md flex-col border-t border-zinc-200 bg-[#F8F7FC]"
            initial={reduceMotion ? { opacity: 0 } : { y: "100%" }}
            animate={reduceMotion ? { opacity: 1 } : { y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { y: "100%" }}
            transition={
              reduceMotion
                ? { duration: 0.15 }
                : { type: "spring", bounce: 0.1, duration: 0.45 }
            }
            drag={reduceMotion ? false : "y"}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => {
              // Dismiss on a meaningful downward drag, or on a fast flick
              // (velocity handoff / momentum projection — Apple §5/§6).
              if (info.offset.y > 120 || info.velocity.y > 700) {
                onOpenChange(false);
              }
            }}
          >
            {/* Drag handle */}
            <div className="flex shrink-0 justify-center pt-3" aria-hidden>
              <span className="h-1 w-10 rounded-full bg-zinc-300" />
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
