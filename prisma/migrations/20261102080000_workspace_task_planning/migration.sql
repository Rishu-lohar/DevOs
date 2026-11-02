ALTER TABLE "User"
    ADD COLUMN "jobTitle" TEXT,
    ADD COLUMN "skills" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

ALTER TABLE "Task"
    ADD COLUMN "description" TEXT,
    ADD COLUMN "priority" TEXT,
    ADD COLUMN "estimate" INTEGER,
    ADD COLUMN "dueDate" TIMESTAMP(3),
    ADD COLUMN "assigneeId" TEXT;

CREATE INDEX "Task_assigneeId_status_idx"
    ON "Task"("assigneeId", "status");

CREATE INDEX "Task_projectId_dueDate_idx"
    ON "Task"("projectId", "dueDate");

ALTER TABLE "Task"
    ADD CONSTRAINT "Task_assigneeId_fkey"
    FOREIGN KEY ("assigneeId") REFERENCES "User"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
