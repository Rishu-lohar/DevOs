import { z } from "zod";

const prioritySchema = z.enum(["urgent", "high", "medium", "low"]);
const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine((value) => {
    const date = new Date(`${value}T00:00:00.000Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
  });

export const planTaskSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(4000),
  priority: prioritySchema,
  estimate: z.number().int().min(1).max(160),
  milestoneIndex: z.number().int().min(0).nullable(),
  dependencies: z.array(z.number().int().min(0)).max(50),
  dueDate: dateSchema.nullable(),
});

export const workspacePlanSchema = z.object({
  title: z.string().trim().min(1).max(160),
  source: z.enum(["ollama", "fallback"]),
  fallbackReason: z.string().max(500).nullable(),
  milestones: z.array(
    z.object({
      title: z.string().trim().min(1).max(160),
      description: z.string().trim().min(1).max(2000),
      dueDate: dateSchema.nullable(),
    }),
  ).max(20),
  tasks: z.array(planTaskSchema).min(1).max(100),
  recommendations: z.array(z.string().trim().min(1).max(500)).max(10),
  risks: z.array(z.string().trim().min(1).max(500)).max(10),
});

export const createWorkspacePlanRequestSchema = z.object({
  projectId: z.string().trim().min(1).optional(),
  projectName: z.string().trim().min(1).max(160).optional(),
  requirements: z.string().trim().min(1).max(20000),
  mode: z.enum(["individual", "manager"]),
});

export const approveWorkspacePlanRequestSchema = z.object({
  projectId: z.string().trim().min(1).optional(),
  newProject: z.object({
    name: z.string().trim().min(1).max(160),
    description: z.string().trim().max(2000).nullable(),
  }).optional(),
  mode: z.enum(["individual", "manager"]),
  requirements: z.string().trim().min(1).max(20000),
  plan: workspacePlanSchema,
  assigneeIds: z.array(z.string().trim().min(1).nullable()).max(100),
});

export function validatePlanReferences(
  plan: z.infer<typeof workspacePlanSchema>,
) {
  for (const [index, task] of plan.tasks.entries()) {
    if (
      task.milestoneIndex !== null &&
      task.milestoneIndex >= plan.milestones.length
    ) {
      return "A task references a milestone outside the plan";
    }

    if (
      task.dependencies.some((dependency) => dependency >= index) ||
      new Set(task.dependencies).size !== task.dependencies.length
    ) {
      return "Task dependencies must uniquely reference earlier tasks";
    }
  }

  return null;
}
