import "server-only";

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { db } from "@/lib/db";
import { getProjectAccess } from "@/lib/project-access";
import {
  getGitHubRepositoryForMcp,
  GitHubIntegrationError,
  listGitHubRepositoriesForMcp,
} from "@/lib/github";
import {
  listAuthorizedProjectFiles,
  ProjectFilesystemError,
  readAuthorizedProjectFile,
} from "@/lib/mcp/filesystem";
import {
  containsSensitiveContent,
  SensitiveToolOutputError,
} from "@/lib/mcp/sensitive-content";

class ProjectAuthorizationError extends Error {
  constructor(readonly code: "not_found" | "forbidden") {
    super(code);
  }
}

class ProjectRepositoryMappingError extends Error {
  constructor(readonly code: "not_configured" | "not_mapped" | "unavailable") {
    super(code);
  }
}

async function requireProjectAccess(userId: string, projectId: string) {
  const access = await getProjectAccess(projectId, userId);
  if (!access) throw new ProjectAuthorizationError("not_found");
  if (!access.role) throw new ProjectAuthorizationError("forbidden");
  return access;
}

function getMappedProjectRepositories(projectId: string) {
  const mappingValue = process.env.DEVHUB_MCP_PROJECT_REPOSITORIES;
  if (!mappingValue) throw new ProjectRepositoryMappingError("not_configured");

  let mapping: unknown;
  try {
    mapping = JSON.parse(mappingValue);
  } catch {
    throw new ProjectRepositoryMappingError("not_configured");
  }
  if (!mapping || typeof mapping !== "object" || Array.isArray(mapping)) {
    throw new ProjectRepositoryMappingError("not_configured");
  }

  const configured = (mapping as Record<string, unknown>)[projectId];
  const repositories =
    typeof configured === "string"
      ? [configured]
      : Array.isArray(configured) && configured.every((item) => typeof item === "string")
        ? configured
        : [];
  if (
    repositories.length === 0 ||
    repositories.some((repository) => !/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository))
  ) {
    throw new ProjectRepositoryMappingError("not_mapped");
  }
  return [...new Set(repositories.map((repository) => repository.toLowerCase()))];
}

function safeToolError(error: unknown) {
  if (error instanceof ProjectAuthorizationError) {
    return error.code === "not_found" ? "Project not found." : "You are not a member of this project.";
  }
  if (error instanceof ProjectFilesystemError) return error.message;
  if (error instanceof SensitiveToolOutputError) return error.message;
  if (error instanceof ProjectRepositoryMappingError) {
    switch (error.code) {
      case "not_configured":
        return "GitHub tools are disabled until project repository mappings are configured.";
      case "not_mapped":
        return "No GitHub repository is configured for this project.";
      case "unavailable":
        return "A configured project repository is not accessible to the connected GitHub account.";
    }
  }
  if (error instanceof GitHubIntegrationError) {
    switch (error.code) {
      case "unauthenticated":
        return "GitHub tools require a DevHub session cookie; connect GitHub in DevHub settings.";
      case "identity_mismatch":
        return "The GitHub session does not match the authenticated DevHub user.";
      case "not_connected":
        return "Connect a GitHub account in DevHub settings before using GitHub tools.";
      case "missing_token":
        return "The GitHub connection needs to be renewed.";
      case "scope":
        return "The GitHub connection needs repository read permission.";
      case "rate_limit":
        return "GitHub rate limit reached. Try again later.";
      case "not_found":
        return "The repository is not available to the connected GitHub account.";
      case "permission":
        return "The connected GitHub account lacks permission for this operation.";
      case "unavailable":
        return "GitHub is temporarily unavailable.";
    }
  }
  return "The tool could not complete the read request.";
}

async function executeReadTool(
  name: string,
  operation: () => Promise<unknown>,
) {
  try {
    const result = await operation();
    const text = JSON.stringify(result, null, 2);
    if (containsSensitiveContent(text)) throw new SensitiveToolOutputError();
    return {
      content: [{ type: "text" as const, text }],
    };
  } catch (error) {
    console.error(`MCP read tool "${name}" failed:`, error instanceof Error ? error.name : "UnknownError");
    return {
      content: [{ type: "text" as const, text: safeToolError(error) }],
      isError: true,
    };
  }
}

