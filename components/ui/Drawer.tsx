"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { ReactNode } from "react";

export function Drawer({
  open,
  onClose,
  children,
  title,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            onClick={(event) => event.stopPropagation()}
            className="relative z-10 ml-auto flex h-full w-full max-w-md flex-col border-l border-white/[0.08] bg-[#0c1018]/95 p-6 shadow-2xl backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
              {title && <h3 className="text-base font-semibold text-white">{title}</h3>}
              <button
                onClick={onClose}
                aria-label="Close drawer"
                className="ml-auto rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-4">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
