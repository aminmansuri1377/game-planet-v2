import { z } from "zod";
import { procedure, router } from "../trpc";
import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

export const guarantyRouter = router({
  createGuaranty: procedure
    .input(z.object({ text: z.string() }))
    .mutation(async ({ input }) => {
      return await prisma.guaranty.create({
        data: {
          text: input.text,
        },
      });
    }),

  getGuaranty: procedure.query(async () => {
    return await prisma.guaranty.findMany();
  }),

  deleteGuaranty: procedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return await prisma.guaranty.delete({
        where: { id: input.id },
      });
    }),
});
