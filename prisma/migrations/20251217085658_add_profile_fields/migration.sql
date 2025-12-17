/*
  Warnings:

  - You are about to drop the column `stylePreference` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "stylePreference",
ADD COLUMN     "bodyType" TEXT,
ADD COLUMN     "height" INTEGER,
ADD COLUMN     "stylePreferences" TEXT[],
ADD COLUMN     "weight" INTEGER;
