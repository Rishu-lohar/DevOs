-- CreateEnum
CREATE TYPE "ProjectMemberRole" AS ENUM ('OWNER', 'MANAGER', 'DEVELOPER');
CREATE TYPE "InvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'EXPIRED');
CREATE TYPE "TaskDependencyType" AS ENUM ('BLOCKS', 'DEPENDS_ON');
CREATE TYPE "MilestoneStatus" AS ENUM ('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'LATE');
CREATE TYPE "ActivityType" AS ENUM ('PROJECT_CREATED', 'PROJECT_UPDATED', 'TASK_CREATED', 'TASK_UPDATED', 'TASK_COMPLETED', 'TASK_DELETED', 'MEMBER_ADDED', 'MEMBER_REMOVED', 'INVITATION_SENT', 'AI_GENERATED', 'SYSTEM');
CREATE TYPE "NotificationType" AS ENUM ('TASK', 'PROJECT', 'INVITATION', 'MILESTONE', 'AI', 'SYSTEM');
CREATE TYPE "AIExecutionStatus" AS ENUM ('QUEUED', 'RUNNING', 'COMPLETED', 'FAILED');

-- AlterTable: existing records preserved
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "avatarUrl" TEXT;

-- CreateTable: ProjectMember
CREATE TABLE "ProjectMember" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "ProjectMemberRole" NOT NULL DEFAULT 'DEVELOPER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectMember_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ProjectMember_projectId_userId_key"
    ON "ProjectMember"("projectId", "userId");

CREATE INDEX "ProjectMember_projectId_role_idx"
    ON "ProjectMember"("projectId", "role");

CREATE INDEX "ProjectMember_userId_idx"
    ON "ProjectMember"("userId");

-- CreateTable: Invitation
CREATE TABLE "Invitation" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "ProjectMemberRole" NOT NULL DEFAULT 'DEVELOPER',
    "status" "InvitationStatus" NOT NULL DEFAULT 'PENDING',
    "invitedById" TEXT NOT NULL,
    "invitedUserId" TEXT,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invitation_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Invitation_projectId_email_key"
    ON "Invitation"("projectId", "email");

CREATE INDEX "Invitation_email_status_idx"
    ON "Invitation"("email", "status");

CREATE INDEX "Invitation_invitedById_idx"
    ON "Invitation"("invitedById");

-- CreateTable: Milestone
CREATE TABLE "Milestone" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "dueDate" TIMESTAMP(3),
    "status" "MilestoneStatus" NOT NULL DEFAULT 'PLANNED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Milestone_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Milestone_projectId_status_idx"
    ON "Milestone"("projectId", "status");

CREATE INDEX "Milestone_createdById_idx"
    ON "Milestone"("createdById");

-- CreateTable: TaskDependency
CREATE TABLE "TaskDependency" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "dependsOnTaskId" TEXT NOT NULL,
    "type" "TaskDependencyType" NOT NULL DEFAULT 'BLOCKS',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TaskDependency_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "TaskDependency_taskId_dependsOnTaskId_key"
    ON "TaskDependency"("taskId", "dependsOnTaskId");

CREATE INDEX "TaskDependency_taskId_idx"
    ON "TaskDependency"("taskId");

CREATE INDEX "TaskDependency_dependsOnTaskId_idx"
    ON "TaskDependency"("dependsOnTaskId");

-- CreateTable: ActivityLog
CREATE TABLE "ActivityLog" (
    "id" TEXT NOT NULL,
    "projectId" TEXT,
    "taskId" TEXT,
    "userId" TEXT,
    "type" "ActivityType" NOT NULL,
    "message" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ActivityLog_projectId_createdAt_idx"
    ON "ActivityLog"("projectId", "createdAt");

CREATE INDEX "ActivityLog_userId_createdAt_idx"
    ON "ActivityLog"("userId", "createdAt");

CREATE INDEX "ActivityLog_taskId_idx"
    ON "ActivityLog"("taskId");

-- CreateTable: Notification
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "projectId" TEXT,
    "taskId" TEXT,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Notification_userId_readAt_createdAt_idx"
    ON "Notification"("userId", "readAt", "createdAt");

CREATE INDEX "Notification_projectId_idx"
    ON "Notification"("projectId");

-- CreateTable: ProjectDocument
CREATE TABLE "ProjectDocument" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "uploadedById" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "mimeType" TEXT,
    "sizeBytes" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectDocument_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ProjectDocument_projectId_createdAt_idx"
    ON "ProjectDocument"("projectId", "createdAt");

CREATE INDEX "ProjectDocument_uploadedById_idx"
    ON "ProjectDocument"("uploadedById");

-- CreateTable: AIExecution
CREATE TABLE "AIExecution" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "projectId" TEXT,
    "type" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "response" TEXT,
    "status" "AIExecutionStatus" NOT NULL DEFAULT 'QUEUED',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),

    CONSTRAINT "AIExecution_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AIExecution_userId_createdAt_idx"
    ON "AIExecution"("userId", "createdAt");

CREATE INDEX "AIExecution_projectId_createdAt_idx"
    ON "AIExecution"("projectId", "createdAt");

-- AlterTable: Task milestone relation
ALTER TABLE "Task"
    ADD COLUMN IF NOT EXISTS "milestoneId" TEXT;

-- Foreign keys
ALTER TABLE "ProjectMember"
    ADD CONSTRAINT "ProjectMember_projectId_fkey"
    FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT "ProjectMember_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Invitation"
    ADD CONSTRAINT "Invitation_projectId_fkey"
    FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT "Invitation_invitedById_fkey"
    FOREIGN KEY ("invitedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT "Invitation_invitedUserId_fkey"
    FOREIGN KEY ("invitedUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Milestone"
    ADD CONSTRAINT "Milestone_projectId_fkey"
    FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT "Milestone_createdById_fkey"
    FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "TaskDependency"
    ADD CONSTRAINT "TaskDependency_taskId_fkey"
    FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT "TaskDependency_dependsOnTaskId_fkey"
    FOREIGN KEY ("dependsOnTaskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ActivityLog"
    ADD CONSTRAINT "ActivityLog_projectId_fkey"
    FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT "ActivityLog_taskId_fkey"
    FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT "ActivityLog_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Notification"
    ADD CONSTRAINT "Notification_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT "Notification_projectId_fkey"
    FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT "Notification_taskId_fkey"
    FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ProjectDocument"
    ADD CONSTRAINT "ProjectDocument_projectId_fkey"
    FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT "ProjectDocument_uploadedById_fkey"
    FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "AIExecution"
    ADD CONSTRAINT "AIExecution_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT "AIExecution_projectId_fkey"
    FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Task"
    ADD CONSTRAINT "Task_milestoneId_fkey"
    FOREIGN KEY ("milestoneId") REFERENCES "Milestone"("id") ON DELETE SET NULL ON UPDATE CASCADE;
