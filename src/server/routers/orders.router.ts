import { z } from "zod";
import { procedure, router } from "../trpc";
import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

export const ordersRouter = router({
  createOrder: procedure
    .input(
      z.object({
        productId: z.number(),
        userId: z.number(),
        sellerId: z.number(),
        status: z.string().default("waiting for confirmation"),
        sendingType: z.enum(["SELLER_SENDS", "BUYER_PICKS_UP"]),
        startDate: z.string().transform((val) => new Date(val)),
        endDate: z.string().transform((val) => new Date(val)),
        quantity: z.number().min(1),
        totalPrice: z.number(),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
        address: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const result = await prisma.$transaction(async (prisma) => {
        const product = await prisma.product.findUnique({
          where: { id: input.productId },
        });

        if (!product || product.inventory < 1) {
          throw new Error("Product is out of stock");
        }
        const order = await prisma.order.create({
          data: {
            productId: input.productId,
            userId: input.userId,
            sellerId: input.sellerId,
            status: input.status,
            sendingType: input.sendingType,
            startDate: input.startDate,
            endDate: input.endDate,
            totalPrice: input.totalPrice,
            quantity: input.quantity,
            latitude: input.latitude,
            longitude: input.longitude,
            address: input.address,
          },
          include: {
            user: true,
            seller: true,
            product: true,
          },
        });
        await prisma.product.update({
          where: { id: input.productId },
          data: {
            inventory: {
              decrement: input.quantity,
            },
          },
        });
        return order;
      });

      return result;
    }),
  // Get orders for a seller (for SELLER or APP_MANAGER)
  getSellerOrders: procedure
    .input(
      z.object({
        sellerId: z.number(),
        phone: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      return await prisma.order.findMany({
        where: {
          sellerId: input.sellerId,
          ...(input.phone && {
            user: {
              phone: {
                contains: input.phone,
                mode: "insensitive",
              },
            },
          }),
        },
        include: {
          user: true,
          product: true,
        },
      });
    }),
  getSellerOrdersSearch: procedure
    .input(
      z.object({
        sellerId: z.number(),
        phone: z.string().optional(), // Add optional phone search
      })
    )
    .query(async ({ input }) => {
      return await prisma.order.findMany({
        where: {
          sellerId: input.sellerId,
          // Add phone search condition if provided
          ...(input.phone && {
            user: {
              phone: {
                contains: input.phone,
                mode: "insensitive", // Case insensitive search
              },
            },
          }),
        },
        include: {
          user: true,
          product: true,
        },
      });
    }),
  getOrders: procedure
    .input(
      z.object({
        userId: z.number(),
        productName: z.string().optional(), // Add optional product name search
      })
    )
    .query(async ({ input }) => {
      return await prisma.order.findMany({
        where: {
          userId: input.userId,
          ...(input.productName && {
            // Add product name filter if provided
            product: {
              name: {
                contains: input.productName,
                mode: "insensitive", // Case insensitive search
              },
            },
          }),
        },
        include: {
          product: true,
        },
        orderBy: {
          createdAt: "desc", // Default to newest first
        },
      });
    }),
  getOrderById: procedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(async ({ input }) => {
      return await prisma.order.findUnique({
        where: { id: input.id },
        include: {
          product: true,
          seller: true,
          user: true,
        },
      });
    }),
  // Update order status (for SELLER or APP_MANAGER)
  updateOrderStatus: procedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum([
          "waiting for confirmation",
          "confirmed and sent",
          "delivered",
          "taken back",
          "denied",
        ]),
      })
    )
    .mutation(async ({ input }) => {
      return await prisma.order.update({
        where: { id: input.id },
        data: { status: input.status },
      });
    }),
  increaseProductInventory: procedure
    .input(
      z.object({
        productId: z.number(), // Product ID
      })
    )
    .mutation(async ({ input }) => {
      const product = await prisma.product.findUnique({
        where: { id: input.productId },
      });

      if (!product) {
        throw new Error("Product not found");
      }

      // Increment the inventory by 1
      const updatedProduct = await prisma.product.update({
        where: { id: input.productId },
        data: {
          inventory: {
            increment: 1,
          },
        },
      });

      return updatedProduct;
    }),
  // Get all users (for APP_MANAGER)
  getAllUsers: procedure
    .input(
      z.object({
        role: z.enum(["BUYER", "SELLER", "APP_MANAGER"]).optional(), // Optional role filter
      })
    )
    .query(async ({ input }) => {
      return await prisma.user.findMany({
        where: input.role ? { role: input.role } : {}, // Filter by role if provided
      });
    }),

  // Get all orders (for APP_MANAGER)
  // getAllOrders: procedure.query(async () => {
  //   return await prisma.order.findMany({
  //     include: {
  //       user: true, // Include buyer details
  //       product: true, // Include product details
  //     },
  //   });
  // }),
  getAllOrders: procedure
    .input(
      z.object({
        phone: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      return await prisma.order.findMany({
        where: {
          ...(input.phone && {
            user: {
              phone: {
                contains: input.phone,
                mode: "insensitive",
              },
            },
          }),
        },
        include: {
          user: true,
          product: true,
        },
      });
    }),
});
