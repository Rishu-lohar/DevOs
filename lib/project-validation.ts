import { z } from "zod";

const projectFields = {
  name: z.string().trim().min(1, "Name is required"),
  description: z.string().trim().nullable().optional(),
  status: z.string().trim().min(1).optional(),
  userId: z.string().trim().min(1, "userId is required"),
};

export const createProjectSchema = z.object(projectFields);
export const updateProjectSchema = z
  .object({
    name: projectFields.name.optional(),
    description: projectFields.description,
    status: projectFields.status,
    userId: projectFields.userId.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, "At least one field is required");

export const projectRelations = {
  user: { select: { id: true, name: true } },
  tasks: { select: { id: true, status: true } },
};
