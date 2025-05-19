import { z } from "zod";
import { procedure, router } from "../trpc";
import { PrismaClient, UserRole } from "@prisma/client";
import { hash } from "bcrypt";
import { contractTemplates } from "@/lib/contractTemplates";
// import { createTRPCRouter, protectedProcedure } from "../trpc";

const prisma = new PrismaClient();

export const supportRouter = router({
  ////////////////////support
  createTicket: procedure
    .input(
      z.object({
        buyerId: z.number().optional(),
        sellerId: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const chatRoomId = Math.floor(Math.random() * 1000000); // Generate a unique chatRoomId
      return await prisma.supportTicket.create({
        data: {
          buyerId: input.buyerId,
          sellerId: input.sellerId,
          chatRoomSupportId: chatRoomId,
        },
      });
    }),

  getTickets: procedure.query(async () => {
    return await prisma.supportTicket.findMany({
      include: {
        messages: true,
      },
    });
  }),

  getTicketById: procedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return await prisma.supportTicket.findUnique({
        where: { id: input.id },
        include: { messages: true },
      });
    }),

  sendSupportMessage: procedure
    .input(
      z.object({
        chatRoomId: z.number(),
        content: z.string(),
        senderType: z.enum(["BUYER", "SELLER", "MANAGER"]),
        senderId: z.number(),
        imageUrl: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return await prisma.supportMessage.create({
        data: {
          chatRoomSupportId: input.chatRoomId,
          content: input.content,
          senderType: input.senderType,
          senderId: input.senderId,
        },
      });
    }),

  getSupportMessages: procedure
    .input(z.object({ chatRoomId: z.number() }))
    .query(async ({ input }) => {
      return await prisma.supportMessage.findMany({
        where: { chatRoomSupportId: input.chatRoomId },
        orderBy: { createdAt: "asc" },
      });
    }),
  getTicketByUserId: procedure
    .input(
      z.object({
        buyerId: z.number().optional(),
        sellerId: z.number().optional(),
      })
    )
    .query(async ({ input }) => {
      return await prisma.supportTicket.findFirst({
        where: {
          OR: [{ buyerId: input.buyerId }, { sellerId: input.sellerId }],
          status: "OPEN", // Only return open tickets
        },
      });
    }),

  getAllTicketsByUserId: procedure
    .input(
      z.object({
        buyerId: z.number().optional(),
        sellerId: z.number().optional(),
      })
    )
    .query(async ({ input }) => {
      return await prisma.supportTicket.findMany({
        where: {
          OR: [{ buyerId: input.buyerId }, { sellerId: input.sellerId }],
        },
        include: { messages: true }, // Include messages for each ticket
      });
    }),

  // getTicketByChatRoomId: procedure
  //   .input(z.object({ chatRoomId: z.number() }))
  //   .query(async ({ input }) => {
  //     return await prisma.supportTicket.findUnique({
  //       where: { chatRoomSupportId: input.chatRoomId },
  //       include: { messages: true },
  //     });
  //   }),
  getTicketsByManagerId: procedure
    .input(z.object({ managerId: z.number() }))
    .query(async ({ input }) => {
      return await prisma.supportTicket.findMany({
        where: { managerId: input.managerId },
        include: {
          buyer: true, // Include buyer details
          seller: true, // Include seller details
          messages: true, // Include messages
        },
      });
    }),
  getTicketByChatRoomId: procedure
    .input(z.object({ chatRoomId: z.number() }))
    .query(async ({ input }) => {
      return await prisma.supportTicket.findUnique({
        where: { chatRoomSupportId: input.chatRoomId },
        include: {
          buyer: true, // Include buyer details
          seller: true, // Include seller details
          messages: true, // Include messages
        },
      });
    }),
  assignTicketToManager: procedure
    .input(
      z.object({
        ticketId: z.number(),
        managerId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      return await prisma.supportTicket.update({
        where: { id: input.ticketId },
        data: { managerId: input.managerId },
      });
    }),
  getUnassignedTickets: procedure.query(async () => {
    return await prisma.supportTicket.findMany({
      where: { managerId: null }, // Fetch tickets with no manager assigned
      include: {
        buyer: true, // Include buyer details
        seller: true, // Include seller details
      },
    });
  }),
  closeTicket: procedure
    .input(z.object({ chatRoomId: z.number() }))
    .mutation(async ({ input }) => {
      return await prisma.supportTicket.update({
        where: { chatRoomSupportId: input.chatRoomId },
        data: { status: "CLOSED" },
      });
    }),
});
