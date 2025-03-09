import { z } from "zod";
import { procedure, router } from "../trpc";
import { PrismaClient, UserRole } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

export const gameRouter = router({
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
  ////////////complete profile
  completeBuyerProfile: procedure
    .input(
      z.object({
        userId: z.number(),
        firstName: z.string(),
        lastName: z.string(),
        IDnumber: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { userId, firstName, lastName, IDnumber } = input;
      return await prisma.buyer.update({
        where: { id: userId },
        data: { firstName, lastName, IDnumber },
      });
    }),

  completeSellerProfile: procedure
    .input(
      z.object({
        userId: z.number(),
        firstName: z.string(),
        lastName: z.string(),
        IDnumber: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { userId, firstName, lastName, IDnumber } = input;
      return await prisma.seller.update({
        where: { id: userId },
        data: { firstName, lastName, IDnumber },
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

  getBuyers: procedure.query(async () => {
    return await prisma.buyer.findMany();
  }),
  getSellers: procedure.query(async () => {
    return await prisma.seller.findMany();
  }),
  // server/routers/productRouter.ts
  createProduct: procedure
    .input(
      z.object({
        sellerId: z.number(),
        name: z.string(),
        description: z.string(),
        price: z.number(),
        inventory: z.number(),
        sendingType: z.array(z.enum(["SELLER_SENDS", "BUYER_PICKS_UP"])),
        categoryId: z.number(),
        guarantyId: z.number(),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
        city: z.string().optional(),
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
          sendingType: input.sendingType,
          categoryId: input.categoryId,
          guarantyId: input.guarantyId,
          latitude: input.latitude,
          longitude: input.longitude,
          city: input.city,
        },
      });
    }),
  getProductsByCategory: procedure
    .input(
      z.object({
        categoryId: z.number(),
        sortByPrice: z.boolean().optional(),
        city: z.string().optional(), // Add city filter
      })
    )
    .query(async ({ input }) => {
      return await prisma.product.findMany({
        where: {
          categoryId: input.categoryId,
          city: input.city
            ? { contains: input.city, mode: "insensitive" }
            : undefined, // Filter by city
        },
        orderBy: input.sortByPrice ? { price: "asc" } : undefined,
      });
    }),

  searchProducts: procedure
    .input(
      z.object({
        query: z.string(),
        sortByPrice: z.boolean().optional(),
        city: z.string().optional(), // Add city filter
      })
    )
    .query(async ({ input }) => {
      return await prisma.product.findMany({
        where: {
          name: {
            contains: input.query,
            mode: "insensitive",
          },
          city: input.city
            ? { contains: input.city, mode: "insensitive" } // Filter by city
            : undefined,
        },
        orderBy: input.sortByPrice ? { price: "asc" } : undefined,
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
        include: {
          category: true,
          guaranty: true,
        },
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
  ///////////////category
  createCategory: procedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ input }) => {
      return await prisma.category.create({
        data: {
          name: input.name,
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
  //////////////////guaranty
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
  getProductNames: procedure
    .input(
      z.object({
        query: z.string(), // Search query
      })
    )
    .query(async ({ input }) => {
      return await prisma.product
        .findMany({
          where: {
            name: {
              contains: input.query,
              mode: "insensitive", // Case-insensitive search
            },
          },
          select: {
            name: true, // Only fetch the product name
          },
          take: 5, // Limit the number of suggestions
        })
        .then((products) => products.map((p) => p.name));
    }),
  ///////////SAVED PRODUCTS
  // Save a product for a buyer
  saveProduct: procedure
    .input(
      z.object({
        buyerId: z.number(),
        productId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      return await prisma.savedProduct.create({
        data: {
          buyerId: input.buyerId,
          productId: input.productId,
        },
      });
    }),

  // Unsave a product for a buyer
  unsaveProduct: procedure
    .input(
      z.object({
        buyerId: z.number(),
        productId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      return await prisma.savedProduct.delete({
        where: {
          buyerId_productId: {
            buyerId: input.buyerId,
            productId: input.productId,
          },
        },
      });
    }),

  // Get saved products for a buyer
  getSavedProducts: procedure
    .input(z.object({ buyerId: z.number() }))
    .query(async ({ input }) => {
      return await prisma.savedProduct.findMany({
        where: { buyerId: input.buyerId },
        include: { product: true }, // Include product details
      });
    }),
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
});
