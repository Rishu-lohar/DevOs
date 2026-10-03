import { z } from "zod";
import { taskStatusSchema } from "@/lib/task-status";

const taskFields = {
  title: z.string().trim().min(1, "Title is required"),
  projectId: z.string().trim().min(1, "projectId is required"),
  userId: z.string().trim().min(1, "userId is required"),
  status: taskStatusSchema,
};

export const createTaskSchema = z.object({
  ...taskFields,
  status: taskStatusSchema.optional(),
});

export const updateTaskSchema = z
  .object({
    title: taskFields.title.optional(),
    projectId: taskFields.projectId.optional(),
    userId: taskFields.userId.optional(),
    status: taskStatusSchema.optional(),
    completed: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, "At least one field is required");

export const taskRelations = {
  project: { select: { id: true, name: true } },
  user: { select: { id: true, name: true } },
};
