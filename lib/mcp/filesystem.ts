import "server-only";

import { lstat, readFile, readdir, realpath } from "node:fs/promises";
import path from "node:path";
import { containsSensitiveContent } from "@/lib/mcp/sensitive-content";

const MAX_FILE_BYTES = 256 * 1024;
const MAX_LISTED_FILES = 100;
const SENSITIVE_SEGMENT =
  /^(?:\.env(?:$|\.)|\.git$|\.git-credentials$|\.ssh$|\.aws$|\.azure$|\.npmrc$|\.pypirc$|(?:credentials?|secrets?|tokens?|passwords?)(?:[-_.].*)?$|auth\.json$|id_(?:rsa|ed25519)$)/i;
const SENSITIVE_EXTENSION = /\.(?:pem|key|p12|pfx|kdbx|keystore)$/i;
export class ProjectFilesystemError extends Error {
  constructor(
    readonly code: "not_configured" | "invalid_mapping" | "not_found" | "forbidden" | "too_large" | "binary",
    message: string,
  ) {
    super(message);
    this.name = "ProjectFilesystemError";
  }
}

function isSensitivePath(value: string) {
  return value
    .split(/[\\/]+/)
    .some((segment) => SENSITIVE_SEGMENT.test(segment) || SENSITIVE_EXTENSION.test(segment));
}

function requireContainedPath(root: string, candidate: string) {
  if (candidate.split(/[\\/]+/).includes("..")) {
    throw new ProjectFilesystemError("forbidden", "Parent-directory path segments are not allowed.");
  }
  const resolved = path.resolve(root, candidate);
  const relative = path.relative(root, resolved);
  if (!relative || relative.startsWith(`..${path.sep}`) || relative === ".." || path.isAbsolute(relative)) {
    if (!relative) return resolved;
    throw new ProjectFilesystemError("forbidden", "The requested path is outside the authorized project directory.");
  }
  return resolved;
}

async function getProjectRoot(projectId: string) {
  const configuredRoot = process.env.DEVHUB_MCP_FILESYSTEM_ROOT;
  const mappingsValue = process.env.DEVHUB_MCP_PROJECT_PATHS;
  if (!configuredRoot || !mappingsValue) {
    throw new ProjectFilesystemError(
      "not_configured",
      "Filesystem tools are unavailable until the project filesystem mapping is configured.",
    );
  }

  let mappings: unknown;
  try {
    mappings = JSON.parse(mappingsValue);
  } catch {
    throw new ProjectFilesystemError("invalid_mapping", "The project filesystem mapping is invalid.");
  }
  if (!mappings || typeof mappings !== "object" || Array.isArray(mappings)) {
    throw new ProjectFilesystemError("invalid_mapping", "The project filesystem mapping must be a JSON object.");
  }

  const relativeProjectPath = (mappings as Record<string, unknown>)[projectId];
  if (
    typeof relativeProjectPath !== "string" ||
    !relativeProjectPath.trim() ||
    path.isAbsolute(relativeProjectPath) ||
    isSensitivePath(relativeProjectPath)
  ) {
    throw new ProjectFilesystemError("not_found", "No local filesystem is mapped to this project.");
  }

  try {
    const root = await realpath(configuredRoot);
    const mappedPath = requireContainedPath(root, relativeProjectPath);
    const projectRoot = await realpath(mappedPath);
    const relative = path.relative(root, projectRoot);
    if (
      relative.startsWith(`..${path.sep}`) ||
      relative === ".." ||
      path.isAbsolute(relative) ||
      !relative
    ) {
      throw new ProjectFilesystemError("forbidden", "The project mapping is outside the configured filesystem root.");
    }
    return projectRoot;
  } catch (error) {
    if (error instanceof ProjectFilesystemError) throw error;
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      throw new ProjectFilesystemError("not_found", "The mapped project directory does not exist.");
    }
    throw error;
  }
}

