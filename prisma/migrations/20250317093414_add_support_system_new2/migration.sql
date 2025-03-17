/*
  Warnings:

  - You are about to drop the column `chatRoomId` on the `SupportMessage` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[chatRoomSupportId]` on the table `SupportTicket` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `chatRoomSupportId` to the `SupportMessage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chatRoomSupportId` to the `SupportTicket` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "SupportMessage_chatRoomId_idx";

-- AlterTable
ALTER TABLE "SupportMessage" DROP COLUMN "chatRoomId",
ADD COLUMN     "chatRoomSupportId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "SupportTicket" ADD COLUMN     "chatRoomSupportId" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "SupportMessage_chatRoomSupportId_idx" ON "SupportMessage"("chatRoomSupportId");

-- CreateIndex
CREATE UNIQUE INDEX "SupportTicket_chatRoomSupportId_key" ON "SupportTicket"("chatRoomSupportId");
