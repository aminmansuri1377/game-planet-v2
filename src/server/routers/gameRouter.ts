import { z } from "zod";
import { procedure, router } from "../trpc";
import { PrismaClient, UserRole } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

export const gameRouter = router({
  // Register a new user with a role
  registerUser: procedure
    .input(
      z.object({
        email: z.string().email(),
        name: z.string().optional(),
        password: z.string().min(8), // Ensure password is at least 8 characters
        role: z.enum([UserRole.BUYER, UserRole.SELLER, UserRole.APP_MANAGER]),
      })
    )
    .mutation(async ({ input }) => {
      // Hash the password
      const hashedPassword = await hash(input.password, 10);

      return await prisma.user.create({
        data: {
          email: input.email,
          name: input.name,
          password: hashedPassword, // Save the hashed password
          role: input.role,
        },
      });
    }),

  // Create a product (for SELLER or APP_MANAGER)
  createProduct: procedure
    .input(
      z.object({
        sellerId: z.number(), // Seller ID
        name: z.string(),
        description: z.string(),
        price: z.number(),
        inventory: z.number(), // Number of available items
        sendingType: z.array(z.enum(["SELLER_SENDS", "BUYER_PICKS_UP"])), // Array of sending types
      })
    )
    .mutation(async ({ input }) => {
      return await prisma.product.create({
        data: {
          sellerId: input.sellerId,
          name: input.name,
          description: input.description,
          price: input.price,
          inventory: input.inventory,
          sendingType: input.sendingType, // Save sending types
        },
      });
    }),

  // Get all products (for BUYER, SELLER, or APP_MANAGER)
  getProducts: procedure
    .input(
      z.object({
        name: z.string().optional(), // Optional filter by product name
        sortByPrice: z.boolean().optional(), // Optional sorting by price
      })
    )
    .query(async ({ input }) => {
      return await prisma.product.findMany({
        where: input.name ? { name: input.name } : {},
        orderBy: input.sortByPrice ? { price: "asc" } : undefined, // Sort by price if enabled
      });
    }),
  getSellerProducts: procedure
    .input(
      z.object({
        sellerId: z.number(), // Seller ID
      })
    )
    .query(async ({ input }) => {
      return await prisma.product.findMany({
        where: {
          sellerId: input.sellerId,
        },
      });
    }),

  // Get a product by ID
  getProductById: procedure
    .input(
      z.object({
        id: z.number(), // Product ID
      })
    )
    .query(async ({ input }) => {
      return await prisma.product.findUnique({
        where: { id: input.id },
      });
    }),

  // Update a product
  updateProduct: procedure
    .input(
      z.object({
        productId: z.number(), // Product ID
        sellerId: z.number(), // Seller ID
        name: z.string().optional(),
        description: z.string().optional(),
        price: z.number().optional(),
        inventory: z.number().optional(),
        sendingType: z
          .array(z.enum(["SELLER_SENDS", "BUYER_PICKS_UP"]))
          .optional(),
      })
    )
    .mutation(async ({ input }) => {
      return await prisma.product.update({
        where: { id: input.productId },
        data: {
          name: input.name,
          description: input.description,
          price: input.price,
          inventory: input.inventory,
          sendingType: input.sendingType,
        },
      });
    }),
  // Create an order (for BUYER)
  createOrder: procedure
    .input(
      z.object({
        productId: z.number(),
        userId: z.number(), // Buyer ID
        sellerId: z.number(), // Seller ID
        status: z.string().default("waiting for confirmation"),
        sendingType: z.enum(["SELLER_SENDS", "BUYER_PICKS_UP"]), // Add this line
      })
    )
    .mutation(async ({ input }) => {
      return await prisma.order.create({
        data: {
          productId: input.productId,
          userId: input.userId,
          sellerId: input.sellerId,
          status: input.status,
          sendingType: input.sendingType, // Add this line
        },
      });
    }),

  // Get orders for a seller (for SELLER or APP_MANAGER)
  getSellerOrders: procedure
    .input(z.object({ sellerId: z.number() }))
    .query(async ({ input }) => {
      return await prisma.order.findMany({
        where: {
          sellerId: input.sellerId,
        },
        include: {
          user: true, // Include buyer details
          product: true, // Include product details
        },
      });
    }),
  getOrders: procedure
    .input(
      z.object({
        userId: z.number(), // Buyer's user ID
      })
    )
    .query(async ({ input }) => {
      return await prisma.order.findMany({
        where: {
          userId: input.userId, // Filter orders by the buyer's ID
        },
        include: {
          product: true, // Include product details
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
  getAllOrders: procedure.query(async () => {
    return await prisma.order.findMany({
      include: {
        user: true, // Include buyer details
        product: true, // Include product details
      },
    });
  }),
  deleteProduct: procedure
    .input(
      z.object({
        productId: z.number(), // Product ID
        sellerId: z.number(), // Seller ID
      })
    )
    .mutation(async ({ input }) => {
      // Check if the product belongs to the seller
      const product = await prisma.product.findUnique({
        where: { id: input.productId },
      });

      if (!product || product.sellerId !== input.sellerId) {
        throw new Error("You are not authorized to delete this product.");
      }

      // Delete the product
      return await prisma.product.delete({
        where: { id: input.productId },
      });
    }),
});