export function createDevHubMcpServer(userId: string) {
  const server = new McpServer({
    name: "devhub-readonly-tools",
    version: "1.0.0",
  });
  const readOnlyAnnotations = {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
  };

  server.registerTool(
    "database_list_accessible_projects",
    {
      description:
        "List up to 50 project names and IDs owned by or shared with the authenticated user. Use this first to resolve a project name before requesting its details.",
      annotations: readOnlyAnnotations,
      inputSchema: {},
    },
    async () =>
      executeReadTool("database_list_accessible_projects", async () => {
        const projects = await db.project.findMany({
          where: {
            OR: [
              { userId },
              { members: { some: { userId } } },
            ],
          },
          orderBy: { createdAt: "desc" },
          take: 51,
          select: { id: true, name: true },
        });
        return {
          projects: projects.slice(0, 50),
          truncated: projects.length > 50,
        };
      }),
  );

  server.registerTool(
    "filesystem_list_project_files",
    {
      description: "List non-sensitive files under a project directory the authenticated user can access.",
      annotations: readOnlyAnnotations,
      inputSchema: {
        projectId: z.string().min(1).max(128),
        path: z.string().max(512).default(""),
        maxDepth: z.number().int().min(0).max(3).default(2),
      },
    },
    async ({ projectId, path: relativePath, maxDepth }) =>
      executeReadTool("filesystem_list_project_files", async () => {
        await requireProjectAccess(userId, projectId);
        return listAuthorizedProjectFiles(projectId, relativePath, maxDepth);
      }),
  );

  server.registerTool(
    "filesystem_read_project_file",
    {
      description: "Read a UTF-8 text file in an authorized project's configured local directory. Credential files are blocked.",
      annotations: readOnlyAnnotations,
      inputSchema: {
        projectId: z.string().min(1).max(128),
        path: z.string().min(1).max(512),
      },
    },
    async ({ projectId, path: relativePath }) =>
      executeReadTool("filesystem_read_project_file", async () => {
        await requireProjectAccess(userId, projectId);
        return readAuthorizedProjectFile(projectId, relativePath);
      }),
  );

  server.registerTool(
    "database_get_project",
    {
      description: "Read project details, milestones, and status for a project the authenticated user can access.",
      annotations: readOnlyAnnotations,
      inputSchema: { projectId: z.string().min(1).max(128) },
    },
    async ({ projectId }) =>
      executeReadTool("database_get_project", async () => {
        await requireProjectAccess(userId, projectId);
        return db.project.findUnique({
          where: { id: projectId },
          select: {
            id: true,
            name: true,
            description: true,
            status: true,
            createdAt: true,
            milestones: {
              select: { id: true, title: true, description: true, dueDate: true, status: true },
              orderBy: [{ dueDate: "asc" }, { createdAt: "asc" }],
            },
          },
        });
      }),
  );

  server.registerTool(
    "database_list_project_tasks",
    {
      description: "List read-only task details for an authorized project.",
      annotations: readOnlyAnnotations,
      inputSchema: {
        projectId: z.string().min(1).max(128),
        limit: z.number().int().min(1).max(100).default(50),
      },
    },
    async ({ projectId, limit }) =>
      executeReadTool("database_list_project_tasks", async () => {
        await requireProjectAccess(userId, projectId);
        return db.task.findMany({
          where: { projectId },
          orderBy: { createdAt: "desc" },
          take: limit,
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
            priority: true,
            estimate: true,
            dueDate: true,
            completed: true,
            assignee: { select: { id: true, name: true } },
            milestone: { select: { id: true, title: true } },
            dependsOn: {
              select: {
                dependsOnTask: { select: { id: true, title: true } },
              },
            },
          },
        });
      }),
  );

  server.registerTool(
    "database_list_project_members",
    {
      description: "List names, roles, and available profile skills for authorized project members.",
      annotations: readOnlyAnnotations,
      inputSchema: { projectId: z.string().min(1).max(128) },
    },
    async ({ projectId }) =>
      executeReadTool("database_list_project_members", async () => {
        await requireProjectAccess(userId, projectId);
        const project = await db.project.findUnique({
          where: { id: projectId },
          select: {
            user: { select: { id: true, name: true, jobTitle: true, skills: true } },
            members: {
              select: {
                role: true,
                user: { select: { id: true, name: true, jobTitle: true, skills: true } },
              },
              orderBy: { createdAt: "asc" },
            },
          },
        });
        if (!project) throw new ProjectAuthorizationError("not_found");
        const members = new Map([
          [project.user.id, { ...project.user, role: "OWNER" }],
        ]);
        for (const membership of project.members) {
          if (!members.has(membership.user.id)) {
            members.set(membership.user.id, { ...membership.user, role: membership.role });
          }
        }
        return [...members.values()];
      }),
  );

  server.registerTool(
    "github_list_repositories",
    {
      description: "List repositories accessible to the authenticated user's connected GitHub account.",
      annotations: readOnlyAnnotations,
      inputSchema: { projectId: z.string().min(1).max(128) },
    },
    async ({ projectId }) =>
      executeReadTool("github_list_repositories", async () => {
        await requireProjectAccess(userId, projectId);
        const mappedRepositories = getMappedProjectRepositories(projectId);
        const repositories = await listGitHubRepositoriesForMcp(userId);
        const allowed = repositories.filter((repository) =>
          mappedRepositories.includes(repository.fullName.toLowerCase()),
        );
        if (allowed.length !== mappedRepositories.length) {
          throw new ProjectRepositoryMappingError("unavailable");
        }
        return allowed;
      }),
  );

  server.registerTool(
    "github_get_repository",
    {
      description: "Read branches, recent commits, and pull requests for a repository accessible to the connected GitHub account.",
      annotations: readOnlyAnnotations,
      inputSchema: {
        projectId: z.string().min(1).max(128),
        repository: z.string().regex(/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/).max(250),
      },
    },
    async ({ projectId, repository }) =>
      executeReadTool("github_get_repository", async () => {
        await requireProjectAccess(userId, projectId);
        const mappedRepositories = getMappedProjectRepositories(projectId);
        if (!mappedRepositories.includes(repository.toLowerCase())) {
          throw new ProjectRepositoryMappingError("not_mapped");
        }
        return getGitHubRepositoryForMcp(userId, repository);
      }),
  );

  return server;
}
