"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { ReactNode } from "react";

export function Drawer({
  open,
  onClose,
  children,
  title,
  "data-testid": testId,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  "data-testid"?: string;
}) {
  return (
    <AnimatePresence>
      {open && (
        <div data-testid={testId || "ui-drawer"} className="fixed inset-0 z-50 flex">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(event) => event.stopPropagation()}
            className="relative z-10 ml-auto flex h-full w-full max-w-md flex-col border-l border-[#232326] bg-[#111113] p-6"
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#232326]">
              {title && <h3 className="text-base font-semibold text-[#FAFAFA]">{title}</h3>}
              <button
                data-testid="drawer-close-button"
                onClick={onClose}
                aria-label="Close drawer"
                className="ml-auto rounded-[8px] p-1.5 text-[#71717A] hover:bg-[#18181B] hover:text-[#FAFAFA] transition-colors duration-150"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-4">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