async function resolveProjectPath(projectId: string, relativePath: string) {
  if (
    !relativePath.trim() ||
    relativePath.includes("\0") ||
    path.isAbsolute(relativePath) ||
    isSensitivePath(relativePath)
  ) {
    throw new ProjectFilesystemError("forbidden", "The requested file path is not allowed.");
  }

  const projectRoot = await getProjectRoot(projectId);
  const candidate = requireContainedPath(projectRoot, relativePath);
  const resolved = await realpath(/*turbopackIgnore: true*/ candidate).catch((error: unknown) => {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      throw new ProjectFilesystemError("not_found", "The requested project file does not exist.");
    }
    throw error;
  });
  const relative = path.relative(projectRoot, resolved);
  if (
    relative.startsWith(`..${path.sep}`) ||
    relative === ".." ||
    path.isAbsolute(relative) ||
    isSensitivePath(relative)
  ) {
    throw new ProjectFilesystemError("forbidden", "The requested file is outside the allowed project files.");
  }
  return { projectRoot, resolved };
}

export async function readAuthorizedProjectFile(projectId: string, relativePath: string) {
  const { resolved } = await resolveProjectPath(projectId, relativePath);
  const fileStat = await lstat(resolved);
  if (!fileStat.isFile()) {
    throw new ProjectFilesystemError("forbidden", "Only regular project files can be read.");
  }
  if (fileStat.size > MAX_FILE_BYTES) {
    throw new ProjectFilesystemError("too_large", `Project files are limited to ${MAX_FILE_BYTES} bytes.`);
  }

  const contents = await readFile(resolved);
  if (contents.includes(0)) {
    throw new ProjectFilesystemError("binary", "Binary files cannot be read through this tool.");
  }
  const text = contents.toString("utf8");
  if (!Buffer.from(text, "utf8").equals(contents)) {
    throw new ProjectFilesystemError("binary", "Only valid UTF-8 text files can be read.");
  }
  if (containsSensitiveContent(text)) {
    throw new ProjectFilesystemError("forbidden", "Files containing credential-like values cannot be read.");
  }
  return { path: relativePath, content: text, bytes: contents.length };
}

export async function listAuthorizedProjectFiles(
  projectId: string,
  relativeDirectory: string,
  maxDepth: number,
) {
  const projectRoot = await getProjectRoot(projectId);
  const start = relativeDirectory
    ? requireContainedPath(projectRoot, relativeDirectory)
    : projectRoot;
  const resolvedStart = await realpath(start).catch((error: unknown) => {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      throw new ProjectFilesystemError("not_found", "The requested project directory does not exist.");
    }
    throw error;
  });
  const relativeStart = path.relative(projectRoot, resolvedStart);
  if (
    (relativeStart && (relativeStart.startsWith(`..${path.sep}`) || relativeStart === "..")) ||
    path.isAbsolute(relativeStart) ||
    isSensitivePath(relativeStart)
  ) {
    throw new ProjectFilesystemError("forbidden", "The requested directory is outside the allowed project files.");
  }

  const files: Array<{ path: string; bytes: number }> = [];
  async function visit(directory: string, depth: number) {
    if (files.length >= MAX_LISTED_FILES || depth > maxDepth) return;
    const entries = await readdir(directory, { withFileTypes: true });
    entries.sort((left, right) => left.name.localeCompare(right.name));

    for (const entry of entries) {
      if (files.length >= MAX_LISTED_FILES) break;
      const fullPath = path.join(directory, entry.name);
      const relativePath = path.relative(projectRoot, fullPath);
      if (isSensitivePath(relativePath) || entry.isSymbolicLink()) continue;
      if (entry.isDirectory()) {
        if (depth < maxDepth) await visit(fullPath, depth + 1);
      } else if (entry.isFile()) {
        const fileStat = await lstat(fullPath);
        files.push({ path: relativePath.split(path.sep).join("/"), bytes: fileStat.size });
      }
    }
  }

  if (relativeDirectory && isSensitivePath(relativeDirectory)) {
    throw new ProjectFilesystemError("forbidden", "The requested directory is not allowed.");
  }
  const startStat = await lstat(resolvedStart);
  if (!startStat.isDirectory()) {
    throw new ProjectFilesystemError("forbidden", "The requested path is not a directory.");
  }
  await visit(resolvedStart, 0);
  return { files, truncated: files.length === MAX_LISTED_FILES };
}
