import { z } from "zod";

export const taskStatusValues = ["TODO", "IN_PROGRESS", "DONE", "BLOCKED"] as const;

export const taskStatusSchema = z
  .string()
  .transform((status) => status.trim().toUpperCase().replace(/[\s-]+/g, "_"))
  .pipe(z.enum(taskStatusValues));

export type TaskStatusValue = (typeof taskStatusValues)[number];
