import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { NextResponse } from "next/server";
import { getMcpAuthenticatedUser } from "@/lib/mcp/auth";
import { createDevHubMcpServer } from "@/lib/mcp/tools";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let user;
  try {
    user = await getMcpAuthenticatedUser(request);
  } catch (error) {
    console.error("MCP authentication failed:", error instanceof Error ? error.name : "UnknownError");
    return NextResponse.json({ error: "Authentication could not be verified" }, { status: 503 });
  }
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const server = createDevHubMcpServer(user.id);
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
    maxRequestBodySize: 64 * 1024,
  });

  try {
    await server.connect(transport);
    const response = await transport.handleRequest(request);
    await transport.close();
    await server.close();
    response.headers.set("Cache-Control", "private, no-store");
    return response;
  } catch (error) {
    console.error("MCP request failed:", error instanceof Error ? error.name : "UnknownError");
    await transport.close().catch(() => undefined);
    await server.close();
    return NextResponse.json(
      {
        jsonrpc: "2.0",
        error: { code: -32603, message: "MCP request failed" },
        id: null,
      },
      { status: 500 },
    );
  }
}
