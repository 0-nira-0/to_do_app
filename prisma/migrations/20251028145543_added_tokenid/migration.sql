/*
  Warnings:

  - A unique constraint covering the columns `[tokenId]` on the table `Session` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tokenId` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "tokenId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Session_tokenId_key" ON "Session"("tokenId");
