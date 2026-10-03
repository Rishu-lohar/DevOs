ALTER TABLE "Task"
ADD COLUMN "status" TEXT NOT NULL DEFAULT 'TODO';

UPDATE "Task"
SET "status" = 'DONE'
WHERE "completed" = true;
