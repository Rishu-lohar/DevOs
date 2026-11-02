import { z } from "zod";
import { taskStatusSchema } from "@/lib/task-status";

const taskFields = {
  title: z.string().trim().min(1, "Title is required"),
  projectId: z.string().trim().min(1, "projectId is required"),
  status: taskStatusSchema,
  description: z.string().trim().max(4000).nullable().optional(),
  priority: z.enum(["urgent", "high", "medium", "low"]).nullable().optional(),
  estimate: z.number().int().min(1).max(160).nullable().optional(),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
};

export const createTaskSchema = z.object({
  ...taskFields,
  status: taskStatusSchema.optional(),
});

export const updateTaskSchema = z
  .object({
    title: taskFields.title.optional(),
    projectId: taskFields.projectId.optional(),
    status: taskStatusSchema.optional(),
    description: taskFields.description,
    priority: taskFields.priority,
    estimate: taskFields.estimate,
    dueDate: taskFields.dueDate,
    completed: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, "At least one field is required");

export const taskRelations = {
  project: { select: { id: true, name: true } },
  user: { select: { id: true, name: true } },
};
