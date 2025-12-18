/*
  Warnings:

  - You are about to drop the column `characterId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the `Character` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_characterId_fkey";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "characterId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Character";

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
