import { z } from "zod";
import { procedure, router } from "../trpc";
import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

export const locationsRouter = router({
  /////////////////personal location
  addLocation: procedure
    .input(
      z.object({
        title: z.string(),
        latitude: z.number(),
        longitude: z.number(),
        address: z.string(),
        buyerId: z.number().optional(),
        sellerId: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      if (!input.buyerId && !input.sellerId) {
        throw new Error("Either buyerId or sellerId must be provided.");
      }

      if (input.buyerId && input.sellerId) {
        throw new Error(
          "A location cannot be linked to both a buyer and a seller."
        );
      }

      return await prisma.location.create({
        data: {
          title: input.title,
          latitude: input.latitude,
          longitude: input.longitude,
          address: input.address,
          buyerId: input.buyerId,
          sellerId: input.sellerId,
        },
      });
    }),
  getUserLocations: procedure
    .input(
      z.object({
        buyerId: z.number().optional(),
        sellerId: z.number().optional(),
      })
    )
    .query(async ({ input }) => {
      if (!input.buyerId && !input.sellerId) {
        throw new Error("Either buyerId or sellerId must be provided.");
      }

      return await prisma.location.findMany({
        where: {
          OR: [{ buyerId: input.buyerId }, { sellerId: input.sellerId }],
        },
      });
    }),
  deleteLocation: procedure
    .input(z.object({ locationId: z.number() }))
    .mutation(async ({ input }) => {
      return await prisma.location.delete({
        where: { id: input.locationId },
      });
    }),
  getBuyerLocations: procedure
    .input(z.object({ buyerId: z.number() }))
    .query(async ({ input }) => {
      return await prisma.location.findMany({
        where: { buyerId: input.buyerId },
      });
    }),

  getLocationById: procedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return await prisma.location.findUnique({
        where: { id: input.id },
      });
    }),
});
