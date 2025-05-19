import { z } from "zod";
import { procedure, router } from "../trpc";
import { PrismaClient, UserRole } from "@prisma/client";
import { hash } from "bcrypt";
import { contractTemplates } from "@/lib/contractTemplates";
// import { createTRPCRouter, protectedProcedure } from "../trpc";

const prisma = new PrismaClient();

export const registrationRouter = router({
  // Register a new user with a role
  // registerUser: procedure
  //   .input(
  //     z.object({
  //       email: z.string().email(),
  //       name: z.string().optional(),
  //       password: z.string().min(8), // Ensure password is at least 8 characters
  //       role: z.enum([UserRole.BUYER, UserRole.SELLER, UserRole.APP_MANAGER]),
  //     })
  //   )
  //   .mutation(async ({ input }) => {
  //     // Hash the password
  //     const hashedPassword = await hash(input.password, 10);

  //     return await prisma.user.create({
  //       data: {
  //         email: input.email,
  //         name: input.name,
  //         password: hashedPassword, // Save the hashed password
  //         role: input.role,
  //       },
  //     });
  //   }),
  registerBuyer: procedure
    .input(
      z.object({
        phone: z
          .string()
          .length(11)
          .regex(/^\d{11}$/),
      })
    )
    .mutation(async ({ input }) => {
      return await prisma.buyer.create({
        data: {
          phone: input.phone,
        },
      });
    }),
  registerSeller: procedure
    .input(
      z.object({
        phone: z
          .string()
          .length(11)
          .regex(/^\d{11}$/),
      })
    )
    .mutation(async ({ input }) => {
      return await prisma.seller.create({
        data: {
          phone: input.phone,
        },
      });
    }),
  registerManager: procedure
    .input(
      z.object({
        phone: z
          .string()
          .length(11)
          .regex(/^\d{11}$/),
      })
    )
    .mutation(async ({ input }) => {
      return await prisma.manager.create({
        data: {
          phone: input.phone,
        },
      });
    }),
});
