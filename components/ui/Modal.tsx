"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { ReactNode } from "react";

export function Modal({
  open,
  onClose,
  title,
  children,
  "data-testid": testId,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  "data-testid"?: string;
}) {
  return (
    <AnimatePresence>
      {open && (
        <div data-testid={testId || "ui-modal"} className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/75"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-[16px] border border-[#232326] bg-[#111113] p-6"
          >
            <div className="mb-5 flex items-center justify-between border-b border-[#232326] pb-4">
              <h2 className="text-base font-semibold tracking-tight text-[#FAFAFA]">{title}</h2>
              <button
                data-testid="modal-close-button"
                onClick={onClose}
                aria-label="Close"
                className="rounded-[8px] p-1.5 text-[#71717A] transition-colors duration-150 hover:bg-[#18181B] hover:text-[#FAFAFA]"
              >
                <X size={16} />
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
