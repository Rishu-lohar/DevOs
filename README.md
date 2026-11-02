This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Read-only MCP tools

DevHub exposes an authenticated, stateless Streamable HTTP MCP endpoint at `/api/mcp`.
Each request must include the signed-in Supabase session cookie or a Supabase access
token in `Authorization: Bearer <access-token>`. The authenticated user is resolved
server-side; tool arguments never accept a user ID. Project data and filesystem access
are checked against project ownership or membership for every call.

The initial tool set reads project files, project/task/member data, and the connected
GitHub account's accessible repositories, branches, recent commits, and pull requests.
It does not write files, modify database records, or push Git changes.

Filesystem tools are disabled unless `DEVHUB_MCP_FILESYSTEM_ROOT` and
`DEVHUB_MCP_PROJECT_PATHS` are configured. The latter is a JSON object mapping
Prisma project IDs to directories relative to that root, for example:

```env
DEVHUB_MCP_FILESYSTEM_ROOT=C:\DevHub\workspaces
DEVHUB_MCP_PROJECT_PATHS={"<project-id>":"my-project"}
```

Only UTF-8 text files up to 256 KiB are readable. Sensitive paths and detected
credential-like contents are blocked. GitHub tools additionally require the user to
connect GitHub in DevHub and grant repository read scope. Configure
`DEVHUB_MCP_PROJECT_REPOSITORIES` as a JSON object mapping Prisma project IDs to
one or more `owner/repository` names. Repository tools expose only repositories
explicitly mapped to the authorized project and accessible to the connected GitHub
account. External MCP clients using GitHub tools must forward the authenticated
DevHub session cookies so the existing per-user GitHub OAuth token can be used.

The AI Mentor uses the same local Ollama/Qwen3 backend and authenticated
read-only MCP registry. For DevHub-specific questions, it first resolves
projects visible to the signed-in user, then asks the model to select only the
relevant database, filesystem, or GitHub reads. Tool calls are re-authorized by
the registry, limited per answer, and never permit writes. Filesystem and
GitHub questions require the mappings and connected account described above;
unavailable sources are reported instead of replaced with invented data.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
