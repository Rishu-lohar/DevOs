import "server-only";

const SECRET_PATTERNS = [
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
  /\bgh[pousr]_[A-Za-z0-9_]{20,}\b/,
  /\bgithub_pat_[A-Za-z0-9_]{20,}\b/,
  /\bglpat-[A-Za-z0-9_-]{20,}\b/,
  /\bxox[baprs]-[A-Za-z0-9-]{20,}\b/,
  /\bsk-[A-Za-z0-9]{20,}\b/,
  /\bAKIA[0-9A-Z]{16}\b/,
  /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/,
  /\bBearer\s+[A-Za-z0-9._~+/-]{24,}/i,
  /(?:api[_-]?key|client[_-]?secret|access[_-]?token|refresh[_-]?token|password)\s*["']?\s*[:=]\s*["']?[A-Za-z0-9._~+/-]{8,}["']?/i,
  /\b[a-z][a-z0-9+.-]*:\/\/[^/\s:@]+:[^@\s/]+@/i,
];

export function containsSensitiveContent(value: string) {
  return SECRET_PATTERNS.some((pattern) => pattern.test(value));
}

export class SensitiveToolOutputError extends Error {
  constructor() {
    super("Tool output containing credential-like values was withheld.");
    this.name = "SensitiveToolOutputError";
  }
}
