"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/** Standard page frame: header row + content. Identical on every page. */
export function PageHeader({
  title,
  description,
  actions,
  tabs,
  className,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  tabs?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "sticky top-0 z-20 border-b border-border bg-background px-4 pt-4 sm:px-6",
        tabs ? "pb-0" : "pb-4",
        className,
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1
            data-testid="page-title"
            className="text-[18px] font-semibold tracking-[-0.02em] text-text-primary"
          >
            {title}
          </h1>
          {description && (
            <p className="mt-0.5 text-[12px] text-text-muted">{description}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      {tabs && <div className="mt-3">{tabs}</div>}
    </div>
  );
}

export function PageBody({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className={cn("px-4 py-4 sm:px-6", className)}
    >
      {children}
    </motion.div>
  );
}

export function SectionTitle({
  title,
  action,
  className,
}: {
  title: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-2 flex items-center justify-between", className)}>
      <h2 className="text-[12px] font-medium uppercase tracking-[0.06em] text-text-muted">
        {title}
      </h2>
      {action}
    </div>
  );
}
