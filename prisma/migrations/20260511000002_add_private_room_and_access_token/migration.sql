-- CreateTable
CREATE TABLE "PrivateRoom" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "showMilestones" BOOLEAN NOT NULL DEFAULT true,
    "showUpdates" BOOLEAN NOT NULL DEFAULT true,
    "showArchitecture" BOOLEAN NOT NULL DEFAULT true,
    "showEvidence" BOOLEAN NOT NULL DEFAULT true,
    "showNextSteps" BOOLEAN NOT NULL DEFAULT true,
    "status" "ContentStatus" NOT NULL DEFAULT 'draft',
    "visibility" "ContentVisibility" NOT NULL DEFAULT 'privateRoom',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrivateRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccessToken" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "label" TEXT,
    "revokedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "lastUsedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccessToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PrivateRoom_slug_key" ON "PrivateRoom"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "PrivateRoom_projectId_key" ON "PrivateRoom"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "AccessToken_tokenHash_key" ON "AccessToken"("tokenHash");

-- CreateIndex
CREATE INDEX "AccessToken_roomId_idx" ON "AccessToken"("roomId");

-- AddForeignKey
ALTER TABLE "PrivateRoom" ADD CONSTRAINT "PrivateRoom_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessToken" ADD CONSTRAINT "AccessToken_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "PrivateRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;
