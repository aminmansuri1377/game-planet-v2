import { z } from "zod";
import { procedure, router } from "../trpc";
import { PrismaClient, UserRole } from "@prisma/client";
import { hash } from "bcrypt";
import { contractTemplates } from "@/lib/contractTemplates";
// import { createTRPCRouter, protectedProcedure } from "../trpc";

const prisma = new PrismaClient();

export const commentsRouter = router({
  ///////////////////comments
  addComment: procedure
    .input(
      z.object({
        productId: z.number(),
        buyerId: z.number(),
        text: z.string().min(1, "Comment cannot be empty"),
      })
    )
    .mutation(async ({ input }) => {
      return await prisma.comment.create({
        data: {
          text: input.text,
          buyerId: input.buyerId,
          productId: input.productId,
        },
      });
    }),
  getCommentsByProduct: procedure
    .input(z.object({ productId: z.number() }))
    .query(async ({ input }) => {
      return await prisma.comment.findMany({
        where: { productId: input.productId },
        include: { buyer: true }, // Include buyer details (e.g., name)
        orderBy: { createdAt: "desc" }, // Sort by newest first
      });
    }),
  deleteComment: procedure
    .input(
      z.object({
        commentId: z.number(),
        buyerId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const comment = await prisma.comment.findUnique({
        where: { id: input.commentId },
      });

      if (!comment) {
        throw new Error("Comment not found");
      }
      if (comment.buyerId !== input.buyerId) {
        throw new Error("You are not authorized to delete this comment");
      }
      return await prisma.comment.delete({
        where: { id: input.commentId },
      });
    }),
  //////////////////// chat
  getChatRooms: procedure
    .input(
      z.object({
        userType: z.enum(["BUYER", "SELLER", "MANAGER"]),
        userId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { userType, userId } = input;

      return await prisma.chatRoom.findMany({
        where: {
          OR: [
            { buyerId: userType === "BUYER" ? userId : undefined },
            { sellerId: userType === "SELLER" ? userId : undefined },
            { managerId: userType === "MANAGER" ? userId : undefined },
          ],
        },
        include: {
          buyer: true,
          seller: true,
          manager: true,
          messages: {
            take: 1,
            orderBy: { createdAt: "desc" },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      });
    }),

  getMessages: procedure
    .input(z.object({ chatRoomId: z.number() }))
    .query(async ({ ctx, input }) => {
      return await prisma.message.findMany({
        where: { chatRoomId: input.chatRoomId },
        orderBy: { createdAt: "asc" },
      });
    }),

  sendMessage: procedure
    .input(
      z.object({
        chatRoomId: z.number(),
        content: z.string(),
        senderType: z.enum(["BUYER", "SELLER", "MANAGER"]),
        senderId: z.number(),
        imageUrl: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await prisma.message.create({
        data: input,
      });
    }),

  createChatRoom: procedure
    .input(
      z.object({
        userType1: z.enum(["BUYER", "SELLER", "MANAGER"]),
        userId1: z.number(),
        userType2: z.enum(["BUYER", "SELLER", "MANAGER"]),
        userId2: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await prisma.chatRoom.create({
        data: {
          [input.userType1.toLowerCase() + "Id"]: input.userId1,
          [input.userType2.toLowerCase() + "Id"]: input.userId2,
        },
      });
    }),
});
