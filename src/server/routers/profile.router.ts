import { z } from "zod";
import { procedure, router } from "../trpc";
import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

export const profileRouter = router({
  completeBuyerProfile: procedure
    .input(
      z.object({
        userId: z.number(),
        firstName: z.string(),
        lastName: z.string(),
        IDnumber: z.string(),
        idCardImage: z.array(z.string()).optional(),
        profileImage: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const {
        userId,
        firstName,
        lastName,
        IDnumber,
        idCardImage,
        profileImage,
      } = input;
      return await prisma.buyer.update({
        where: { id: userId },
        data: { firstName, lastName, IDnumber, idCardImage, profileImage },
      });
    }),
  photoBuyerProfile: procedure
    .input(
      z.object({
        userId: z.number(),
        profileImage: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { userId, profileImage } = input;
      return await prisma.buyer.update({
        where: { id: userId },
        data: { profileImage },
      });
    }),
  photoSellerProfile: procedure
    .input(
      z.object({
        userId: z.number(),
        profileImage: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { userId, profileImage } = input;
      return await prisma.seller.update({
        where: { id: userId },
        data: { profileImage },
      });
    }),
  getBuyerProfile: procedure
    .input(
      z.object({
        userId: z.number(),
      })
    )
    .query(async ({ input }) => {
      const { userId } = input;
      return await prisma.buyer.findUnique({
        where: { id: userId },
        select: {
          profileImage: true,
        },
      });
    }),
  getSellerProfile: procedure
    .input(
      z.object({
        userId: z.number(),
      })
    )
    .query(async ({ input }) => {
      const { userId } = input;
      return await prisma.seller.findUnique({
        where: { id: userId },
        select: {
          profileImage: true,
        },
      });
    }),
  completeSellerProfile: procedure
    .input(
      z.object({
        userId: z.number(),
        firstName: z.string(),
        lastName: z.string(),
        IDnumber: z.string(),
        idCardImage: z.array(z.string()).optional(),
        profileImage: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const {
        userId,
        firstName,
        lastName,
        IDnumber,
        idCardImage,
        profileImage,
      } = input;
      return await prisma.seller.update({
        where: { id: userId },
        data: { firstName, lastName, IDnumber, idCardImage, profileImage },
      });
    }),
  confirmBuyer: procedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ input }) => {
      return await prisma.buyer.update({
        where: { id: input.userId },
        data: { confirmed: true },
      });
    }),

  unconfirmBuyer: procedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ input }) => {
      return await prisma.buyer.update({
        where: { id: input.userId },
        data: { confirmed: false },
      });
    }),

  confirmSeller: procedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ input }) => {
      return await prisma.seller.update({
        where: { id: input.userId },
        data: { confirmed: true },
      });
    }),

  unconfirmSeller: procedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ input }) => {
      return await prisma.seller.update({
        where: { id: input.userId },
        data: { confirmed: false },
      });
    }),
  getBuyerById: procedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      return await prisma.buyer.findUnique({
        where: { id: input.userId },
        include: { orders: true }, // Include orders for buyers
      });
    }),

  getSellerById: procedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      return await prisma.seller.findUnique({
        where: { id: input.userId },
        include: { products: true, sellerOrders: true }, // Include products and orders for sellers
      });
    }),
  getSellerLocations: procedure
    .input(z.object({ sellerId: z.number() }))
    .query(async ({ input }) => {
      return await prisma.location.findMany({
        where: { sellerId: input.sellerId },
      });
    }),
  getBuyers: procedure.query(async () => {
    return await prisma.buyer.findMany();
  }),
  getSellers: procedure.query(async () => {
    return await prisma.seller.findMany();
  }),
  getBuyersByPhone: procedure
    .input(z.object({ phone: z.string() }))
    .query(async ({ input }) => {
      return await prisma.buyer.findMany({
        where: {
          phone: {
            contains: input.phone, // Partial match
            mode: "insensitive", // Case insensitive
          },
        },
      });
    }),
  getSellersByPhone: procedure
    .input(z.object({ phone: z.string() }))
    .query(async ({ input }) => {
      return await prisma.seller.findMany({
        where: {
          phone: {
            contains: input.phone, // Partial match
            mode: "insensitive", // Case insensitive
          },
        },
      });
    }),
});
