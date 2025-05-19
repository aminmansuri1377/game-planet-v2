import { z } from "zod";
import { procedure, router } from "../trpc";
import { PrismaClient, UserRole } from "@prisma/client";
import { hash } from "bcrypt";
import { contractTemplates } from "@/lib/contractTemplates";
// import { createTRPCRouter, protectedProcedure } from "../trpc";

const prisma = new PrismaClient();

export const CategoryRouter = router({
  ///////////////category
  createCategory: procedure
    .input(
      z.object({
        name: z.string(),
        icon: z.string().optional(), // Base64 encoded SVG or filename
      })
    )
    .mutation(async ({ input }) => {
      return await prisma.category.create({
        data: {
          name: input.name,
          icon: input.icon, // Store the SVG data or filename
        },
      });
    }),

  getCategories: procedure.query(async () => {
    return await prisma.category.findMany();
  }),

  getCategoryById: procedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return await prisma.category.findUnique({
        where: { id: input.id },
        include: { products: true },
      });
    }),
  deleteCategory: procedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return await prisma.category.delete({
        where: { id: input.id },
      });
    }),
});
