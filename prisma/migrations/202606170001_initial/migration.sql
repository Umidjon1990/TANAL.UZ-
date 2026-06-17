CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'CENTER_ADMIN');
CREATE TYPE "ExamStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED', 'EXPIRED');

CREATE TABLE "TestCenter" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "imageUrl" TEXT,
  "region" TEXT NOT NULL,
  "district" TEXT NOT NULL,
  "address" TEXT NOT NULL,
  "locationUrl" TEXT,
  "phone" TEXT NOT NULL,
  "telegram" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "TestCenter_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "username" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "role" "Role" NOT NULL,
  "testCenterId" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ExamDate" (
  "id" TEXT NOT NULL,
  "testCenterId" TEXT NOT NULL,
  "examDate" TIMESTAMP(3) NOT NULL,
  "startTime" TEXT NOT NULL,
  "endTime" TEXT NOT NULL,
  "seatsLimit" INTEGER NOT NULL,
  "price" INTEGER NOT NULL,
  "description" TEXT,
  "status" "ExamStatus" NOT NULL DEFAULT 'PENDING',
  "approvedById" TEXT,
  "approvedAt" TIMESTAMP(3),
  "rejectedAt" TIMESTAMP(3),
  "rejectionReason" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ExamDate_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "News" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "imageUrl" TEXT,
  "isPublished" BOOLEAN NOT NULL DEFAULT false,
  "publishedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "News_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TelegramPostLog" (
  "id" TEXT NOT NULL,
  "examDateId" TEXT NOT NULL,
  "telegramMessageId" TEXT,
  "status" TEXT NOT NULL,
  "errorMessage" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "TelegramPostLog_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AuditLog" (
  "id" TEXT NOT NULL,
  "userId" TEXT,
  "action" TEXT NOT NULL,
  "entityType" TEXT NOT NULL,
  "entityId" TEXT NOT NULL,
  "details" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE INDEX "User_role_idx" ON "User"("role");
CREATE INDEX "User_testCenterId_idx" ON "User"("testCenterId");
CREATE INDEX "User_isActive_idx" ON "User"("isActive");
CREATE INDEX "TestCenter_region_idx" ON "TestCenter"("region");
CREATE INDEX "TestCenter_district_idx" ON "TestCenter"("district");
CREATE INDEX "TestCenter_isActive_idx" ON "TestCenter"("isActive");
CREATE INDEX "ExamDate_testCenterId_status_idx" ON "ExamDate"("testCenterId", "status");
CREATE INDEX "ExamDate_examDate_idx" ON "ExamDate"("examDate");
CREATE INDEX "ExamDate_status_idx" ON "ExamDate"("status");
CREATE INDEX "ExamDate_approvedById_idx" ON "ExamDate"("approvedById");
CREATE UNIQUE INDEX "News_slug_key" ON "News"("slug");
CREATE INDEX "News_isPublished_publishedAt_idx" ON "News"("isPublished", "publishedAt");
CREATE UNIQUE INDEX "TelegramPostLog_examDateId_key" ON "TelegramPostLog"("examDateId");
CREATE INDEX "TelegramPostLog_status_idx" ON "TelegramPostLog"("status");
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");
CREATE INDEX "AuditLog_entityType_entityId_idx" ON "AuditLog"("entityType", "entityId");
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

ALTER TABLE "User" ADD CONSTRAINT "User_testCenterId_fkey" FOREIGN KEY ("testCenterId") REFERENCES "TestCenter"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ExamDate" ADD CONSTRAINT "ExamDate_testCenterId_fkey" FOREIGN KEY ("testCenterId") REFERENCES "TestCenter"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ExamDate" ADD CONSTRAINT "ExamDate_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "TelegramPostLog" ADD CONSTRAINT "TelegramPostLog_examDateId_fkey" FOREIGN KEY ("examDateId") REFERENCES "ExamDate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
