-- CreateTable
CREATE TABLE "SupportTicket" (
    "id" SERIAL NOT NULL,
    "buyerId" INTEGER,
    "sellerId" INTEGER,
    "managerId" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SupportTicket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupportMessage" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "senderType" TEXT NOT NULL,
    "senderId" INTEGER NOT NULL,
    "chatRoomId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SupportMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SupportMessageToSupportTicket" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_SupportMessageToSupportTicket_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "SupportTicket_buyerId_key" ON "SupportTicket"("buyerId");

-- CreateIndex
CREATE UNIQUE INDEX "SupportTicket_sellerId_key" ON "SupportTicket"("sellerId");

-- CreateIndex
CREATE UNIQUE INDEX "SupportTicket_buyerId_sellerId_key" ON "SupportTicket"("buyerId", "sellerId");

-- CreateIndex
CREATE INDEX "SupportMessage_chatRoomId_idx" ON "SupportMessage"("chatRoomId");

-- CreateIndex
CREATE INDEX "_SupportMessageToSupportTicket_B_index" ON "_SupportMessageToSupportTicket"("B");

-- AddForeignKey
ALTER TABLE "_SupportMessageToSupportTicket" ADD CONSTRAINT "_SupportMessageToSupportTicket_A_fkey" FOREIGN KEY ("A") REFERENCES "SupportMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SupportMessageToSupportTicket" ADD CONSTRAINT "_SupportMessageToSupportTicket_B_fkey" FOREIGN KEY ("B") REFERENCES "SupportTicket"("id") ON DELETE CASCADE ON UPDATE CASCADE;
