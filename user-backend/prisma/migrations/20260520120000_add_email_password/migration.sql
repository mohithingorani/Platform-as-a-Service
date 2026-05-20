-- Align DB with current Prisma schema used by auth.

ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "email" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "password" TEXT;

-- OAuth and email/password flows may create users without a profile picture.
ALTER TABLE "User" ALTER COLUMN "profilePicture" DROP NOT NULL;

-- Allow multiple NULLs (Postgres unique index permits this).
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
