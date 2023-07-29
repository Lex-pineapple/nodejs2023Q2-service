/*
  Warnings:

  - You are about to drop the column `year` on the `Track` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[albumId]` on the table `Track` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `duration` to the `Track` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Track" DROP COLUMN "year",
ADD COLUMN     "albumId" TEXT,
ADD COLUMN     "duration" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "version" SET DEFAULT 1;

-- CreateIndex
CREATE UNIQUE INDEX "Track_albumId_key" ON "Track"("albumId");

-- AddForeignKey
ALTER TABLE "Track" ADD CONSTRAINT "Track_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE SET NULL ON UPDATE CASCADE;
